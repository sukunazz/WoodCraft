// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { getOrderById } from "../api/orders";
// import { formatPrice } from "../utils/formatPrice";
// import Loading from "../components/ui/Loading";

// interface OrderItem {
//   id: string;
//   productId: string;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// interface OrderAddress {
//   firstName: string;
//   lastName: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// interface OrderDetails {
//   id: string;
//   orderNumber: string;
//   createdAt: string;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
//   total: number;
//   subtotal: number;
//   tax: number;
//   shipping: number;
//   paymentMethod: string;
//   shippingAddress: OrderAddress;
//   billingAddress: OrderAddress;
//   items: OrderItem[];
//   trackingNumber?: string;
//   estimatedDelivery?: string;
// }

// const OrderStatusBadge: React.FC<{ status: OrderDetails["status"] }> = ({
//   status,
// }) => {
//   const statusStyles = {
//     pending: "bg-yellow-100 text-yellow-800",
//     processing: "bg-blue-100 text-blue-800",
//     shipped: "bg-purple-100 text-purple-800",
//     delivered: "bg-green-100 text-green-800",
//     cancelled: "bg-red-100 text-red-800",
//   };

//   const statusText = {
//     pending: "Pending",
//     processing: "Processing",
//     shipped: "Shipped",
//     delivered: "Delivered",
//     cancelled: "Cancelled",
//   };

//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
//     >
//       {statusText[status]}
//     </span>
//   );
// };

// const OrderDetails: React.FC = () => {
//   const { orderId } = useParams<{ orderId: string }>();
//   const { user } = useAuth();
//   const [order, setOrder] = useState<OrderDetails | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setLoading(true);
//         const data = await getOrderById(orderId as string);
//         setOrder(data);
//       } catch (err) {
//         setError("Failed to load order details. Please try again.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && orderId) {
//       fetchOrder();
//     }
//   }, [user, orderId]);

//   if (loading) return <Loading />;

//   if (!user) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//         <p className="text-gray-600 mb-8">
//           You need to be logged in to view order details.
//         </p>
//         <Link
//           to="/login"
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-8">
//           <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
//           <p className="text-red-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
//         <p className="text-gray-600 mb-8">
//           The order you're looking for doesn't exist or you don't have
//           permission to view it.
//         </p>
//         <Link
//           to="/orders"
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Back to Orders
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//           <Link
//             to="/orders"
//             className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Back to Orders
//           </Link>
//         </div>

