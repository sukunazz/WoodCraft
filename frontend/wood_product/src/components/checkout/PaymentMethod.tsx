// import React, { useState } from "react";
// import { CreditCard, Wallet } from "lucide-react"; // Use an alternative icon, like Wallet

// interface PaymentMethodProps {
//   paymentMethod: "creditCard" | "khalti"; // Update to reflect Khalti as the payment method
//   setPaymentMethod: (method: "creditCard" | "khalti") => void;
//   onSubmit: () => void;
//   onBack: () => void;
// }

// const PaymentMethod: React.FC<PaymentMethodProps> = ({
//   paymentMethod,
//   setPaymentMethod,
//   onSubmit,
//   onBack,
// }) => {
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardName, setCardName] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit();
//   };

//   return (
//     <div>
//       <div className="flex gap-4 mb-6">
//         <div
//           className={`flex-1 p-4 border rounded-md cursor-pointer ${
//             paymentMethod === "creditCard"
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-300"
//           }`}
//           onClick={() => setPaymentMethod("creditCard")}
//         >
//           <div className="flex items-center">
//             <CreditCard className="mr-2 text-blue-600" />
//             <span className="font-medium">Credit Card</span>
//           </div>
//         </div>
//         <div
//           className={`flex-1 p-4 border rounded-md cursor-pointer ${
//             paymentMethod === "khalti"
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-300"
//           }`}
//           onClick={() => setPaymentMethod("khalti")}
//         >
//           <div className="flex items-center">
//             <Wallet className="mr-2 text-blue-600" />{" "}
//             {/* Use Wallet icon for Khalti */}
//             <span className="font-medium">Khalti</span>
//           </div>
//         </div>
//       </div>

//       {paymentMethod === "creditCard" ? (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="cardNumber"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Card Number
//             </label>
//             <input
//               type="text"
//               id="cardNumber"
//               placeholder="1234 5678 9012 3456"
//               className="w-full p-2 border border-gray-300 rounded-md"
//               value={cardNumber}
//               onChange={(e) => setCardNumber(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="cardName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Name on Card
//             </label>
//             <input
//               type="text"
//               id="cardName"
//               placeholder="John Doe"
//               className="w-full p-2 border border-gray-300 rounded-md"
//               value={cardName}
//               onChange={(e) => setCardName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label
//                 htmlFor="expiry"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Expiry Date
//               </label>
//               <input
//                 type="text"
//                 id="expiry"
//                 placeholder="MM/YY"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 value={expiry}
//                 onChange={(e) => setExpiry(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="cvv"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 CVV
//               </label>
//               <input
//                 type="text"
//                 id="cvv"
//                 placeholder="123"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 value={cvv}
//                 onChange={(e) => setCvv(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               type="button"
//               onClick={onBack}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               Back to Shipping
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//             >
//               Continue to Review
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="space-y-4">
//           <p className="text-gray-700">
//             You will be redirected to Khalti to complete your payment.
//           </p>
//           <div className="flex justify-between mt-6">
//             <button
//               type="button"
//               onClick={onBack}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               Back to Shipping
//             </button>
//             <button
//               onClick={onSubmit}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//             >
//               Continue with Khalti
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentMethod;
import React from "react";

interface PaymentMethodProps {
  paymentMethod: "creditCard" | "khalti";
  setPaymentMethod: (method: "creditCard" | "khalti") => void;
  onSubmit: () => void;
  onBack: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Choose Payment Method
        </h3>

        <div className="space-y-4">
          <div
            className={`border rounded-md p-4 cursor-pointer ${
              paymentMethod === "creditCard"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => setPaymentMethod("creditCard")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={() => setPaymentMethod("creditCard")}
                className="h-4 w-4 text-blue-600"
              />
              <label
                htmlFor="creditCard"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Credit Card
              </label>
            </div>
            {paymentMethod === "creditCard" && (
              <div className="mt-4 grid grid-cols-1 gap-y-4">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      id="expDate"
                      placeholder="MM/YY"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="nameOnCard"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    placeholder="John Doe"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          <div
            className={`border rounded-md p-4 cursor-pointer ${
              paymentMethod === "khalti"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => setPaymentMethod("khalti")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="khalti"
                checked={paymentMethod === "khalti"}
                onChange={() => setPaymentMethod("khalti")}
                className="h-4 w-4 text-purple-600"
              />
              <label
                htmlFor="khalti"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Khalti
              </label>
            </div>
            {paymentMethod === "khalti" && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  You will be redirected to Khalti to complete your payment
                  securely.
                </p>
                <div className="mt-2 bg-purple-100 p-3 rounded-md text-sm">
                  <p className="font-medium text-purple-800">
                    Khalti payment benefits:
                  </p>
                  <ul className="list-disc pl-5 mt-1 text-purple-700">
                    <li>Fast and secure digital payments</li>
                    <li>No additional charges</li>
                    <li>Loyalty rewards and cashback</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800">
          Back to Shipping
        </button>
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
