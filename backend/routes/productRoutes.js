import express from "express";
import multer from "multer";
import { protect, admin } from "../Middleware/authMiddleware.js";
import * as productController from "../controllers/ProductController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Protected routes
router.post("/:id/reviews", protect, productController.createProductReview);
router.put("/:id/reviews", protect, productController.updateProductReview);
router.delete("/:id/reviews", protect, productController.deleteProductReview);
router.get("/:id/reviews", protect, productController.getProductReviews);
router.post("/upload", protect, admin, upload.single("image"), productController.uploadProductImage);
router.post("/addProducts", protect, admin, productController.addProduct);
// Admin routes for inventory management
router.put("/inventory", protect, admin, productController.updateProductStock);
router.put("/:id", protect, admin, productController.updateProduct);
router.get(
  "/inventory/low-stock",
  protect,
  admin,
  productController.getLowStockProducts
);

export default router;
