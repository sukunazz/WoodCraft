// src / hooks / useAuth.ts;
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// import { useState, useEffect } from "react";
// import { decode } from "jwt-decode";

// const useAuth = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       try {
//         const decoded: any = decode(token);
//         const isExpired = decoded.exp * 1000 < Date.now(); // Check if the token is expired
//         if (isExpired) {
//           localStorage.removeItem("token");
//           setUser(null); // Token expired, remove the token and reset user
//         } else {
//           setUser(decoded); // Valid token, set user
//         }
//       } catch (error) {
//         console.error("Token decode error:", error);
//         setUser(null); // Token is invalid, reset user
//       }
//     } else {
//       setUser(null); // No token, reset user
//     }
//     setLoading(false); // Done checking
//   }, []);

//   return { user, loading };
// };

// export default useAuth;
