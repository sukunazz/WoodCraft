// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
} from "../controllers/OderController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.route("/").post(protect, createOrder).get(protect, getUserOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;
