// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getOrderById, updateOrderStatus } from "../../api/orders";
// import { Order } from "../../types";

// const OrderSuccess: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { orderId } = useParams<{ orderId: string }>();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Get query parameters from Khalti redirect
//   const queryParams = new URLSearchParams(location.search);
//   const khaltiTxnId = queryParams.get("txnId");
//   const khaltiStatus = queryParams.get("status");

//   useEffect(() => {
//     const fetchOrderAndUpdatePayment = async () => {
//       try {
//         setLoading(true);

//         // Try to get orderId from URL params or from localStorage
//         const targetOrderId = orderId || localStorage.getItem("pendingOrderId");

//         if (!targetOrderId) {
//           throw new Error("Order ID not found");
//         }

//         // Fetch order details
//         const response = await getOrderById(targetOrderId);

//         if (!response.success || !response.data) {
//           throw new Error(response.error || "Failed to fetch order");
//         }

//         const orderData = response.data;
//         setOrder(orderData);

//         // Check if this is a return from Khalti payment and order is not yet paid
//         if (khaltiTxnId && khaltiStatus === "Completed" && !orderData.isPaid) {
//           // Update order payment status
//           const paymentResult = {
//             id: khaltiTxnId,
//             status: "COMPLETED",
//             update_time: new Date().toISOString(),
//             email_address: orderData.user?.email || "",
//           };

//           const updateResponse = await updateOrderStatus(
//             targetOrderId,
//             paymentResult
//           );

//           if (updateResponse.success) {
//             setOrder(updateResponse.data);
//           } else {
//             console.error(
//               "Failed to update payment status",
//               updateResponse.error
//             );
//           }
//         }

//         // Clean up localStorage
//         localStorage.removeItem("pendingOrderId");
//       } catch (err) {
//         console.error("Error in order success page:", err);
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderAndUpdatePayment();
//   }, [orderId, khaltiTxnId, khaltiStatus]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-md mx-auto my-10 p-6 bg-red-50 rounded-lg border border-red-200">
//         <h2 className="text-xl font-semibold text-red-700 mb-4">Error</h2>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={() => navigate("/orders")}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           View Orders
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow">
//       <div className="text-center mb-6">
//         <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
//           <svg
//             className="h-8 w-8 text-green-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800">Order Successful!</h1>
//         <p className="text-gray-600 mt-2">
//           Your order has been placed and{" "}
//           {order?.isPaid ? "payment has been received" : "is awaiting payment"}.
//         </p>
//       </div>

//       <div className="border-t border-gray-200 pt-4">
//         <div className="mb-4">
//           <p className="text-sm text-gray-600">Order ID</p>
//           <p className="font-medium">{order?._id}</p>
//         </div>

//         {order?.isPaid && (
//           <div className="mb-4">
//             <p className="text-sm text-gray-600">Payment ID</p>
//             <p className="font-medium">{order.paymentResult?.id}</p>
//           </div>
//         )}

//         <div className="mb-4">
//           <p className="text-sm text-gray-600">Order Status</p>
//           <p className="font-medium">
//             {order?.isPaid ? (
//               <span className="text-green-600">Paid</span>
//             ) : (
//               <span className="text-orange-500">Awaiting Payment</span>
//             )}
//           </p>
//         </div>

//         <div className="mb-6">
//           <p className="text-sm text-gray-600">Total Amount</p>
//           <p className="font-medium">NPR {order?.totalPrice.toFixed(2)}</p>
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <button
//           onClick={() => navigate("/shop")}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           Continue Shopping
//         </button>
//         <button
//           onClick={() => navigate("/orders")}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           View Orders
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccess;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../api/orders";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaTruck,
  FaPrint,
} from "react-icons/fa";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.error || "Failed to load order details");
      }
    } catch (err) {
      setError("Error fetching order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setUpdateLoading(true);
      const response = await updateOrderStatus(id, status);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.error || "Failed to update order status");
      }
    } catch (err) {
      setError("Error updating order status");
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
            Order not found
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center"
            >
              <FaPrint className="mr-2" /> Print
            </button>

            {order.isPaid && !order.isDelivered && (
              <button
                onClick={() => handleStatusUpdate("delivered")}
                disabled={updateLoading}
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center ${
                  updateLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaTruck className="mr-2" /> Mark as Delivered
                  </>
                )}
              </button>
            )}

            {!order.isPaid && (
              <button
                onClick={() => handleStatusUpdate("paid")}
                disabled={updateLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center ${
                  updateLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Mark as Paid
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Order #{order.orderNumber || order._id}
            </h2>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="px-6 py-4">
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                <h3 className="text-gray-700 font-medium mb-2">
                  Customer Information
                </h3>
                <p className="text-gray-600">
                  {order.user?.name || "Guest Customer"}
                </p>
                <p className="text-gray-600">
                  {order.user?.email ||
                    order.customerEmail ||
                    "No email provided"}
                </p>
                <p className="text-gray-600">
                  {order.user?.phone ||
                    order.customerPhone ||
                    "No phone provided"}
                </p>
              </div>

              <div className="w-full md:w-1/2 px-3">
                <h3 className="text-gray-700 font-medium mb-2">
                  Shipping Address
                </h3>
                <p className="text-gray-600">
                  {order.shippingAddress?.address}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-700 font-medium mb-2">Order Status</h3>
              <div className="flex flex-wrap">
                <div className="flex items-center mr-6 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      order.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-gray-700">
                    {order.isPaid
                      ? `Paid (${formatDate(order.paidAt)})`
                      : "Payment Pending"}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      order.isDelivered ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-gray-700">
                    {order.isDelivered
                      ? `Delivered (${formatDate(order.deliveredAt)})`
                      : "Pending Delivery"}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-gray-700 font-medium mb-3">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.variant && (
                              <div className="text-sm text-gray-500">
                                {item.variant}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800 font-medium">
                    ${order.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800 font-medium">
                    ${order.shippingPrice.toFixed(2)}
                  </span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800 font-medium">
                      ${order.taxPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-blue-600 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.paymentMethod && (
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-gray-700 font-medium mb-2">
                Payment Information
              </h3>
              <p className="text-gray-600">Method: {order.paymentMethod}</p>
              {order.paymentResult && (
                <>
                  <p className="text-gray-600">ID: {order.paymentResult.id}</p>
                  <p className="text-gray-600">
                    Status: {order.paymentResult.status}
                  </p>
                  {order.paymentResult.update_time && (
                    <p className="text-gray-600">
                      Date: {formatDate(order.paymentResult.update_time)}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {order.notes && (
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-gray-700 font-medium mb-2">Order Notes</h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
