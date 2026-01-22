import React from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { Product } from "../../types";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, loading, itemErrors } = useCart();
  const { product, quantity } = item;
  const productId = product.id || product._id;

  // Get any error for this specific product
  const itemError = itemErrors?.[productId];

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(productId);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b py-4">
      <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={product.imageUrl || "/assets/images/product-placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
          <h3 className="text-base font-medium text-gray-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatPrice(product.price)}
          </p>

          {/* Display item-specific error */}
          {itemError && (
            <p className="mt-1 text-sm font-medium text-red-600">{itemError}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-4">
          <label htmlFor={`quantity-${productId}`} className="sr-only">
            Quantity
          </label>
          <select
            id={`quantity-${productId}`}
            name={`quantity-${productId}`}
            value={quantity}
            onChange={handleQuantityChange}
            className={`max-w-full rounded-md border ${
              itemError ? "border-red-300" : "border-gray-300"
            } py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          disabled={loading}
          className={`text-sm font-medium ${
            loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:text-indigo-500"
          }`}
        >
          {loading ? "Processing..." : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
