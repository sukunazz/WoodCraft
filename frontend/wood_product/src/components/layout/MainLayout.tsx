// Create a MainLayout component for regular pages
// Create this in a new file: src/components/layouts/MainLayout.tsx

import React from "react";
import Header from "../layout/Header"; // Adjust the path as needed
import Footer from "../layout/Footer"; // Adjust the path as needed

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
