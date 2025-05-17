// Create an AuthLayout component for login/register pages
// Create this in a new file: src/components/layouts/AuthLayout.tsx

import React from "react";
import { Link } from "react-router-dom";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
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

      {/* No footer for auth pages */}
    </div>
  );
};

export default AuthLayout;
