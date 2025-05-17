// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../hooks/useCart";
// import { useAuth } from "../hooks/useAuth";
// import CheckoutForm from "../components/checkout/CheckoutForm";
// import PaymentMethod from "../components/checkout/PaymentMethod";
// import OrderSummary from "../components/checkout/OrderSummary";
// import { ShippingAddress, CheckoutFormData } from "../types";
// import * as api from "../api/orders";
// import * as paymentApi from "../api/payments";
// import Alert from "../components/ui/Alert";

// enum CheckoutStep {
//   SHIPPING = "shipping",
//   PAYMENT = "payment",
//   REVIEW = "review",
// }

// const Checkout: React.FC = () => {
//   const { items, subtotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [currentStep, setCurrentStep] = useState<CheckoutStep>(
//     CheckoutStep.SHIPPING
//   );
//   const [shippingAddress, setShippingAddress] =
//     useState<ShippingAddress | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState<string>("");
//   const [cardDetails, setCardDetails] =
//     useState<CheckoutFormData["cardDetails"]>();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Constants for calculation
//   const TAX_RATE = 0.07; // 7% tax
//   const SHIPPING_COST = 10; // $10 flat shipping

//   // Calculate order totals
//   const tax = subtotal * TAX_RATE;
//   const shipping = items.length > 0 ? SHIPPING_COST : 0;
//   const total = subtotal + tax + shipping;

//   const handleShippingSubmit = (address: ShippingAddress) => {
//     setShippingAddress(address);
//     setCurrentStep(CheckoutStep.PAYMENT);
//     window.scrollTo(0, 0);
//   };

//   const handlePaymentSubmit = (
//     method: string,
//     details?: CheckoutFormData["cardDetails"]
//   ) => {
//     setPaymentMethod(method);
//     if (details) {
//       setCardDetails(details);
//     }
//     setCurrentStep(CheckoutStep.REVIEW);
//     window.scrollTo(0, 0);
//   };

//   const handleBackToShipping = () => {
//     setCurrentStep(CheckoutStep.SHIPPING);
//     window.scrollTo(0, 0);
//   };

//   const handleBackToPayment = () => {
//     setCurrentStep(CheckoutStep.PAYMENT);
//     window.scrollTo(0, 0);
//   };

//   const handlePlaceOrder = async () => {
//     if (!shippingAddress || !paymentMethod) {
//       setError("Missing shipping or payment information");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Process payment first
//       const paymentResult = await paymentApi.processPayment({
//         amount: total,
//         paymentMethod,
//         cardDetails: paymentMethod === "credit_card" ? cardDetails : undefined,
//       });

//       if (paymentResult.status === "paid") {
//         // Create order
//         const order = await api.createOrder({
//           items: items.map((item) => ({
//             productId: item.product.id,
//             quantity: item.quantity,
//             price: item.product.price,
//           })),
//           shippingAddress: shippingAddress.id,
//           paymentMethod,
//           subtotal,
//           tax,
//           shipping,
//           total,
//         });

//         // Clear cart
//         clearCart();

//         // Redirect to order success page
//         navigate(`/orders/${order.id}?success=true`);
//       } else {
//         setError("Payment failed, please try again");
//       }
//     } catch (err: any) {
//       setError(err.message || "An error occurred during checkout");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (items.length === 0) {
//     navigate("/cart");
//     return null;
//   }

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//       {/* Checkout Progress */}
//       <div className="flex justify-center mb-8">
//         <div className="w-full max-w-3xl">
//           <div className="flex items-center">
//             <div
//               className={`flex flex-col items-center relative ${
//                 currentStep === CheckoutStep.SHIPPING
//                   ? "text-blue-600"
//                   : "text-gray-600"
//               }`}
//             >
//               <div
//                 className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
//                   currentStep === CheckoutStep.SHIPPING
//                     ? "bg-blue-600 text-white"
//                     : "border-2 border-gray-300"
//                 }`}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="absolute top-14 text-center mt-1 w-32">
//                 Shipping
//               </div>
//             </div>

//             <div
//               className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
//                 currentStep !== CheckoutStep.SHIPPING
//                   ? "border-blue-600"
//                   : "border-gray-300"
//               }`}
//             ></div>

//             <div
//               className={`flex flex-col items-center relative ${
//                 currentStep === CheckoutStep.PAYMENT
//                   ? "text-blue-600"
//                   : currentStep === CheckoutStep.REVIEW
//                   ? "text-gray-600"
//                   : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
//                   currentStep === CheckoutStep.PAYMENT
//                     ? "bg-blue-600 text-white"
//                     : currentStep === CheckoutStep.REVIEW
//                     ? "border-2 border-gray-300"
//                     : "border-2 border-gray-300 text-gray-400"
//                 }`}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="absolute top-14 text-center mt-1 w-32">
//                 Payment
//               </div>
//             </div>

