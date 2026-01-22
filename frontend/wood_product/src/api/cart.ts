import { CartItem, ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get user cart
export const getCart = async (): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to fetch cart" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to add to cart" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Update cart item quantity
// Update cart item quantity
export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<ApiResponse<CartItem[]>> => {
  try {
    console.log("Sending update request:", { productId, quantity });

    const response = await fetch(`${API_URL}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          `Failed to update cart: ${response.status} ${response.statusText}`,
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Cart update error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};
// Remove item from cart
export const removeFromCart = async (
  productId: string
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to remove from cart",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Clear cart
export const clearCart = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to clear cart" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};
