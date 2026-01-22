import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "./useAuth";
import { Product } from "../types";

export const useCart = () => {
  const context = useContext(CartContext);
  const auth = useAuth();
  const user = auth?.user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Sync cart with server when user logs in
  useEffect(() => {
    if (user) {
      context.syncWithServer();
    }
  }, [user]);

  // Enhanced addToCart function with better handling
  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      // Check if user is authenticated
      if (!user) {
        setError("Please log in to add items to your cart.");
        return;
      }

      setLoading(true);
      setError(null);

      // Call the context's addToCart method
      await context.addToCart(product, quantity);

      // You could add success feedback here if needed
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add item to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  // Return the context properties with correct naming for CheckoutForm
  return {
    ...context,
    items: context.items,
    totalAmount: context.subtotal, // Add totalAmount as an alias for subtotal
    clearCart: context.clearCart,
    addToCart,
    loading,
    error,
  };
};

// import { useContext, useEffect, useState } from "react";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "./useAuth";
// import { Product } from "../types";

// export const useCart = () => {
//   const context = useContext(CartContext);
//   const auth = useAuth();
//   const user = auth?.user;
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }

//   // Sync cart with server when user logs in
//   useEffect(() => {
//     if (user) {
//       context.syncWithServer();
//     }
//   }, [user]);

//   // Enhanced addToCart function with better handling
//   const addToCart = async (product: Product, quantity: number = 1) => {
//     try {
//       // Check if user is authenticated
//       if (!user) {
//         if (typeof auth.login === "function") {
//           auth.login(); // Show login modal or redirect to login
//         }
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       // Call the context's addToCart method
//       await context.addToCart(product, quantity);

//       // You could add success feedback here if needed
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Failed to add item to cart");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Return items, totalItems, subtotal, and addToCart
//   return {
//     ...context, // Including items, totalItems, subtotal, etc.
//     addToCart,
//     loading,
//     error,
//   };
// };
