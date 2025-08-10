// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { loginUser, getUserProfile } from "../api/users"; // adjust path as needed
// import { LoginFormData, User } from "../types";

// // Define AuthContext type
// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   isAuthenticated: false,
//   login: async () => {
//     throw new Error("Auth context not initialized");
//   },
//   logout: () => {},
// });

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch user profile on initial mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("userToken");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const response = await getUserProfile();
//       if (response.success && response.data) {
//         setUser(response.data);
//       } else {
//         localStorage.removeItem("userToken");
//         setUser(null);
//       }

//       setLoading(false);
//     };

//     fetchProfile();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await loginUser({ email, password });
//       if (!res.success || !res.data) {
//         throw new Error(res.error || "Login failed");
//       }

//       const profile = await getUserProfile();
//       if (profile.success && profile.data) {
//         setUser(profile.data);
//       } else {
//         throw new Error(profile.error || "Failed to fetch profile");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("userToken");

//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated: !!user,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginUser, getUserProfile } from "../api/users"; // adjust path as needed
import { User } from "../types";

// Define AuthContext type
type AuthContextType = {
  user: User | null;
  loading: boolean; // Represents fetching user profile/loading auth state
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error("Auth context not initialized");
  },
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on initial mount (app load)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await getUserProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem("userToken");
        setUser(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // LOGIN: do NOT toggle the global loading state here to avoid UI flicker in the login form
  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password });
      if (!res.success || !res.data) {
        throw new Error(res.error || "Login failed");
      }

      // After successful login, fetch updated profile
      const profile = await getUserProfile();
      if (profile.success && profile.data) {
        setUser(profile.data);
      } else {
        throw new Error(profile.error || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // rethrow so form can catch and display error
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
