// import React, { useState, useEffect } from "react";
// import { useCart } from "../../hooks/useCart";
// import PaymentMethod from "./PaymentMethod";
// import OrderSummary from "./OrderSummary";
// import { useNavigate } from "react-router-dom";
// import Alert from "../ui/Alert";
// import { createOrder } from "../../api/orders";
// import { initiateKhaltiPayment } from "../../services/khaltiServices";

// type ShippingInfo = {
//   firstName: string;
//   lastName: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   phone: string;
// };

// const CheckoutForm: React.FC = () => {
//   const { items, totalAmount, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState<
//     "shipping" | "payment" | "review"
//   >("shipping");
//   const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//     phone: "",
//   });
//   const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "khalti">(
//     "creditCard"
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [orderId, setOrderId] = useState<string | null>(null);

//   // Ensure totalAmount is valid (handle NaN case)
//   const validTotalAmount =
//     typeof totalAmount === "number" && !isNaN(totalAmount) ? totalAmount : 0;

//   // Calculate order totals for payment
//   const shipping = items.length > 0 ? 5.0 : 0;
//   const taxRate = 0.13; // 13% tax rate
//   const tax = validTotalAmount * taxRate;
//   const total = validTotalAmount + shipping + tax;

//   // Khalti configuration
//   const KHALTI_PUBLIC_KEY = "test_public_key_12345abcde"; // Replace with your actual public key

//   useEffect(() => {
//     // If we already created an order (for Khalti), but user came back, we should clean up
//     return () => {
//       if (orderId) {
//         localStorage.removeItem("pendingOrderId");
//       }
//     };
//   }, [orderId]);

//   const handleShippingSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Validate shipping info
//     for (const [key, value] of Object.entries(shippingInfo)) {
//       if (!value.trim()) {
//         setError(
//           `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
//         );
//         return;
//       }
//     }
//     setError(null);
//     setCurrentStep("payment");
//   };

//   const handlePaymentSubmit = () => {
//     setCurrentStep("review");
//   };

//   const handlePlaceOrder = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Format order items for API
//       const orderItems = items.map((item) => ({
//         productId: item.product?.id || item.id,
//         quantity: item.quantity,
//       }));

//       // Format shipping address for API
//       const shippingAddress = {
//         address: shippingInfo.address,
//         city: shippingInfo.city,
//         state: shippingInfo.state,
//         postalCode: shippingInfo.zipCode,
//         country: shippingInfo.country,
//         fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
//         phone: shippingInfo.phone,
//       };

//       // Fix: Convert amounts to numbers and ensure they're valid
//       const subtotal = Number(validTotalAmount) || 0;
//       const shippingCost = Number(shipping) || 0;
//       const taxCost = Number(tax) || 0;
//       const totalCost = Number(total) || 0;

//       console.log("Sending order with payment details:", {
//         subtotal,
//         shipping: shippingCost,
//         tax: taxCost,
//         total: totalCost,
//       });

