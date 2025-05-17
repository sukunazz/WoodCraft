// import React, { useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./hooks/useAuth";
// import Loading from "./components/ui/Loading";

// // Public Pages
// import Home from "./pages/Home";
// import Shop from "./pages/Shop";
// import ProductPage from "./pages/ProductPage";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyEmail from "./components/auth/VerifyEmail";
// import NotFound from "./pages/NotFound";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// // Protected Pages
// import Checkout from "./pages/Checkout";
// import Profile from "./pages/Profile";
// import Orders from "./pages/Orders";
// import OrderDetails from "./pages/OrderDetails";

// // Admin Pages
// import AdminDashboard from "./pages/admin/Dashboard";
// import AdminProducts from "./pages/admin/Products";
// import AdminAddProduct from "./pages/admin/AddProduct";
// import AdminOrders from "./pages/admin/Orders";
// import AdminOrderSuccess from "./pages/admin/OrderSuccess";
// import EditProduct from "./pages/admin/EditProdcuts";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRole?: "user" | "admin";
// }

// // Route that requires authentication - redirects to login if not authenticated
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   requiredRole = "user",
// }) => {
//   const { user, loading, isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <Loading />;
//   }

//   if (!isAuthenticated) {
//     // Save the location the user was trying to access for redirect after login
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   if (requiredRole === "admin" && !user?.isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// // Route that requires shopping cart functionality
// const CartEnabledRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <Loading />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   return <>{children}</>;
// };

// // Route that should NOT be accessible if already logged in (login, register)
// const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <Loading />;
//   }

//   if (isAuthenticated) {
//     // If user is already logged in, redirect to home
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// const AppRouter: React.FC = () => {
//   const location = useLocation();
//   const { isAuthenticated } = useAuth();

//   // Scroll to top on route change
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   // Check if current route is login or register to conditionally render layout
//   const isAuthPage =
//     location.pathname === "/login" ||
//     location.pathname === "/register" ||
//     location.pathname.startsWith("/verify-account");

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/shop" element={<Shop />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/product/:id" element={<ProductPage />} />

//       {/* Auth Routes - not accessible if already logged in */}
//       <Route
//         path="/login"
//         element={
//           <AuthRoute>
//             <Login />
//           </AuthRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <AuthRoute>
//             <Register />
//           </AuthRoute>
//         }
//       />

//       {/* Verification routes */}
//       <Route path="/verify-account" element={<VerifyEmail />} />
//       <Route path="/verify-account/:token" element={<VerifyEmail />} />

//       {/* Protected Routes (require authentication) */}
//       <Route
//         path="/cart"
//         element={
//           <CartEnabledRoute>
//             <Cart />
//           </CartEnabledRoute>
//         }
//       />
//       <Route
//         path="/checkout"
//         element={
//           <ProtectedRoute>
//             <Checkout />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/orders"
//         element={
//           <ProtectedRoute>
//             <Orders />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/orders/:id"
//         element={
//           <ProtectedRoute>
//             <OrderDetails />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/products"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminProducts />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/products/add"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminAddProduct />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/products/edit/:id"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <EditProduct />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/orders"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminOrders />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/orders/:id"
//         element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminOrderSuccess />
//           </ProtectedRoute>
//         }
//       />

//       {/* 404 - Not Found */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRouter;

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Loading from "./components/ui/Loading";

// Assume your Header and Footer components are in these locations
// Adjust the import paths as needed for your project structure
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Public Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Protected Pages
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderSuccess from "./pages/admin/OrderSuccess";
import EditProduct from "./pages/admin/EditProdcuts";

// Layout Components
const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-xl font-bold">
          Brand Name Admin
        </Link>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user.name || user.email}</span>
            <Link to="/" className="text-sm hover:underline">
              Return to Site
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

// Layout wrapper components
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <AdminHeader />
    <main className="flex-grow">{children}</main>
    {/* No footer for admin */}
  </>
);

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {/* Minimal header for auth pages */}
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Brand Name
        </Link>
      </div>
    </header>
    <main className="flex-grow flex items-center justify-center bg-gray-50">
      {children}
    </main>
    {/* No footer for auth */}
  </>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

// Route that requires authentication - redirects to login if not authenticated
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = "user",
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Save the location the user was trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole === "admin" && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route that requires shopping cart functionality
const CartEnabledRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

// Route that should NOT be accessible if already logged in (login, register)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // If user is already logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current path is admin or auth for layout selection
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/verify-account");

  // Select the appropriate layout component based on the route
  const Layout = isAdminRoute
    ? AdminLayout
    : isAuthPage
    ? AuthLayout
    : MainLayout;

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Auth Routes - not accessible if already logged in */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />

          {/* Verification routes */}
          <Route path="/verify-account" element={<VerifyEmail />} />
          <Route path="/verify-account/:token" element={<VerifyEmail />} />

          {/* Protected Routes (require authentication) */}
          <Route
            path="/cart"
            element={
              <CartEnabledRoute>
                <Cart />
              </CartEnabledRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

export default AppRouter;
