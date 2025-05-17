// // import { CartItem } from "../context/CartContext";

// // const CART_STORAGE_KEY = "ecommerce_cart";
// // const TOKEN_STORAGE_KEY = "token";
// // const USER_PREFERENCES_KEY = "user_preferences";

// // /**
// //  * Save cart items to localStorage
// //  */
// // export const saveCartToLocalStorage = (items: CartItem[]): void => {
// //   try {
// //     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
// //   } catch (error) {
// //     console.error("Error saving cart to localStorage:", error);
// //   }
// // };

// // /**
// //  * Get cart items from localStorage
// //  */
// // export const getCartFromLocalStorage = (): CartItem[] => {
// //   try {
// //     const storedCart = localStorage.getItem(CART_STORAGE_KEY);
// //     return storedCart ? JSON.parse(storedCart) : [];
// //   } catch (error) {
// //     console.error("Error getting cart from localStorage:", error);
// //     return [];
// //   }
// // };

// // /**
// //  * Clear cart items from localStorage
// //  */
// // export const clearCartFromLocalStorage = (): void => {
// //   try {
// //     localStorage.removeItem(CART_STORAGE_KEY);
// //   } catch (error) {
// //     console.error("Error clearing cart from localStorage:", error);
// //   }
// // };

// // /**
// //  * Save user token to localStorage
// //  */
// // export const saveTokenToLocalStorage = (token: string): void => {
// //   try {
// //     localStorage.setItem(TOKEN_STORAGE_KEY, token);
// //   } catch (error) {
// //     console.error("Error saving token to localStorage:", error);
// //   }
// // };

// // /**
// //  * Get user token from localStorage
// //  */
// // export const getTokenFromLocalStorage = (): string | null => {
// //   try {
// //     return localStorage.getItem(TOKEN_STORAGE_KEY);
// //   } catch (error) {
// //     console.error("Error getting token from localStorage:", error);
// //     return null;
// //   }
// // };

// // /**
// //  * Clear user token from localStorage
// //  */
// // export const clearTokenFromLocalStorage = (): void => {
// //   try {
// //     localStorage.removeItem(TOKEN_STORAGE_KEY);
// //   } catch (error) {
// //     console.error("Error clearing token from localStorage:", error);
// //   }
// // };

// // /**
// //  * Save user preferences to localStorage
// //  */
// // export interface UserPreferences {
// //   theme: "light" | "dark";
// //   currency: string;
// //   recentlyViewed: string[]; // Product IDs
// // }

// // export const saveUserPreferences = (preferences: UserPreferences): void => {
// //   try {
// //     localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
// //   } catch (error) {
// //     console.error("Error saving user preferences to localStorage:", error);
// //   }
// // };

// // /**
// //  * Get user preferences from localStorage
// //  */
// // export const getUserPreferences = (): UserPreferences => {
// //   try {
// //     const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
// //     return storedPreferences
// //       ? JSON.parse(storedPreferences)
// //       : { theme: "light", currency: "USD", recentlyViewed: [] };
// //   } catch (error) {
// //     console.error("Error getting user preferences from localStorage:", error);
// //     return { theme: "light", currency: "USD", recentlyViewed: [] };
// //   }
// // };

// import { CartItem } from "../context/CartContext";

// const CART_STORAGE_KEY = "ecommerce_cart";
// const TOKEN_STORAGE_KEY = "userToken"; // ✅ Updated to match usage in cart.ts
// const USER_PREFERENCES_KEY = "user_preferences";

// // Save cart items to localStorage
// export const saveCartToLocalStorage = (items: CartItem[]): void => {
//   try {
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
//   } catch (error) {
//     console.error("Error saving cart to localStorage:", error);
//   }
// };

// // Get cart items from localStorage
// export const getCartFromLocalStorage = (): CartItem[] => {
//   try {
//     const storedCart = localStorage.getItem(CART_STORAGE_KEY);
//     return storedCart ? JSON.parse(storedCart) : [];
//   } catch (error) {
//     console.error("Error getting cart from localStorage:", error);
//     return [];
//   }
// };

