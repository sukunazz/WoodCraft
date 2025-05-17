import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../ui/Button";

const CartSummary: React.FC = () => {
  const { subtotal, totalItems, loading, clearCart } = useCart();

  // Calculate tax (8%)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  // Calculate shipping (free over $50)
  const shippingCost = subtotal > 50 ? 0 : 5.99;

  // Calculate total
  const total = subtotal + tax + shippingCost;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
          </span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link to="/checkout" className="block">
          <Button
            variant="primary"
            className="w-full"
            disabled={loading || totalItems === 0}
          >
            {loading ? "Loading..." : "Proceed to Checkout"}
          </Button>
        </Link>

        <Button
          variant="outline"
          className="w-full"
          onClick={clearCart}
          disabled={loading || totalItems === 0}
        >
          Clear Cart
        </Button>

        <Link to="/shop">
          <Button variant="link" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../../context/CartContext"; // Changed from hooks/useCart
// import { formatPrice } from "../../utils/formatPrice";
// import Button from "../ui/Button";

// const CartSummary: React.FC = () => {
//   const { subtotal, totalItems, loading, clearCart } = useCart();

//   // Calculate tax (e.g., 8%)
//   const taxRate = 0.08;
//   const tax = subtotal * taxRate;

//   // Calculate shipping (free over $50)
//   const shippingCost = subtotal > 50 ? 0 : 5.99;

//   // Calculate total
//   const total = subtotal + tax + shippingCost;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//       <div className="space-y-3 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal ({totalItems} items)</span>
//           <span className="font-medium">{formatPrice(subtotal)}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax (8%)</span>
//           <span className="font-medium">{formatPrice(tax)}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-600">Shipping</span>
//           <span className="font-medium">
//             {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
//           </span>
//         </div>

//         <div className="border-t pt-3 mt-3">
//           <div className="flex justify-between font-semibold">
//             <span>Total</span>
//             <span>{formatPrice(total)}</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <Link to="/checkout">
//           <Button
//             variant="primary"
//             className="w-full"
//             disabled={loading || totalItems === 0}
//           >
//             Proceed to Checkout
//           </Button>
//         </Link>

//         <Button
//           variant="outline"
//           className="w-full"
//           onClick={clearCart}
//           disabled={loading || totalItems === 0}
//         >
//           Clear Cart
//         </Button>

//         <Link to="/shop">
//           <Button variant="link" className="w-full">
//             Continue Shopping
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CartSummary;
