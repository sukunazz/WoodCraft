// routes/paymentRoutes.js
import express from "express";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/PaymentController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/khalti/initiate", protect, initiateKhaltiPayment);

router.post("/khalti/verify", protect, verifyKhaltiPayment);

export default router;
