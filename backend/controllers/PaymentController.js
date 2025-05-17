import axios from "axios";
import Order from "../models/Order.js";

// Initiate Khalti Payment
export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { orderId, amount, returnUrl } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const amountInPaisa = Math.round(amount * 100);

    const khaltiData = {
      return_url: returnUrl,
      website_url: process.env.WEBSITE_URL,
      amount: amountInPaisa,
      purchase_order_id: orderId,
      purchase_order_name: `Order #${orderId.slice(-8)}`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "",
      },
    };

    const { data } = await axios.post(
      "https://khalti.com/api/v2/epayment/initiate/",
      khaltiData,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(data);
  } catch (error) {
    console.error(
      "Khalti initiation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

// Verify Khalti Payment
export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body;

    const { data } = await axios.post(
      "https://khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status === "Completed") {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: pidx,
        status: data.status,
        update_time: new Date().toISOString(),
        email_address: data.user?.email || "",
      };

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }

    res.status(400).json({
      message: "Payment not completed",
      status: data.status,
    });
  } catch (error) {
    console.error(
      "Khalti verification error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};
