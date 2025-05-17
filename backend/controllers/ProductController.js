// import Product from "../models/Product.js";

// export const addProduct = async (req, res) => {
//   const {
//     name,
//     description,
//     price,
//     category,
//     material,
//     dimensions,
//     weight,
//     images,
//     inStock,
//     featured,
//     ratings,
//   } = req.body;

//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (!name || !description || !price || !category || !material || !inStock) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields." });
//     }

//     const newProduct = new Product({
//       name,
//       description,
//       price,
//       category,
//       material,
//       dimensions,
//       weight,
//       images,
//       inStock,
//       featured,
//       ratings,
//     });

//     await newProduct.save();

//     res
//       .status(201)
//       .json({ message: "Product added successfully!", product: newProduct });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     const pageSize = 10;
//     const page = Number(req.query.pageNumber) || 1;

//     const filter = {};

//     // Category filter
//     if (req.query.category) {
//       filter.category = req.query.category;
//     }

//     // Material filter
//     if (req.query.material) {
//       filter.material = req.query.material;
//     }

//     // Price range filter
//     const { minPrice, maxPrice } = req.query;
//     if (minPrice && maxPrice) {
//       filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
//     } else if (minPrice) {
//       filter.price = { $gte: Number(minPrice) };
//     } else if (maxPrice) {
//       filter.price = { $lte: Number(maxPrice) };
//     }

//     // Keyword search
//     if (req.query.keyword) {
//       filter.$text = { $search: req.query.keyword };
//     }

//     // In stock filter
//     if (req.query.inStock === "true") {
//       filter.inStock = { $gt: 0 };
//     }

//     // Featured filter
//     if (req.query.featured === "true") {
//       filter.featured = true;
//     }

//     const count = await Product.countDocuments(filter);

//     // Sorting
//     const sortOption = {};
//     switch (req.query.sortBy) {
//       case "priceAsc":
//         sortOption.price = 1;
//         break;
//       case "priceDesc":
//         sortOption.price = -1;
//         break;
//       case "newest":
//         sortOption.createdAt = -1;
//         break;
//       case "popular":
//         sortOption["ratings.rating"] = -1;
//         break;
//       default:
//         sortOption.createdAt = -1;
//     }

//     const products = await Product.find(filter)
//       .sort(sortOption)
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     res.json({
//       products,
//       page,
//       pages: Math.ceil(count / pageSize),
//       count,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get product by ID
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ message: "Product not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create product review
// export const createProductReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const alreadyReviewed = product.ratings.find(
//       (r) => r.user.toString() === req.user._id.toString()
//     );

//     if (alreadyReviewed) {
//       return res.status(400).json({ message: "Product already reviewed" });
//     }

//     const review = {
//       user: req.user._id,
//       rating: Number(rating),
//       comment,
//     };

//     product.ratings.push(review);
//     await product.save();

//     res.status(201).json({ message: "Review added" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update product stock
// export const updateProductStock = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     product.inStock = quantity;
//     await product.save();

//     res.json({ message: "Inventory updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get products with low stock
// export const getLowStockProducts = async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const lowStockThreshold = 5;

//     const products = await Product.find({
//       inStock: { $lt: lowStockThreshold },
//     }).sort({ inStock: 1 });

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update product
// export const updateProduct = async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Update all fields from req.body
//     Object.keys(req.body).forEach((key) => {
//       product[key] = req.body[key];
//     });

//     await product.save();

//     res.json({ message: "Product updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    material,
    dimensions,
    weight,
    images,
    inStock,
    featured,
    ratings,
  } = req.body;

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!name || !description || !price || !category || !material || !inStock) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      material,
      dimensions,
      weight,
      images,
      inStock,
      featured,
      ratings,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {};

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Material filter
    if (req.query.material) {
      filter.material = req.query.material;
    }

    // Price range filter
    const { minPrice, maxPrice } = req.query;
    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    // Keyword search
    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    // In stock filter
    if (req.query.inStock === "true") {
      filter.inStock = { $gt: 0 };
    }

    // Featured filter
    if (req.query.featured === "true") {
      filter.featured = true;
    }

    const count = await Product.countDocuments(filter);

    // Sorting
    const sortOption = {};
    switch (req.query.sortBy) {
      case "priceAsc":
        sortOption.price = 1;
        break;
      case "priceDesc":
        sortOption.price = -1;
        break;
      case "newest":
        sortOption.createdAt = -1;
        break;
      case "popular":
        sortOption["ratings.rating"] = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product review
// Create product review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name, // Changed from name to userName to match schema
      rating: Number(rating),
      title,
      comment,
      date: Date.now(),
    };

    product.ratings.push(review);

    // Calculate average rating
    product.numReviews = product.ratings.length;
    product.averageRating =
      product.ratings.reduce((acc, item) => item.rating + acc, 0) /
      product.ratings.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update review
export const updateProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find review index in the ratings array
    const reviewIndex = product.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Update the review
    product.ratings[reviewIndex].rating = Number(rating);
    product.ratings[reviewIndex].title = title;
    product.ratings[reviewIndex].comment = comment;
    product.ratings[reviewIndex].date = Date.now(); // Update the date to reflect edit
    // Keep the userName the same when updating

    // Recalculate average rating
    product.averageRating =
      product.ratings.reduce((acc, item) => item.rating + acc, 0) /
      product.ratings.length;

    await product.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      review: product.ratings[reviewIndex],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
export const deleteProductReview = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find review index
    const reviewIndex = product.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Remove review from array
    product.ratings.splice(reviewIndex, 1);

    // Update review count and recalculate average
    product.numReviews = product.ratings.length;

    if (product.ratings.length > 0) {
      product.averageRating =
        product.ratings.reduce((acc, item) => item.rating + acc, 0) /
        product.ratings.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.ratings,
      count: product.ratings.length,
      averageRating: product.averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific review by user
export const getUserReviewForProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "You haven't reviewed this product yet",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get top rated reviews for a product
export const getTopProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Sort reviews by rating (highest first) and get top 5
    const topReviews = [...product.ratings]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      reviews: topReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update product stock
export const updateProductStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.inStock = quantity;
    await product.save();

    res.json({ message: "Inventory updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products with low stock
export const getLowStockProducts = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lowStockThreshold = 5;

    const products = await Product.find({
      inStock: { $lt: lowStockThreshold },
    }).sort({ inStock: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update all fields from req.body
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
