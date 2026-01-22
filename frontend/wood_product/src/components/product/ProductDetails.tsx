import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import { Product } from "../../types";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [showAlert, setShowAlert] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent page reload
    addToCart(product, 1); // Always add 1 item to cart
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (!product) return null;

  // Calculate if product is in stock - using inStock property from your data model
  const stockCount = product.inStock ?? product.countInStock ?? 0;
  const isInStock = stockCount > 0;

  // Calculate average rating with null/undefined checks
  let averageRating = 0;
  if (
    product.ratings &&
    Array.isArray(product.ratings) &&
    product.ratings.length > 0
  ) {
    // Make sure rating values exist and are numbers before calculating average
    const validRatings = product.ratings.filter(
      (review) => review && typeof review.rating === "number"
    );

    if (validRatings.length > 0) {
      averageRating =
        validRatings.reduce((sum: number, review) => sum + review.rating, 0) /
        validRatings.length;
    }
  } else if (typeof product.averageRating === "number") {
    // Use pre-calculated averageRating if available
    averageRating = product.averageRating;
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    // Ensure rating is a valid number
    const safeRating = isNaN(rating) ? 0 : Math.round(rating);

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= safeRating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 15.585l-5.257 2.764 1.003-5.852-4.254-4.143 5.879-.855L10 2.5l2.629 5.319 5.879.855-4.254 4.143 1.003 5.852L10 15.585z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      {showAlert && (
        <Alert
          type="success"
          message={`${product.name} added to cart!`}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image - Constrained size */}
        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-md max-h-96">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/assets/images/product-placeholder.jpg"
            }
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="mt-2 flex items-center">
            <StarRating rating={averageRating} />
            <span className="ml-2 text-sm text-gray-500">
              {product.ratings && product.ratings.length > 0
                ? `${product.ratings.length} review${
                    product.ratings.length !== 1 ? "s" : ""
                  }`
                : "No reviews yet"}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-semibold text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock Availability */}
          <div className="mt-4">
            <p className="text-sm">
              {isInStock ? (
                <>
                  <span className="text-green-600 font-medium">In Stock</span>
                  {stockCount < 10 && (
                    <span className="ml-2 text-orange-500">
                      Only {stockCount} left!
                    </span>
                  )}
                </>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Add to Cart Button - Fixed width */}
          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`px-8 py-3 max-w-xs ${
                !isInStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-2 text-gray-600 space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              Specifications
            </h3>
            <div className="mt-4 border rounded-lg overflow-hidden">
              <dl>
                {product.material && (
                  <div className="bg-gray-50 px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Material
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {product.material}
                    </dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="bg-white px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Dimensions
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {typeof product.dimensions === "object" &&
                      product.dimensions.length &&
                      product.dimensions.width &&
                      product.dimensions.height
                        ? `${product.dimensions.length}L × ${product.dimensions.width}W × ${product.dimensions.height}H`
                        : typeof product.dimensions === "string"
                        ? product.dimensions
                        : "Dimensions available in product details"}
                    </dd>
                  </div>
                )}
                {product.weight && (
                  <div className="bg-gray-50 px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Weight
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {product.weight} kg
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Information & Return Policy in a row layout below */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Shipping Information
          </h3>
          <div className="mt-4 text-sm text-gray-600">
            <p>Standard shipping: 3-5 business days</p>
            <p>Express shipping: 1-2 business days</p>
            <p>Free shipping on orders over $50</p>
          </div>
        </div>

        {/* Return Policy */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Return Policy</h3>
          <div className="mt-4 text-sm text-gray-600">
            <p>30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
