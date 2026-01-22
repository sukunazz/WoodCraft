// // components/checkout/OrderSummary.tsx
// import React from "react";
// import { useCart } from "../../hooks/useCart";
// import { formatPrice } from "../../utils/formatPrice";

// const OrderSummary: React.FC = () => {
//   const { items, totalAmount, itemCount } = useCart();
//   const shippingCost = totalAmount > 100 ? 0 : 10;
//   const tax = totalAmount * 0.08; // 8% tax rate
//   const totalWithTaxAndShipping = totalAmount + shippingCost + tax;
//   console.log("Cart:", items); // Debugging: Check if cart is being populated correctly
//   return (
//     <div className="bg-gray-50 p-6 rounded-lg">
//       <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

//       <div className="max-h-96 overflow-y-auto mb-4">
//         {items.map((item) => (
//           <div
//             key={item.id}
//             className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200"
//           >
//             <div className="flex items-center">
//               <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-200 rounded-md overflow-hidden">
//                 <img
//                   src={item.image || "/assets/images/product-placeholder.jpg"}
//                   alt={item.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//               </div>
//             </div>
//             <span className="font-medium">
//               {formatPrice(item.price * item.quantity)}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-3 pt-2 border-t border-gray-200">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal ({itemCount} items)</span>
//           <span>{formatPrice(totalAmount)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Shipping</span>
//           <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax</span>
//           <span>{formatPrice(tax)}</span>
//         </div>
//         <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-semibold">
//           <span>Total</span>
//           <span>{formatPrice(totalWithTaxAndShipping)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;

import React from "react";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "../../types";

interface OrderSummaryProps {
  items?: CartItem[];
  totalAmount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items: itemsProp,
  totalAmount,
}) => {
  const { items: cartItems, subtotal: cartSubtotal } = useCart();
  const items = itemsProp ?? cartItems;
  const subtotal = typeof totalAmount === "number" ? totalAmount : cartSubtotal;

  const shipping = items.length > 0 ? 5.0 : 0;
  const taxRate = 0.13;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-4">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">₹{subtotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between border-b pb-4">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">₹{shipping.toFixed(2)}</p>
        </div>

        <div className="flex justify-between border-b pb-4">
          <p className="text-gray-600">Tax (13%)</p>
          <p className="font-medium">₹{tax.toFixed(2)}</p>
        </div>

        <div className="flex justify-between pt-4">
          <p className="font-semibold">Total</p>
          <p className="font-bold text-lg">₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
