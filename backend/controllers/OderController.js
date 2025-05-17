// orderController.js

import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

//creates order of all the items for checkout
// export const createOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { shippingAddress, paymentMethod, taxAmount, shippingAmount } =
//       req.body;

//     // Get user's cart
//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const orderItems = [];
//     let totalAmount = 0;

//     for (const item of cart.items) {
//       const product = item.product;

//       if (!product || product.inStock < item.quantity) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({
//           message: `${
//             product?.name || "Product"
//           } is out of stock or has insufficient quantity.`,
//         });
//       }

//       product.inStock -= item.quantity;
//       await product.save({ session });

//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         image: product.images[0] || "",
//       });

//       totalAmount += product.price * item.quantity;
//     }

//     totalAmount += Number(taxAmount) + Number(shippingAmount);

//     const order = await Order.create(
//       [
//         {
//           user: req.user._id,
//           orderItems,
//           shippingAddress,
//           paymentMethod,
//           taxAmount,
//           shippingAmount,
//           totalAmount,
//         },
//       ],
//       { session }
//     );

//     cart.items = [];
//     cart.totalAmount = 0;
//     await cart.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json(order[0]);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: error.message });
//   }
// };

//for single item
// export const createOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       shippingAddress,
//       paymentMethod,
//       taxAmount,
//       shippingAmount,
//       productIds, // optional array of product IDs
//     } = req.body;

//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let itemsToOrder;

//     if (productIds && Array.isArray(productIds) && productIds.length > 0) {
//       // Filter cart items by provided product IDs
//       const productIdSet = new Set(productIds.map((id) => id.toString()));
//       itemsToOrder = cart.items.filter((item) =>
//         productIdSet.has(item.product._id.toString())
//       );

//       if (itemsToOrder.length === 0) {
//         await session.abortTransaction();
//         session.endSession();
//         return res
//           .status(400)
//           .json({ message: "None of the selected products found in cart" });
//       }
//     } else {
//       // Order all items in cart
//       itemsToOrder = cart.items;
//     }

//     const orderItems = [];
//     let totalAmount = 0;

//     for (const item of itemsToOrder) {
//       const product = item.product;

//       if (product.inStock < item.quantity) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({
//           message: `${product.name} is out of stock or has insufficient quantity.`,
//         });
//       }

//       product.inStock -= item.quantity;
//       await product.save({ session });

//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         image: product.images[0] || "",
//       });

//       totalAmount += product.price * item.quantity;
//     }

//     totalAmount += Number(taxAmount) + Number(shippingAmount);

//     const order = await Order.create(
//       [
//         {
//           user: req.user._id,
//           orderItems,
//           shippingAddress,
//           paymentMethod,
//           taxAmount,
//           shippingAmount,
//           totalAmount,
//         },
//       ],
//       { session }
//     );

//     // Remove only the ordered items from the cart
//     const orderedProductIds = new Set(
//       itemsToOrder.map((item) => item.product._id.toString())
//     );

//     cart.items = cart.items.filter(
//       (item) => !orderedProductIds.has(item.product._id.toString())
//     );

//     cart.totalAmount = cart.items.reduce(
//       (sum, item) => sum + item.quantity * item.product.price,
//       0
//     );

//     await cart.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json(order[0]);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      orderItems, // This is what the frontend is sending
      shippingAddress,
      paymentMethod,
      taxAmount = 0,
      shippingAmount = 0,
      productIds,
    } = req.body;

    // Ensure tax and shipping are numbers (not NaN)
    const taxAmountNumber = Number(taxAmount) || 0;
    const shippingAmountNumber = Number(shippingAmount) || 0;

    // IMPORTANT FIX: Handle the case where we have direct orderItems from frontend
    let itemsToOrder = [];
    let subtotal = 0;

    if (orderItems && Array.isArray(orderItems)) {
      // Case 1: Direct orderItems provided by frontend
      // We'll need to fetch products to update inventory
      const productIds = orderItems.map((item) => item.productId);

      // Fetch all products referenced in the order
      const products = await Product.find({
        _id: { $in: productIds },
      });

      // Create a map for quick lookups
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id.toString()] = product;
      });

      // Process the direct order items
      const orderItemsArray = [];

      for (const item of orderItems) {
        const product = productMap[item.productId];

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.inStock < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `${product.name} is out of stock or has insufficient quantity.`,
          });
        }

        // Update inventory
        product.inStock -= item.quantity;
        await product.save({ session });

        // Create order item
        orderItemsArray.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
        });

        subtotal += product.price * item.quantity;
      }

      // Calculate total amount safely
      const totalAmount = subtotal + taxAmountNumber + shippingAmountNumber;

      // Ensure all values are valid numbers before saving
      if (isNaN(totalAmount)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Invalid amount values",
          debug: {
            subtotal,
            taxAmount: taxAmountNumber,
            shippingAmount: shippingAmountNumber,
          },
        });
      }

      const order = await Order.create(
        [
          {
            user: req.user._id,
            orderItems: orderItemsArray,
            shippingAddress,
            paymentMethod,
            taxAmount: taxAmountNumber,
            shippingAmount: shippingAmountNumber,
            totalAmount: totalAmount,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json(order[0]);
    } else {
      // Case 2: Original flow - using cart items
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
      );

      if (!cart || cart.items.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Cart is empty" });
      }

      // The rest of your original code for processing cart items...
      // ...
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order API error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this order" });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;

      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