//             <div
//               className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
//                 currentStep === CheckoutStep.REVIEW
//                   ? "border-blue-600"
//                   : "border-gray-300"
//               }`}
//             ></div>

//             <div
//               className={`flex flex-col items-center relative ${
//                 currentStep === CheckoutStep.REVIEW
//                   ? "text-blue-600"
//                   : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
//                   currentStep === CheckoutStep.REVIEW
//                     ? "bg-blue-600 text-white"
//                     : "border-2 border-gray-300 text-gray-400"
//                 }`}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="absolute top-14 text-center mt-1 w-32">
//                 Review
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6">
//           <Alert type="error" message={error} onClose={() => setError(null)} />
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Main Checkout Form */}
//         <div className="lg:w-2/3">
//           {currentStep === CheckoutStep.SHIPPING && (
//             <CheckoutForm onSubmit={handleShippingSubmit} />
//           )}

//           {currentStep === CheckoutStep.PAYMENT && (
//             <PaymentMethod
//               onSubmit={handlePaymentSubmit}
//               onBack={handleBackToShipping}
//             />
//           )}

//           {currentStep === CheckoutStep.REVIEW && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4">Order Review</h2>

//               <div className="mb-6">
//                 <h3 className="font-medium mb-2">Shipping Address</h3>
//                 <div className="bg-gray-50 p-4 rounded">
//                   {shippingAddress && (
//                     <>
//                       <p className="mb-1">
//                         {user?.firstName} {user?.lastName}
//                       </p>
//                       <p className="mb-1">{shippingAddress.street}</p>
//                       <p className="mb-1">
//                         {shippingAddress.city}, {shippingAddress.state}{" "}
//                         {shippingAddress.zipCode}
//                       </p>
//                       <p>{shippingAddress.country}</p>
//                     </>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleBackToShipping}
//                   className="text-blue-600 text-sm mt-2 hover:underline"
//                 >
//                   Edit
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <h3 className="font-medium mb-2">Payment Method</h3>
//                 <div className="bg-gray-50 p-4 rounded">
//                   {paymentMethod === "credit_card" && cardDetails ? (
//                     <p>
//                       Credit Card ending in {cardDetails.cardNumber.slice(-4)}
//                     </p>
//                   ) : (
//                     <p>
//                       {paymentMethod === "paypal" ? "PayPal" : "Payment Method"}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleBackToPayment}
//                   className="text-blue-600 text-sm mt-2 hover:underline"
//                 >
//                   Edit
//                 </button>
//               </div>

//               <div>
//                 <h3 className="font-medium mb-2">Order Items</h3>
//                 <div className="bg-gray-50 p-4 rounded divide-y divide-gray-200">
//                   {items.map((item) => (
//                     <div
//                       key={item.product.id}
//                       className="py-3 flex justify-between items-center"
//                     >
//                       <div className="flex items-center">
//                         <img
//                           src={
//                             item.product.images[0] ||
//                             "/assets/images/product-placeholder.jpg"
//                           }
//                           alt={item.product.name}
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                         <div className="ml-4">
//                           <p className="font-medium">{item.product.name}</p>
//                           <p className="text-gray-500 text-sm">
//                             Qty: {item.quantity}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="font-medium">
//                         ${(item.product.price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-8">
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={loading}
//                   className={`w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
//                     loading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <svg
//                         className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Processing...
//                     </div>
//                   ) : (
//                     "Place Order"
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Summary */}
//         {/* <div className="lg:w-1/3">
//           <OrderSummary
//             subtotal={subtotal}
//             tax={tax}
//             shipping={shipping}
//             total={total}
//           />
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import CheckoutForm from "../components/checkout/CheckoutForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { ShippingAddress, CheckoutFormData } from "../types";
import * as api from "../api/orders";
import * as paymentApi from "../api/payments";
import Alert from "../components/ui/Alert";

