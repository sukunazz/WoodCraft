// First, let's create a new AdminLayout component
// Create this in a new file: src/components/layouts/AdminLayout.tsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust the path as needed

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header - Simple with just the brand name */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin/dashboard" className="text-xl font-bold">
            Brand Name Admin
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {user.name || user.email}
              </span>
              <Link to="/" className="text-sm hover:underline">
                Return to Site
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* No footer for admin pages */}
    </div>
  );
};

export default AdminLayout;
