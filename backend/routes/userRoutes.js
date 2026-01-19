// routes/userRoutes.js
import express from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerification,
  updateUserProfile,
  changePassword,
  refreshToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getAuthStatus,
  getLoginActivity,
  updateUserAvatar,
} from "../controllers/UserController.js";
import { protect } from "../Middleware/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

router.post("/resend-verification", resendVerification);
// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/status", protect, getAuthStatus);
router.get("/activity", protect, getLoginActivity);
router.post("/avatar", protect, upload.single("avatar"), updateUserAvatar);
router.post("/change-password", protect, changePassword);
export default router;
