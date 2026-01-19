// src/services/khaltiService.ts

interface KhaltiConfig {
  publicKey: string;
  productIdentity: string;
  productName: string;
  amount: number;
  orderId: string;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  onSuccess: (payload: any) => void;
  onError: (error: any) => void;
  onClose?: () => void;
}


export const initiateKhaltiPayment = (config: KhaltiConfig) => {
  // Make sure the Khalti SDK is loaded
  if (typeof window.KhaltiCheckout === "undefined") {
    throw new Error("Khalti SDK not loaded");
  }

  const checkout = new window.KhaltiCheckout({
    publicKey: config.publicKey,
    productIdentity: config.productIdentity,
    productName: config.productName,
    productUrl: window.location.origin,
    paymentPreference: ["KHALTI"],
    eventHandler: {
      onSuccess(payload: any) {
        // Handle successful payment
        console.log("Payment success:", payload);

        // Add orderId to payload for reference
        payload.orderId = config.orderId;

        config.onSuccess(payload);
      },
      onError(error: any) {
        // Handle payment error
        console.error("Payment error:", error);
        config.onError(error);
      },
      onClose() {
        console.log("Khalti payment widget closed");
        if (config.onClose) {
          config.onClose();
        }
      },

    },
    customerInfo: config.customerInfo,
  });

  // Initiate payment - amount needs to be in paisa (1 NPR = 100 paisa)
  checkout.show({ amount: Math.round(config.amount * 100) });
};

// Helper function to verify Khalti payment with your backend
export const verifyKhaltiPayment = async (
  token: string,
  amount: number,
  orderId: string
): Promise<any> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const response = await fetch(`${API_URL}/payments/khalti/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        token,
        amount,
        orderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

    return data;
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};

// Add this to your types.d.ts file or create one if it doesn't exist
declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}
