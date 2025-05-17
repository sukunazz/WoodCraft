// src/components/AdminHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Adjust path as needed

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

export default AdminHeader;
