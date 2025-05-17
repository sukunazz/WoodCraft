import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images inStock"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.inStock < quantity) {
      return res.status(400).json({ message: "Not enough items in stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
      });
    } else {
      const existItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existItem) {
        if (product.inStock < existItem.quantity + quantity) {
          return res.status(400).json({ message: "Not enough items in stock" });
        }
        existItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.totalAmount = await calculateTotalAmount(cart.items);
      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price images inStock"
    );

    res.status(201).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.inStock < quantity) {
      return res.status(400).json({ message: "Not enough items in stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price images inStock"
    );

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price images inStock"
    );

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function
async function calculateTotalAmount(items) {
  let total = 0;

  for (let item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  return total;
}
