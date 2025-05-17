// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  removeFromCart,
} from "../controllers/CartController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// All cart routes are protected
router.use(protect);

router
  .route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(clearCart);

router.delete("/:productId", removeFromCart);

export default router;