//       // Pass taxAmount and shippingAmount directly rather than in payment details object
//       const result = await createOrder(
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         {
//           taxAmount: taxCost,
//           shippingAmount: shippingCost,
//         }
//       );

//       // Rest of your code remains the same
//       if (!result.success) {
//         throw new Error(result.error || "Failed to create order");
//       }

//       const createdOrderId = result.data._id || result.data.id;
//       setOrderId(createdOrderId);

//       // Store order ID for reference after payment
//       localStorage.setItem("pendingOrderId", createdOrderId);

//       // If Khalti is selected, initiate Khalti payment
//       if (paymentMethod === "khalti") {
//         try {
//           initiateKhaltiPayment({
//             publicKey: KHALTI_PUBLIC_KEY,
//             productIdentity: createdOrderId,
//             productName: "Your Shop Order",
//             amount: Math.round(totalCost * 100), // Use the numeric value
//             orderId: createdOrderId,
//             customerInfo: {
//               name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
//               phone: shippingInfo.phone,
//             },
//             onSuccess: (payload) => {
//               // After successful payment, redirect to success page with transaction details
//               clearCart();
//               navigate(
//                 `/orders/success/${createdOrderId}?txnId=${payload.token}&status=Completed`
//               );
//             },
//             onError: (error) => {
//               setError("Payment failed. Please try again.");
//               console.error("Khalti payment error:", error);
//             },
//           });
//         } catch (khaltiError) {
//           console.error("Khalti integration error:", khaltiError);
//           setError("Failed to initiate payment. Please try again.");
//         }
//       } else {
//         // For credit card or other payment methods
//         clearCart();
//         navigate(`/orders/success/${createdOrderId}`);
//       }
//     } catch (err: any) {
//       console.error("Order placement error:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "There was an error processing your order. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="lg:w-2/3 w-full">
//           <div className="mb-8">
//             <div className="flex mb-6">
//               <div
//                 className={`flex-1 text-center pb-4 ${
//                   currentStep === "shipping"
//                     ? "border-b-2 border-blue-600 text-blue-600 font-medium"
//                     : "border-b border-gray-300"
//                 }`}
//               >
//                 1. Shipping Information
//               </div>
//               <div
//                 className={`flex-1 text-center pb-4 ${
//                   currentStep === "payment"
//                     ? "border-b-2 border-blue-600 text-blue-600 font-medium"
//                     : "border-b border-gray-300"
//                 }`}
//               >
//                 2. Payment Method
//               </div>
//               <div
//                 className={`flex-1 text-center pb-4 ${
//                   currentStep === "review"
//                     ? "border-b-2 border-blue-600 text-blue-600 font-medium"
//                     : "border-b border-gray-300"
//                 }`}
//               >
//                 3. Review Order
//               </div>
//             </div>

//             {error && (
//               <Alert
//                 type="error"
//                 message={error}
//                 onClose={() => setError(null)}
//               />
//             )}

//             {currentStep === "shipping" && (
//               <form onSubmit={handleShippingSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={shippingInfo.firstName}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         firstName: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={shippingInfo.lastName}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         lastName: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={shippingInfo.address}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         address: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={shippingInfo.city}
//                     onChange={(e) =>
//                       setShippingInfo({ ...shippingInfo, city: e.target.value })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     State
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={shippingInfo.state}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         state: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Zip Code
//                   </label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={shippingInfo.zipCode}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         zipCode: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Country
//                   </label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={shippingInfo.country}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         country: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Phone
//                   </label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={shippingInfo.phone}
//                     onChange={(e) =>
//                       setShippingInfo({
//                         ...shippingInfo,
//                         phone: e.target.value,
//                       })
//                     }
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     required
//                   />
//                 </div>

//                 <div className="text-right mt-4">
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Processing..." : "Continue to Payment"}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {currentStep === "payment" && (
//               <PaymentMethod
//                 paymentMethod={paymentMethod}
//                 setPaymentMethod={setPaymentMethod}
//                 onSubmit={handlePaymentSubmit}
//                 onBack={() => setCurrentStep("shipping")}
//                 isLoading={isLoading}
//               />
//             )}

//             {currentStep === "review" && (
//               <div className="space-y-6">
//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     Shipping Information
//                   </h3>
//                   <div className="text-gray-700 space-y-1">
//                     <p>
//                       {shippingInfo.firstName} {shippingInfo.lastName}
//                     </p>
//                     <p>{shippingInfo.address}</p>
//                     <p>
//                       {shippingInfo.city}, {shippingInfo.state}{" "}
//                       {shippingInfo.zipCode}
//                     </p>
//                     <p>{shippingInfo.country}</p>
//                     <p>{shippingInfo.phone}</p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     Payment Method
//                   </h3>
//                   <p className="text-gray-700">
//                     {paymentMethod === "creditCard" ? "Credit Card" : "Khalti"}
//                   </p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     Order Summary
//                   </h3>
//                   <OrderSummary items={items} totalAmount={validTotalAmount} />
//                   <div className="mt-4 border-t pt-4">
//                     <div className="flex justify-between text-gray-700">
//                       <span>Subtotal:</span>
//                       <span>${validTotalAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-700">
//                       <span>Shipping:</span>
//                       <span>${shipping.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-700">
//                       <span>Tax (13%):</span>
//                       <span>${tax.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between font-semibold text-lg mt-2">
//                       <span>Total:</span>
//                       <span>${total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-between mt-6">
//                   <button
//                     onClick={() => setCurrentStep("payment")}
//                     className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
//                     disabled={isLoading}
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handlePlaceOrder}
//                     className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Processing..." : "Place Order"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="lg:w-1/3 w-full">
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Order Summary
//             </h3>
//             <OrderSummary items={items} totalAmount={validTotalAmount} />
//             <div className="mt-4 border-t pt-4">
//               <div className="flex justify-between text-gray-700">
//                 <span>Subtotal:</span>
//                 <span>${validTotalAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-700">
//                 <span>Shipping:</span>
//                 <span>${shipping.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-700">
//                 <span>Tax (13%):</span>
//                 <span>${tax.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between font-semibold text-lg mt-2">
//                 <span>Total:</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Optional additional information panel */}
//           <div className="bg-blue-50 p-4 rounded-md mt-4">
//             <h4 className="font-medium text-blue-800 mb-2">Secure Checkout</h4>
//             <p className="text-sm text-blue-700">
//               Your personal and payment information is protected with
//               industry-standard encryption.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutForm;

import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";
import Alert from "../ui/Alert";
import { createOrder } from "../../api/orders";
import { initiateKhaltiPayment } from "../../services/khaltiServices";

type ShippingInfo = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

