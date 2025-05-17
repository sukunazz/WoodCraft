import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { type: String, default: "cm" },
    },
    weight: { type: Number },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String }, // Add userName field
        rating: { type: Number },
        title: { type: String }, // Add title field
        comment: { type: String },
        date: { type: Date, default: Date.now }, // Add date field
      },
    ],
  },
  { timestamps: true }
);

// Add text index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  material: "text",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
