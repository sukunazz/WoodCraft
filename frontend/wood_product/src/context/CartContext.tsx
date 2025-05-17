// import React, { createContext, useState, useEffect, ReactNode } from "react";
// import { Product } from "../types";
// import * as api from "../api/cart";
// import {
//   getCartFromLocalStorage,
//   saveCartToLocalStorage,
// } from "../utils/localStorage";

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface CartContextType {
//   items: CartItem[];
//   loading: boolean;
//   error: string | null;
//   itemErrors: Record<string, string>;
//   addToCart: (product: Product, quantity?: number) => void;
//   removeFromCart: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   totalItems: number;
//   subtotal: number;
//   syncWithServer: () => Promise<void>;
// }

// export const CartContext = createContext<CartContextType>({
//   items: [],
//   loading: false,
//   error: null,
//   itemErrors: {},
//   addToCart: () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   clearCart: () => {},
//   totalItems: 0,
//   subtotal: 0,
//   syncWithServer: async () => {},
// });

// interface CartProviderProps {
//   children: ReactNode;
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const savedCart = getCartFromLocalStorage();
//     if (savedCart.length > 0) {
//       setItems(savedCart);
//     }
//   }, []);

//   useEffect(() => {
//     saveCartToLocalStorage(items);
//   }, [items]);

//   const addToCart = async (product: Product, quantity = 1) => {
//     setLoading(true);
//     try {
//       const response = await api.addToCart(product._id, quantity);
//       if (response.success) {
//         setItems(response.data);
//       } else {
//         setError(response.error);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to add item to cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (productId: string) => {
//     setLoading(true);
//     try {
//       const response = await api.removeFromCart(productId);
//       if (response.success) {
//         setItems(response.data);
//       } else {
//         setError(response.error);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to remove item from cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (productId: string, quantity: number) => {
//     try {
//       setLoading(true);
//       // Clear any existing errors for this product
//       setItemErrors((prev) => ({ ...prev, [productId]: null }));

//       // Update the cart on the server
//       const result = await api.updateCartItem(productId, quantity);

//       if (result.success) {
//         setItems(result.data);
//       } else {
//         // Handle error
//         if (result.keepExistingItems) {
//           // Don't clear the cart - just show the error
//           setItemErrors((prev) => ({ ...prev, [productId]: result.error }));
//         } else {
//           setError(result.error);
//         }
//       }
//     } catch (error: any) {
//       setError("Failed to update quantity. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     setLoading(true);
//     try {
//       const response = await api.clearCart();
//       if (response.success) {
//         setItems([]);
//       } else {
//         setError(response.error);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to clear cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalItems = items.reduce((total, i) => total + i.quantity, 0);

//   const subtotal = items.reduce(
//     (sum, i) => sum + i.product.price * i.quantity,
//     0
//   );

//   const syncWithServer = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("userToken");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       // Get server cart
//       const serverCartResponse = await api.getCart();
//       if (!serverCartResponse.success) {
//         setError(serverCartResponse.error);
//         setLoading(false);
//         return;
//       }

//       // Extract items from the server response and adapt to our CartItem format
//       const serverCartData = serverCartResponse.data;

//       // Check if the server response has the expected structure
//       if (!serverCartData || !Array.isArray(serverCartData)) {
//         console.error("Unexpected server response format:", serverCartData);
//         setError("Invalid server response format");
//         setLoading(false);
//         return;
//       }

//       // Transform server items to match our CartItem format
//       const serverCartItems: CartItem[] = serverCartData.map((item: any) => ({
//         product: {
//           ...item.product,
//           id: item.product._id, // Ensure we use _id as id
//           imageUrl: item.product.images?.[0] || "", // Use first image as imageUrl
//         },
//         quantity: item.quantity,
//       }));

//       setItems(serverCartItems);
//     } catch (err: any) {
//       console.error("Cart sync error:", err);
//       setError(err.message || "Failed to sync cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         loading,
//         error,
//         itemErrors,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         totalItems,
//         subtotal,
//         syncWithServer,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Add useCart hook for easier context consumption
// export const useCart = () => {
//   const context = React.useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types";
import * as api from "../api/cart";
import {
  getCartFromLocalStorage,
  saveCartToLocalStorage,
} from "../utils/localStorage";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  itemErrors: Record<string, string>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  syncWithServer: () => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  loading: false,
  error: null,
  itemErrors: {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  syncWithServer: async () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = getCartFromLocalStorage();
    if (savedCart.length > 0) {
      setItems(savedCart);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    saveCartToLocalStorage(items);
  }, [items]);

  const addToCart = async (product: Product, quantity = 1) => {
    setLoading(true);
    try {
      const response = await api.addToCart(product._id, quantity);
      if (response.success) {
        setItems(response.data.items || []);
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const response = await api.removeFromCart(productId);
      if (response.success) {
        setItems(response.data.items || []);
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      setItemErrors((prev) => ({ ...prev, [productId]: null }));

      const result = await api.updateCartItem(productId, quantity);

      if (result.success) {
        setItems(result.data.items || []);
      } else {
        if (result.keepExistingItems) {
          setItemErrors((prev) => ({ ...prev, [productId]: result.error }));
        } else {
          setError(result.error);
        }
      }
    } catch (error: any) {
      setError("Failed to update quantity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const response = await api.clearCart();
      if (response.success) {
        setItems([]);
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((total, i) => total + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const syncWithServer = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.getCart();

      if (!response.success) {
        setError(response.error);
        setLoading(false);
        return;
      }

      const cart = response.data;

      // Check that data.items exists and is an array
      if (!cart || !Array.isArray(cart.items)) {
        console.error("Unexpected server response format:", cart);
        setError("Invalid server response format");
        setLoading(false);
        return;
      }

      const serverCartItems: CartItem[] = cart.items.map((item: any) => ({
        product: {
          ...item.product,
          id: item.product._id,
          imageUrl: item.product.images?.[0] || "",
        },
        quantity: item.quantity,
      }));

      setItems(serverCartItems);
    } catch (err: any) {
      console.error("Cart sync error:", err);
      setError(err.message || "Failed to sync cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        itemErrors,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