//         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//           <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
//             <div>
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Order #{order.orderNumber}
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Placed on {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <OrderStatusBadge status={order.status} />
//           </div>

//           {order.status === "shipped" && order.trackingNumber && (
//             <div className="bg-blue-50 px-4 py-3 border-t border-blue-100">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-blue-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 8.293 3.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3 flex-1 md:flex md:justify-between">
//                   <p className="text-sm text-blue-700">
//                     Your order is on its way! Tracking number:{" "}
//                     <span className="font-medium">{order.trackingNumber}</span>
//                   </p>
//                   {order.estimatedDelivery && (
//                     <p className="mt-3 text-sm md:mt-0 md:ml-6 text-blue-700">
//                       Estimated delivery:{" "}
//                       <span className="font-medium">
//                         {order.estimatedDelivery}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="border-t border-gray-200">
//             <div className="px-4 py-5 sm:p-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-4">Items</h4>
//               <div className="border border-gray-200 rounded-md overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Product
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Price
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Quantity
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {order.items.map((item) => (
//                       <tr key={item.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <img
//                                 className="h-10 w-10 object-cover rounded-md"
//                                 src={
//                                   item.productImage ||
//                                   "/assets/images/product-placeholder.jpg"
//                                 }
//                                 alt={item.productName}
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 <Link
//                                   to={`/product/${item.productId}`}
//                                   className="hover:text-indigo-600"
//                                 >
//                                   {item.productName}
//                                 </Link>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatPrice(item.price)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {item.quantity}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                           {formatPrice(item.total)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
//             <div className="flex justify-between mb-6">
//               <div>
//                 <h4 className="text-lg font-medium text-gray-900 mb-4">
//                   Shipping Address
//                 </h4>
//                 <address className="not-italic text-sm text-gray-700">
//                   {order.shippingAddress.firstName}{" "}
//                   {order.shippingAddress.lastName}
//                   <br />
//                   {order.shippingAddress.street}
//                   <br />
//                   {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
//                   {order.shippingAddress.zipCode}
//                   <br />
//                   {order.shippingAddress.country}
//                 </address>
//               </div>
//               <div>
//                 <h4 className="text-lg font-medium text-gray-900 mb-4">
//                   Billing Address
//                 </h4>
//                 <address className="not-italic text-sm text-gray-700">
//                   {order.billingAddress.firstName}{" "}
//                   {order.billingAddress.lastName}
//                   <br />
//                   {order.billingAddress.street}
//                   <br />
//                   {order.billingAddress.city}, {order.billingAddress.state}{" "}
//                   {order.billingAddress.zipCode}
//                   <br />
//                   {order.billingAddress.country}
//                 </address>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 pt-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-4">
//                 Payment Information
//               </h4>
//               <p className="text-sm text-gray-700 mb-2">
//                 <span className="font-medium">Payment Method:</span>{" "}
//                 {order.paymentMethod}
//               </p>
//             </div>

//             <div className="border-t border-gray-200 pt-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-4">
//                 Order Summary
//               </h4>
//               <div className="flow-root">
//                 <dl className="-my-4 text-sm divide-y divide-gray-200">
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Subtotal</dt>
//                     <dd className="font-medium text-gray-900">
//                       {formatPrice(order.subtotal)}
//                     </dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Shipping</dt>
//                     <dd className="font-medium text-gray-900">
//                       {formatPrice(order.shipping)}
//                     </dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Tax</dt>
//                     <dd className="font-medium text-gray-900">
//                       {formatPrice(order.tax)}
//                     </dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-base font-medium text-gray-900">
//                       Total
//                     </dt>
//                     <dd className="text-base font-medium text-gray-900">
//                       {formatPrice(order.total)}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/orders";
import { initiateKhaltiPayment } from "../services/khaltiServices";

// Replace this with your actual Alert component or use inline
const Alert = ({ type, message }: { type: string; message: string }) => (
  <div
    className={`p-4 rounded text-sm ${
      type === "error"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {message}
  </div>
);

interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    fullName: string;
    phone: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address?: string;
  };
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const KHALTI_PUBLIC_KEY = import.meta.env.VITE_KHALTI_PUBLIC_KEY; // Replace with your actual key

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!orderId) return;

        const response = await getOrderById(orderId);

        if (!response?.success) {
          throw new Error(response?.error || "Failed to fetch order");
        }

        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayWithKhalti = () => {
    if (!order) return;

    setPaymentLoading(true);

    try {
      initiateKhaltiPayment({
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: order._id,
        productName: "Your Shop Order",
        amount: order.totalPrice * 100, // Khalti expects amount in paisa
        orderId: order._id,
        customerInfo: {
          name: order.shippingAddress.fullName,
          phone: order.shippingAddress.phone,
        },
        onSuccess: (payload) => {
          updateOrderStatus(order._id, {
            id: payload.token,
            status: "COMPLETED",
            update_time: new Date().toISOString(),
          })
            .then((response) => {
              if (response.success) {
                setOrder(response.data);
              } else {
                setError(response.error || "Failed to update payment status");
              }
              setPaymentLoading(false);
            })
            .catch((err) => {
              console.error("Error updating payment status:", err);
              setError("Payment was successful, but updating order failed.");
              setPaymentLoading(false);
            });
        },
        onError: (err) => {
          console.error("Khalti payment error:", err);
          setError("Khalti payment failed. Please try again.");
          setPaymentLoading(false);
        },
        onClose: () => {
          setPaymentLoading(false);
        },
      });
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError("Failed to initiate Khalti payment.");
      setPaymentLoading(false);
    }
  };

  if (loading) return <div>Loading order...</div>;
  if (error) return <Alert type="error" message={error} />;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="mb-4">
        <strong>Order ID:</strong> {order._id}
      </div>

      <div className="mb-4">
        <strong>Shipping Address:</strong>
        <br />
        {order.shippingAddress.fullName}
        <br />
        {order.shippingAddress.address}, {order.shippingAddress.city}
        <br />
        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        <br />
        Phone: {order.shippingAddress.phone}
      </div>

      <div className="mb-4">
        <strong>Payment Method:</strong> {order.paymentMethod}
      </div>

      <div className="mb-4">
        <strong>Payment Status:</strong>{" "}
        {order.isPaid ? (
          <span className="text-green-600">
            Paid at {new Date(order.paidAt!).toLocaleString()}
          </span>
        ) : (
          <span className="text-red-600">Not Paid</span>
        )}
      </div>

      <div className="mb-4">
        <strong>Delivery Status:</strong>{" "}
        {order.isDelivered ? (
          <span className="text-green-600">
            Delivered at {new Date(order.deliveredAt!).toLocaleString()}
          </span>
        ) : (
          <span className="text-red-600">Not Delivered</span>
        )}
      </div>

      <div className="mb-4">
        <strong>Items:</strong>
        <ul className="list-disc ml-6 space-y-2">
          {order.orderItems.map((item) => (
            <li key={item._id}>
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-cover inline-block mr-2"
              />
              {item.name} - {item.quantity} x ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
      </div>

      {!order.isPaid && (
        <button
          onClick={handlePayWithKhalti}
          disabled={paymentLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
        >
          {paymentLoading ? "Processing..." : "Pay with Khalti"}
        </button>
      )}
    </div>
  );
};

export default OrderDetail;
