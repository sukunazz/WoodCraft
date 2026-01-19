import { ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Process payment (for credit card or other non-redirect methods)
export const processPayment = async (paymentData: {
  amount: number;
  paymentMethod: string;
  cardDetails?: any;
  orderId: string;
}): Promise<{ status: string; id?: string }> => {
  try {
    const response = await fetch(`${API_URL}/payments/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment processing failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Payment processing failed");
  }
};

// Interface for Khalti payment parameters
interface KhaltiPaymentParams {
  publicKey: string;
  productIdentity: string;
  productName: string;
  amount: number;
  orderId: string;
  customerInfo?: {
    name: string;
    phone: string;
  };
  onSuccess: (payload: any) => void;
  onError: (error: any) => void;
}

// Initiate Khalti payment
export const initiateKhaltiPayment = (params: KhaltiPaymentParams) => {
  // This function assumes Khalti SDK is loaded via script tag in index.html
  if (typeof window.KhaltiCheckout === "undefined") {
    console.error("Khalti SDK not loaded");
    params.onError(new Error("Khalti SDK not loaded"));
    return;
  }

  // Configure Khalti
  const config = {
    publicKey: params.publicKey,
    productIdentity: params.productIdentity,
    productName: params.productName,
    productUrl: window.location.href,
    eventHandler: {
      onSuccess(payload: any) {
        // Handle success
        params.onSuccess(payload);
      },
      onError(error: any) {
        // Handle error
        params.onError(error);
      },
      onClose() {
        console.log("Khalti payment widget closed");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  // Create a new instance and show the widget
  const checkout = new window.KhaltiCheckout(config);
  checkout.show({ amount: params.amount });
};

// Verify Khalti payment
export const verifyKhaltiPayment = async (
  token: string,
  amount: number,
  orderId: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/khalti/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token, amount, orderId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to verify payment",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Add this type declaration for the Khalti SDK
declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

// import { ApiResponse } from "../types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // Process payment (for credit card or other non-redirect methods)
// export const processPayment = async (paymentData: {
//   amount: number;
//   paymentMethod: string;
//   cardDetails?: any;
//   orderId: string;
// }): Promise<{ status: string; id?: string }> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     const response = await fetch(`${API_URL}/payments/process`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(paymentData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Payment processing failed");
//     }

//     return data;
//   } catch (error: any) {
//     throw new Error(error.message || "Payment processing failed");
//   }
// };

// // Initiate Khalti payment
// export const initiateKhaltiPayment = async (
//   amount: number,
//   orderId: string
// ): Promise<ApiResponse> => {
//   try {
//     const token = localStorage.getItem("userToken");

//     if (!token) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/payments/khalti/initiate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ amount, orderId }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to initiate payment",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };

// // Verify Khalti payment
// export const verifyKhaltiPayment = async (
//   token: string,
//   amount: number,
//   orderId: string
// ): Promise<ApiResponse> => {
//   try {
//     const userToken = localStorage.getItem("userToken");

//     if (!userToken) {
//       return { success: false, error: "No authentication token found" };
//     }

//     const response = await fetch(`${API_URL}/payments/khalti/verify`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userToken}`,
//       },
//       body: JSON.stringify({ token, amount, orderId }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Failed to verify payment",
//       };
//     }

//     return { success: true, data: data };
//   } catch (error) {
//     return { success: false, error: "Network error. Please try again." };
//   }
// };
