// import { Order, ApiResponse, ShippingAddress } from "../types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // Create a new order
// // export const createOrder = async (
// //   orderItems: { productId: string; quantity: number }[],
// //   shippingAddress: ShippingAddress,
// //   paymentMethod: string,
// //   paymentDetails?: {
// //     subtotal: number;
// //     shipping: number;
// //     tax: number;
// //     total: number;
// //   }
// // ): Promise<ApiResponse<Order>> => {
// //   try {
// //     const token = localStorage.getItem("userToken");

// //     if (!token) {
// //       return { success: false, error: "No authentication token found" };
// //     }

// //     // Calculate total amount if not provided
// //     const totalAmount = paymentDetails?.total || 0;

// //     const response = await fetch(`${API_URL}/orders`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         orderItems,
// //         shippingAddress,
// //         paymentMethod,
// //         totalAmount: Number(totalAmount.toFixed(2)), // Ensure it's a valid number with 2 decimal places
// //         subtotal: Number(paymentDetails?.subtotal.toFixed(2)) || 0,
// //         shipping: Number(paymentDetails?.shipping.toFixed(2)) || 0,
// //         tax: Number(paymentDetails?.tax.toFixed(2)) || 0,
// //       }),
// //     });

// //     const data = await response.json();

// //     if (!response.ok) {
// //       return {
// //         success: false,
// //         error: data.message || "Failed to create order",
// //       };
// //     }

// //     return { success: true, data: data };
// //   } catch (error) {
// //     console.error("Order creation error:", error);
// //     return {
// //       success: false,
// //       error:
// //         error instanceof Error
// //           ? error.message
// //           : "Network error. Please try again.",
// //     };
// //   }
// // };

// export const createOrder = async (
//   orderItems: any[],
//   shippingAddress: any,
//   paymentMethod: string,
//   paymentInfo: {
//     taxAmount?: number;
//     shippingAmount?: number;
//     paymentDetails?: any;
//   }
// ) => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         taxAmount: paymentInfo.taxAmount || 0,
//         shippingAmount: paymentInfo.shippingAmount || 0,
//         // Don't pass paymentDetails to backend if not needed
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to create order");
//     }

//     return { success: true, data };
//   } catch (error: any) {
//     console.error("Order creation error:", error);
//     return { success: false, error: error.message };
//   }
// };

// // Get user orders
// export const getUserOrders = async (): Promise<Order[]> => {
//   const token = localStorage.getItem("userToken");

//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   const response = await fetch(`${API_URL}/orders`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok || !data.success) {
//     throw new Error(data.message || "Failed to fetch orders");
//   }

//   return data.data; // Return just the Order[]
// };

// // Get order by ID
// export const getOrderById = async (
//   orderId: string
// ): Promise<ApiResponse<Order>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/orders/${orderId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return { success: false, error: data.message || "Failed to fetch order" };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Update order to paid
// export const updateOrderToPaid = async (
//   orderId: string,
//   paymentResult: {
//     id: string;
//     status: string;
//     update_time: string;
//     email_address?: string;
//   }
// ): Promise<ApiResponse<Order>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(paymentResult),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to update payment status",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Admin: Update order status
// export const updateOrderStatus = async (
//   orderId: string,
//   status: string
// ): Promise<ApiResponse<Order>> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to update order status",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// orders.ts - Keep your existing API functions but fix the getUserOrders implementation
import { ApiResponse, Order, ShippingAddress } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createOrder = async (
  orderItems: any[],
  shippingAddress: any,
  paymentMethod: string,
  paymentInfo: {
    taxAmount?: number;
    shippingAmount?: number;
    paymentDetails?: any;
  }
) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderItems,
        shippingAddress,
        paymentMethod,
        taxAmount: paymentInfo.taxAmount || 0,
        shippingAmount: paymentInfo.shippingAmount || 0,
        // Don't pass paymentDetails to backend if not needed
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message };
  }
};

// Get user orders - FIXED: Handle direct array response without success wrapper
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const data = await response.json();


    // Check if the response is an array directly (as shown in your network tab)
    // or if it's wrapped in a data property
    if (Array.isArray(data)) {
      return data; // Return the array directly
    } else if (data.data && Array.isArray(data.data)) {
      return data.data; // Return the nested array if it exists
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (
  orderId: string
): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to fetch order" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Other existing functions remain unchanged
export const updateOrderToPaid = async (
  orderId: string,
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address?: string;
  }
): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(paymentResult),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update payment status",
      };
    }

    const updatedOrder = await response.json();
    return { success: true, data: updatedOrder };
  } catch (error) {
    console.error("Error updating order to paid:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update order status",
      };
    }

    const updatedOrder = await response.json();
    return { success: true, data: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
};
