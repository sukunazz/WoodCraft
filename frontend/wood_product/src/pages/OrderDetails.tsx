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
import { useParams, useSearchParams } from "react-router-dom";
import { getOrderById, updateOrderToPaid } from "../api/orders";
import { initiateKhaltiPayment } from "../services/khaltiServices";
import { Order } from "../types";


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


const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [autoPayTriggered, setAutoPayTriggered] = useState(false);



  const KHALTI_PUBLIC_KEY = import.meta.env.VITE_KHALTI_PUBLIC_KEY;


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const response = await getOrderById(id);

        if (!response?.success || !response.data) {
          const errorMessage = response?.success
            ? "Failed to fetch order"
            : response?.error || "Failed to fetch order";
          throw new Error(errorMessage);
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
  }, [id]);

  useEffect(() => {
    const shouldAutoPay = searchParams.get("pay") === "1";
    if (!shouldAutoPay || autoPayTriggered || !order || order.isPaid) return;

    const tryAutoPay = () => {
      if (!window.KhaltiCheckout) return false;
      setAutoPayTriggered(true);
      handlePayWithKhalti();
      return true;
    };

    if (tryAutoPay()) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryAutoPay() || attempts > 12) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [searchParams, autoPayTriggered, order]);


  const handlePayWithKhalti = () => {
    if (!order || order.isPaid) return;

    setPaymentLoading(true);

    try {
      initiateKhaltiPayment({
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: order._id,
        productName: "Your Shop Order",
        amount: order.totalAmount ?? order.totalPrice ?? 0,
        orderId: order._id,
        customerInfo: {
          name: order.shippingAddress?.fullName || "Customer",
          phone: order.shippingAddress?.phone || "",
        },
        onSuccess: (payload) => {
          updateOrderToPaid(order._id, {
            id: payload.token,
            status: "COMPLETED",
            update_time: new Date().toISOString(),
            email_address: payload.email || payload.email_address,
          })
            .then((response) => {
              if (response.success && response.data) {
                setOrder(response.data);
              } else {
                const errorMessage = response.success
                  ? "Failed to update payment status"
                  : response.error;
                setError(errorMessage || "Failed to update payment status");
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

  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const shipping = order.shippingAddress;
  const taxAmount = order.taxAmount ?? order.taxPrice ?? 0;
  const shippingAmount = order.shippingAmount ?? order.shippingPrice ?? 0;
  const totalAmount = order.totalAmount ?? order.totalPrice ?? 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_15%_10%,rgba(253,230,138,0.35),transparent),radial-gradient(50%_50%_at_85%_0%,rgba(251,191,36,0.2),transparent),linear-gradient(180deg,rgba(255,251,235,0.92),rgba(255,255,255,0.98))] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] border border-amber-100/70 bg-white/90 shadow-[0_30px_80px_-60px_rgba(120,53,15,0.6)]">
          <div className="relative px-6 py-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,53,15,0.95),rgba(146,64,14,0.92),rgba(180,83,9,0.85))]" />
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(253,230,138,0.7),transparent_60%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-amber-100/70">
                  Order Detail
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <p className="mt-3 text-amber-100">
                  Placed on
                  {order.createdAt
                    ? ` ${new Date(order.createdAt).toLocaleDateString()}`
                    : " Date unavailable"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-amber-200/40 bg-amber-50/15 px-4 py-3">
                  <p className="text-xs text-amber-100/70">Items</p>
                  <p className="text-lg font-semibold text-white">{totalItems}</p>
                </div>
                <div className="rounded-2xl border border-amber-200/40 bg-amber-50/15 px-4 py-3">
                  <p className="text-xs text-amber-100/70">Total</p>
                  <p className="text-lg font-semibold text-white">
                    ${(order.totalAmount ?? order.totalPrice ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200/40 bg-amber-50/15 px-4 py-3">
                  <p className="text-xs text-amber-100/70">Payment</p>
                  <p className="text-lg font-semibold text-white">
                    {order.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-10 space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-3xl border border-amber-100/60 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-600/70">
                      Items
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                      Order Summary
                    </h3>
                  </div>
                  {!order.isPaid && (
                    <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Payment due
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-4 rounded-2xl border border-amber-100/60 bg-amber-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty {item.quantity} · ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-amber-100/60 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Shipping
                  </p>
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {shipping?.fullName || "Customer"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {shipping?.address || "Address unavailable"}
                    {shipping?.city ? `, ${shipping.city}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {shipping?.postalCode || "—"}
                    {shipping?.country ? `, ${shipping.country}` : ""}
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Phone: {shipping?.phone || "—"}
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-100/60 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Payment
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Method</span>
                      <span className="font-semibold">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <span
                        className={`font-semibold ${
                          order.isPaid ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {order.isPaid
                          ? `Paid ${new Date(order.paidAt!).toLocaleDateString()}`
                          : "Not paid"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery</span>
                      <span
                        className={`font-semibold ${
                          order.isDelivered
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {order.isDelivered && order.deliveredAt
                          ? `Delivered ${new Date(
                              order.deliveredAt
                            ).toLocaleDateString()}`
                          : "Not delivered"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-amber-100/60 pt-4 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>Shipping</span>
                      <span>${shippingAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {!order.isPaid && (
                    <button
                      onClick={handlePayWithKhalti}
                      disabled={paymentLoading}
                      className="mt-6 w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-60"
                    >
                      {paymentLoading ? "Processing..." : "Pay with Khalti"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default OrderDetail;
