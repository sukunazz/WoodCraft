import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Check if current route is login or register
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/verify-account");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show logo in header for auth pages */}
      <Header showNavigation={!isAuthPage} />

      <main className="flex-grow">{children}</main>

      {/* Hide footer completely on auth pages */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
