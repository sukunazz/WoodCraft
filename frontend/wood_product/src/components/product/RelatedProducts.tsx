import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { Product } from "../../types";

interface RelatedProductsProps {
  currentProductId: string;
  products?: Product[]; // Make products optional with ?
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  products = [], // Provide default empty array
}) => {
  // Now safe to call filter since products will at least be an empty array, not undefined
  const relatedProducts = products
    .filter((product) => product._id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View all products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