const CheckoutForm: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<
    "shipping" | "payment" | "review"
  >("shipping");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "khalti">(
    "creditCard"
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Ensure totalAmount is valid (handle NaN case)
  const validTotalAmount =
    typeof totalAmount === "number" && !isNaN(totalAmount) ? totalAmount : 0;

  // Calculate order totals for payment
  const shipping = items.length > 0 ? 5.0 : 0;
  const taxRate = 0.13; // 13% tax rate
  const tax = validTotalAmount * taxRate;
  const total = validTotalAmount + shipping + tax;

  // Khalti configuration
  const KHALTI_PUBLIC_KEY = "test_public_key_12345abcde"; // Replace with your actual public key

  useEffect(() => {
    // If we already created an order (for Khalti), but user came back, we should clean up
    return () => {
      if (orderId) {
        localStorage.removeItem("pendingOrderId");
      }
    };
  }, [orderId]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate shipping info
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value.trim()) {
        setError(
          `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return;
      }
    }
    setError(null);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = () => {
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Format order items for API
      const orderItems = items.map((item) => ({
        productId: item.product?.id || item.id,
        quantity: item.quantity,
      }));

      // Format shipping address for API
      const shippingAddress = {
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        phone: shippingInfo.phone,
      };

      // Fix: Convert amounts to numbers and ensure they're valid
      const subtotal = Number(validTotalAmount) || 0;
      const shippingCost = Number(shipping) || 0;
      const taxCost = Number(tax) || 0;
      const totalCost = Number(total) || 0;

      console.log("Sending order with payment details:", {
        subtotal,
        shipping: shippingCost,
        tax: taxCost,
        total: totalCost,
      });

      // Pass taxAmount and shippingAmount directly rather than in payment details object
      const result = await createOrder(
        orderItems,
        shippingAddress,
        paymentMethod,
        {
          taxAmount: taxCost,
          shippingAmount: shippingCost,
        }
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to create order");
      }

      const createdOrderId = result.data._id || result.data.id;
      setOrderId(createdOrderId);

      // Store order ID for reference after payment
      localStorage.setItem("pendingOrderId", createdOrderId);

      // If Khalti is selected, initiate Khalti payment
      if (paymentMethod === "khalti") {
        try {
          // Calculate amount in paisa (Khalti requires amount in paisa: NPR * 100)
          const amountInPaisa = Math.round(totalCost * 100);

          initiateKhaltiPayment({
            publicKey: KHALTI_PUBLIC_KEY,
            productIdentity: createdOrderId,
            productName: "Your Shop Order",
            amount: amountInPaisa, // Make sure to pass amount in paisa
            orderId: createdOrderId,
            customerInfo: {
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              phone: shippingInfo.phone,
            },
            onSuccess: (payload) => {
              // After successful payment, redirect to success page with transaction details
              clearCart();
              navigate(
                `/orders/success/${createdOrderId}?txnId=${payload.token}&status=Completed`
              );
            },
            onError: (error) => {
              setError("Payment failed. Please try again.");
              console.error("Khalti payment error:", error);
            },
          });
        } catch (khaltiError) {
          console.error("Khalti integration error:", khaltiError);
          setError("Failed to initiate payment. Please try again.");
        }
      } else {
        // For credit card or other payment methods
        clearCart();
        navigate(`/orders/success/${createdOrderId}`);
      }
    } catch (err: any) {
      console.error("Order placement error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "There was an error processing your order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 w-full">
          <div className="mb-8">
            <div className="flex mb-6">
              <div
                className={`flex-1 text-center pb-4 ${
                  currentStep === "shipping"
                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                    : "border-b border-gray-300"
                }`}
              >
                1. Shipping Information
              </div>
              <div
                className={`flex-1 text-center pb-4 ${
                  currentStep === "payment"
                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                    : "border-b border-gray-300"
                }`}
              >
                2. Payment Method
              </div>
              <div
                className={`flex-1 text-center pb-4 ${
                  currentStep === "review"
                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                    : "border-b border-gray-300"
                }`}
              >
                3. Review Order
              </div>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            )}

            {currentStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        country: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div className="text-right mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              </form>
            )}

            {currentStep === "payment" && (
              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep("shipping")}
                isLoading={isLoading}
              />
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Shipping Information
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state}{" "}
                      {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Payment Method
                  </h3>
                  <p className="text-gray-700">
                    {paymentMethod === "creditCard" ? "Credit Card" : "Khalti"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Order Summary
                  </h3>
                  <OrderSummary items={items} totalAmount={validTotalAmount} />
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>${validTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (13%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3 w-full">
          {/* <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order Summary
            </h3>
            <OrderSummary items={items} totalAmount={validTotalAmount} />
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${validTotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (13%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div> */}

          {/* Optional additional information panel */}
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Secure Checkout</h4>
            <p className="text-sm text-blue-700">
              Your personal and payment information is protected with
              industry-standard encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
