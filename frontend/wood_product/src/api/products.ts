// import {
//   Product,
//   ApiResponse,
//   PaginatedResponse,
//   ReviewFormData,
//   ProductFormData,
// } from "../types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const getProducts = async (
//   keyword = "",
//   pageNumber = 1,
//   category = "",
//   sortBy = ""
// ): Promise<PaginatedResponse<Product>> => {
//   try {
//     let url = `${API_URL}/products?pageNumber=${pageNumber}`;

//     // Add keyword search parameter
//     if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

//     // Add category filter
//     if (category) url += `&category=${encodeURIComponent(category)}`;

//     // Map frontend sort options to backend sort parameters
//     if (sortBy) {
//       // The backend expects: priceAsc, priceDesc, newest, popular
//       url += `&sortBy=${encodeURIComponent(sortBy)}`;
//     }

//     console.log("Fetching products from:", url); // Debug log

//     const response = await fetch(url);
//     const data = await response.json();

//     console.log("API Response:", data); // Debug the response

//     if (!response.ok) {
//       return {
//         success: false,
//         data: { items: [], page: 1, pages: 1, total: 0 },
//         error: data.message || "Failed to fetch products",
//       };
//     }

//     return {
//       success: true,
//       data: {
//         items: data.products,
//         page: data.page,
//         pages: data.pages,
//         total: data.count,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       success: false,
//       data: { items: [], page: 1, pages: 1, total: 0 },
//       error: "Network error. Please try again.",
//     };
//   }
// };

// // Get product by ID
// export const getProductById = async (
//   id: string
// ): Promise<ApiResponse<Product>> => {
//   try {
//     const response = await fetch(`${API_URL}/products/${id}`);
//     const data = await response.json();

//     if (!response.ok) {
//       return { success: false, error: data.message || "Product not found" };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Create product review
// export const createProductReview = async (
//   productId: string,
//   reviewData: ReviewFormData
// ): Promise<ApiResponse<null>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(reviewData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to submit review",
//       };
//     }

//     return { success: true, message: data.message };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Admin: Add new product
// export const addProduct = async (
//   productData: ProductFormData
// ): Promise<ApiResponse<Product>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/products/addProducts`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(productData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return { success: false, error: data.message || "Failed to add product" };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Admin: Update product
// export const updateProduct = async (
//   id: string,
//   productData: ProductFormData
// ): Promise<ApiResponse<Product>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/products/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(productData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to update product",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Admin: Update product stock
// export const updateProductStock = async (
//   productId: string,
//   quantity: number
// ): Promise<ApiResponse<Product>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/products/inventory`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ productId, quantity }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to update stock",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Admin: Get low stock products
// export const getLowStockProducts = async (): Promise<
//   ApiResponse<Product[]>
// > => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/products/inventory/low-stock`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to fetch low stock products",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };
import {
  Product,
  ApiResponse,
  PaginatedResponse,
  ReviewFormData,
  ProductFormData,
  Review,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return { message: "Unexpected server response" };
};

export const getProducts = async (
  keyword = "",
  pageNumber = 1,
  category = "",
  sortBy = ""
): Promise<PaginatedResponse<Product>> => {
  try {
    let url = `${API_URL}/products?pageNumber=${pageNumber}`;

    // Add keyword search parameter
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

    // Add category filter
    if (category) url += `&category=${encodeURIComponent(category)}`;

    // Map frontend sort options to backend sort parameters
    if (sortBy) {
      // The backend expects: priceAsc, priceDesc, newest, popular
      url += `&sortBy=${encodeURIComponent(sortBy)}`;
    }

    console.log("Fetching products from:", url); // Debug log

    const response = await fetch(url);
    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch products",
      };
    }

    const items = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.products)
      ? data.products
      : Array.isArray(data)
      ? data
      : [];
    const page = data.page ?? 1;
    const pages = data.pages ?? 1;
    const total = data.total ?? data.count ?? items.length;

    return { success: true, data: { items, page, pages, total } };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      credentials: "include",
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Product not found" };
    }

    const product = data.product ?? data;
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Create product review
export const createProductReview = async (
  productId: string,
  reviewData: ReviewFormData
): Promise<ApiResponse<Review>> => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to submit review",
      };
    }

    return { success: true, data: data.review, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Update product review
export const updateProductReview = async (
  productId: string,
  reviewData: ReviewFormData
): Promise<ApiResponse<Review>> => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update review",
      };
    }

    return { success: true, data: data.review, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Delete product review
export const deleteProductReview = async (
  productId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to delete review",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Admin: Add new product
export const uploadProductImage = async (
  file: File
): Promise<ApiResponse<{ url: string }>> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/products/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to upload image" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const addProduct = async (
  productData: ProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_URL}/products/addProducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(productData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to add product" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Admin: Update product
export const updateProduct = async (
  id: string,
  productData: ProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(productData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update product",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Admin: Update product stock
export const updateProductStock = async (
  productId: string,
  quantity: number
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_URL}/products/inventory`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update stock",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Admin: Get low stock products
export const getLowStockProducts = async (): Promise<
  ApiResponse<Product[]>
> => {
  try {
    const response = await fetch(`${API_URL}/products/inventory/low-stock`, {
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch low stock products",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};