// // Clear cart items from localStorage
// export const clearCartFromLocalStorage = (): void => {
//   try {
//     localStorage.removeItem(CART_STORAGE_KEY);
//   } catch (error) {
//     console.error("Error clearing cart from localStorage:", error);
//   }
// };

// // Save user token to localStorage
// export const saveTokenToLocalStorage = (token: string): void => {
//   try {
//     localStorage.setItem(TOKEN_STORAGE_KEY, token);
//   } catch (error) {
//     console.error("Error saving token to localStorage:", error);
//   }
// };

// // Get user token from localStorage
// export const getTokenFromLocalStorage = (): string | null => {
//   try {
//     return localStorage.getItem(TOKEN_STORAGE_KEY);
//   } catch (error) {
//     console.error("Error getting token from localStorage:", error);
//     return null;
//   }
// };

// // Clear user token from localStorage
// export const clearTokenFromLocalStorage = (): void => {
//   try {
//     localStorage.removeItem(TOKEN_STORAGE_KEY);
//   } catch (error) {
//     console.error("Error clearing token from localStorage:", error);
//   }
// };

// // Clear both tokens (legacy + current)
// export const clearAllTokens = (): void => {
//   try {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userToken");
//   } catch (error) {
//     console.error("Error clearing tokens from localStorage:", error);
//   }
// };

// // Save user preferences
// export interface UserPreferences {
//   theme: "light" | "dark";
//   currency: string;
//   recentlyViewed: string[]; // Product IDs
// }

// export const saveUserPreferences = (preferences: UserPreferences): void => {
//   try {
//     localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
//   } catch (error) {
//     console.error("Error saving user preferences to localStorage:", error);
//   }
// };

// export const getUserPreferences = (): UserPreferences => {
//   try {
//     const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
//     return storedPreferences
//       ? JSON.parse(storedPreferences)
//       : { theme: "light", currency: "USD", recentlyViewed: [] };
//   } catch (error) {
//     console.error("Error getting user preferences from localStorage:", error);
//     return { theme: "light", currency: "USD", recentlyViewed: [] };
//   }
// };

import { CartItem } from "../context/CartContext";

const CART_STORAGE_KEY = "ecommerce_cart";
const TOKEN_STORAGE_KEY = "userToken";
const LEGACY_TOKEN_KEY = "token";
const USER_PREFERENCES_KEY = "user_preferences";
const WHITELIST_KEY = "isWhitelist";

// Save cart items to localStorage
export const saveCartToLocalStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Get cart items from localStorage
export const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
    return [];
  }
};

// Clear cart items from localStorage
export const clearCartFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
  }
};

// Save user token to localStorage
export const saveTokenToLocalStorage = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
  }
};

// Get user token from localStorage
export const getTokenFromLocalStorage = (): string | null => {
  try {
    // Try current token key first
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) return token;

    // Fall back to legacy token key if needed
    return localStorage.getItem(LEGACY_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

// Clear user token from localStorage - clears both current and legacy tokens
export const clearTokenFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(WHITELIST_KEY); // Also clear whitelist flag if exists
  } catch (error) {
    console.error("Error clearing token from localStorage:", error);
  }
};

// Save user preferences
export interface UserPreferences {
  theme: "light" | "dark";
  currency: string;
  recentlyViewed: string[]; // Product IDs
}

export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving user preferences to localStorage:", error);
  }
};

export const getUserPreferences = (): UserPreferences => {
  try {
    const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
    return storedPreferences
      ? JSON.parse(storedPreferences)
      : { theme: "light", currency: "USD", recentlyViewed: [] };
  } catch (error) {
    console.error("Error getting user preferences from localStorage:", error);
    return { theme: "light", currency: "USD", recentlyViewed: [] };
  }
};

// Clear all authentication and cart data at once
export const clearAllUserData = (): void => {
  try {
    // Clear auth data
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(WHITELIST_KEY);

    // Clear cart data
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing user data from localStorage:", error);
  }
};
