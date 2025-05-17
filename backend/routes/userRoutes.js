// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerification,
  updateUserProfile,
  changePassword,
} from "../controllers/UserController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

router.post("/resend-verification", resendVerification);
// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post("/change-password", protect, changePassword);
export default router;