enum CheckoutStep {
  SHIPPING = "shipping",
  PAYMENT = "payment",
  REVIEW = "review",
}

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(
    CheckoutStep.SHIPPING
  );
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardDetails, setCardDetails] =
    useState<CheckoutFormData["cardDetails"]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Constants for calculation
  const TAX_RATE = 0.07; // 7% tax
  const SHIPPING_COST = 10; // $10 flat shipping

  // Calculate order totals
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep(CheckoutStep.PAYMENT);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (
    method: string,
    details?: CheckoutFormData["cardDetails"]
  ) => {
    setPaymentMethod(method);
    if (details) {
      setCardDetails(details);
    }
    setCurrentStep(CheckoutStep.REVIEW);
    window.scrollTo(0, 0);
  };

  const handleBackToShipping = () => {
    setCurrentStep(CheckoutStep.SHIPPING);
    window.scrollTo(0, 0);
  };

  const handleBackToPayment = () => {
    setCurrentStep(CheckoutStep.PAYMENT);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      setError("Missing shipping or payment information");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, create a pending order in the database
      const order = await api.createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: shippingAddress.id,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        // Set status as pending since payment hasn't been confirmed yet
        status: "pending",
      });

      // Now handle payment based on selected method
      if (paymentMethod === "khalti") {
        // For Khalti, initiate payment and redirect user
        const paymentInitiation = await paymentApi.initiateKhaltiPayment(
          total,
          order.id
        );

        if (paymentInitiation.success && paymentInitiation.data) {
          // Clear cart after order is created - payment will be verified on return
          clearCart();

          // Store orderId in localStorage to retrieve after payment completion
          localStorage.setItem("pendingOrderId", order.id);

          // Redirect to Khalti payment page
          window.location.href = paymentInitiation.data.paymentUrl;
        } else {
          setError(paymentInitiation.error || "Failed to initiate payment");
        }
      } else if (paymentMethod === "credit_card") {
        // For credit card, process payment directly
        const paymentResult = await paymentApi.processPayment({
          amount: total,
          paymentMethod,
          cardDetails: cardDetails,
          orderId: order.id,
        });

        if (paymentResult.status === "paid") {
          // Update order status after successful payment
          await api.updateOrderStatus(order.id, "processing");

          // Clear cart after successful payment
          clearCart();

          // Redirect to order success page
          navigate(`/orders/${order.id}?success=true`);
        } else {
          setError("Payment failed, please try again");
        }
      } else if (paymentMethod === "cash_on_delivery") {
        // For COD, just update order status and proceed
        await api.updateOrderStatus(order.id, "processing");

        // Clear cart
        clearCart();

        // Redirect to order success page
        navigate(`/orders/${order.id}?success=true`);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to cart if there are no items - but don't remove this check
  // as we still want to prevent users from proceeding with an empty cart
  if (items.length === 0) {
    // Instead of immediately navigating, we'll show a message and a button
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="mb-6">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Progress */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-3xl">
          <div className="flex items-center">
            <div
              className={`flex flex-col items-center relative ${
                currentStep === CheckoutStep.SHIPPING
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  currentStep === CheckoutStep.SHIPPING
                    ? "bg-blue-600 text-white"
                    : "border-2 border-gray-300"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-14 text-center mt-1 w-32">
                Shipping
              </div>
            </div>

            <div
              className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                currentStep !== CheckoutStep.SHIPPING
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center relative ${
                currentStep === CheckoutStep.PAYMENT
                  ? "text-blue-600"
                  : currentStep === CheckoutStep.REVIEW
                  ? "text-gray-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  currentStep === CheckoutStep.PAYMENT
                    ? "bg-blue-600 text-white"
                    : currentStep === CheckoutStep.REVIEW
                    ? "border-2 border-gray-300"
                    : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-14 text-center mt-1 w-32">
                Payment
              </div>
            </div>

            <div
              className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                currentStep === CheckoutStep.REVIEW
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center relative ${
                currentStep === CheckoutStep.REVIEW
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  currentStep === CheckoutStep.REVIEW
                    ? "bg-blue-600 text-white"
                    : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-14 text-center mt-1 w-32">
                Review
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="lg:w-2/3">
          {currentStep === CheckoutStep.SHIPPING && (
            <CheckoutForm onSubmit={handleShippingSubmit} />
          )}

          {currentStep === CheckoutStep.PAYMENT && (
            <PaymentMethod
              onSubmit={handlePaymentSubmit}
              onBack={handleBackToShipping}
            />
          )}

          {currentStep === CheckoutStep.REVIEW && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Review</h2>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {shippingAddress && (
                    <>
                      <p className="mb-1">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="mb-1">{shippingAddress.street}</p>
                      <p className="mb-1">
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.zipCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={handleBackToShipping}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {paymentMethod === "credit_card" && cardDetails ? (
                    <p>
                      Credit Card ending in {cardDetails.cardNumber.slice(-4)}
                    </p>
                  ) : paymentMethod === "khalti" ? (
                    <p>Khalti Payment</p>
                  ) : (
                    <p>{paymentMethod}</p>
                  )}
                </div>
                <button
                  onClick={handleBackToPayment}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="bg-gray-50 p-4 rounded divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            item.product.images?.[0] ||
                            "/assets/images/product-placeholder.jpg"
                          }
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
