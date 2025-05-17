// import React from "react";
// import { Link } from "react-router-dom";
// import { Product } from "../../types";
// import { formatPrice } from "../../utils/formatPrice";
// import Button from "./Button";

// interface ProductCardProps {
//   product: Product;
//   onAddToCart?: () => void;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
//       <Link to={`/product/${product._id}`}>
//         <div className="h-64 overflow-hidden">
//           <img
//             src={product.image || "/api/placeholder/400/300"}
//             alt={product.name}
//             className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//       </Link>

//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <Link to={`/product/${product._id}`} className="block">
//             <h3 className="text-lg font-semibold text-gray-800 hover:text-amber-700 transition-colors">
//               {product.name}
//             </h3>
//           </Link>
//           <div className="flex items-center">
//             <span className="text-amber-500">★</span>
//             <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
//           </div>
//         </div>

//         <p className="text-gray-500 text-sm mb-3 line-clamp-2">
//           {product.description}
//         </p>

//         <div className="flex justify-between items-center">
//           <span className="text-lg font-bold text-amber-700">
//             {formatPrice(product.price)}
//           </span>

//           <div className="flex items-center">
//             {product.countInStock > 0 ? (
//               <Button variant="primary" size="sm" onClick={onAddToCart}>
//                 Add to Cart
//               </Button>
//             ) : (
//               <span className="text-sm text-red-500 font-medium">
//                 Out of Stock
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import { addToCart } from "../../api/cart";

interface ProductCardProps {
  product: Product;
  onAddToCartSuccess?: () => void;
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCartSuccess,
  loading = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product || !product._id || isAdding || loading || addedToCart) return;

    try {
      setIsAdding(true);
      const res = await addToCart(product._id, 1);

      if (res.success) {
        setAddedToCart(true);
        if (onAddToCartSuccess) onAddToCartSuccess();
      } else {
        setError(res.error || "Failed to add to cart.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => {
        setIsAdding(false);
        setError(null);
      }, 1000);
    }
  };

  // Calculate discount percentage if sale price exists
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - (product.salePrice || 0)) / product.price) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative flex flex-col h-full transform hover:-translate-y-1">
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {discountPercentage}% OFF
        </div>
      )}

      {product.inStock && product.inStock <= 5 && product.inStock > 0 && (
        <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full z-10">
          Only {product.inStock} left
        </div>
      )}

      <Link to={`/product/${product._id}`} className="block relative">
        <div className="h-72 overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || "/api/placeholder/400/300"}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-lg font-medium text-gray-800 hover:text-purple-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
            <span className="text-amber-500">★</span>
            <span className="ml-1 text-sm font-medium text-gray-700">
              {(product.ratings?.length &&
                (
                  product.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  product.ratings.length
                ).toFixed(1)) ||
                "N/A"}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-baseline">
              <span
                className={`text-xl font-bold ${
                  hasDiscount ? "text-red-600" : "text-purple-700"
                }`}
              >
                {hasDiscount
                  ? formatPrice(product.salePrice || 0)
                  : formatPrice(product.price)}
              </span>

              {hasDiscount && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.freeShipping && (
              <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded-full">
                Free Shipping
              </span>
            )}
          </div>

          {!product.inStock || product.inStock <= 0 ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-lg text-sm font-semibold opacity-75 cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || loading || addedToCart}
              className={`w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center
              ${
                addedToCart
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200 shadow-md"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 shadow-md hover:shadow-lg disabled:bg-purple-300 disabled:shadow-none"
              }`}
            >
              {isAdding || loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : addedToCart ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Added to Cart
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11v-4a4 4 0 00-4-4v0a4 4 0 00-4 4v4m8 0H8m0 0v8a2 2 0 002 2h4a2 2 0 002-2v-8"
                    />
                  </svg>
                  Add to Cart
                </span>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 py-2 px-3 rounded-lg flex items-center">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
