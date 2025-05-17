import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserOrders } from "../api/orders";
import { formatPrice } from "../utils/formatPrice";
import Loading from "../components/ui/Loading";
import { Order } from "../types";

const OrderStatusBadge = ({ status }) => {
  // Map API status values to styling and display text
  const getStatusInfo = (apiStatus) => {
    const statusMap = {
      Pending: {
        style: "bg-amber-100 text-amber-800 border border-amber-300",
        text: "Pending",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      Processing: {
        style: "bg-blue-100 text-blue-800 border border-blue-300",
        text: "Processing",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
      },
      Shipped: {
        style: "bg-purple-100 text-purple-800 border border-purple-300",
        text: "Shipped",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        ),
      },
      Delivered: {
        style: "bg-green-100 text-green-800 border border-green-300",
        text: "Delivered",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      },
      Cancelled: {
        style: "bg-red-100 text-red-800 border border-red-300",
        text: "Cancelled",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
      },
    };

    // Handle lowercase variations too
    const normalizedStatus =
      apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1).toLowerCase();

    // Default in case status is not one of the expected values
    return (
      statusMap[normalizedStatus] || {
        style: "bg-gray-100 text-gray-800 border border-gray-300",
        text: apiStatus,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      }
    );
  };

  const { style, text, icon } = getStatusInfo(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {icon}
      {text}
    </span>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getUserOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to view your order history and track your purchases.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-800">
                Error Loading Orders
              </h2>
            </div>
            <p className="text-red-700">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 mt-12 mb-8">
          <h1 className="text-3xl font-bold text-white">Your Orders</h1>
          <p className="text-indigo-100 mt-2">
            Track and manage your purchase history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              It looks like you haven't placed any orders yet. Start shopping to
              see your purchase history here.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Browse Our Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                to={`/orders/${order._id}`}
                key={order._id}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-indigo-600 mb-1">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="flex items-center mr-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          {order.orderItems.length}{" "}
                          {order.orderItems.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="font-bold text-lg text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/profile"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Profile
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Continue Shopping
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;

// Orders.tsx - Updated to work with your API structure
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { getUserOrders } from "../api/orders";
// import { formatPrice } from "../utils/formatPrice";
// import Loading from "../components/ui/Loading";
// import { Order } from "../types"; // Make sure your types are correctly defined

// const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
//   // Map API status values to styling and display text
//   const getStatusInfo = (apiStatus: string) => {
//     const statusMap: Record<string, { style: string; text: string }> = {
//       Pending: {
//         style: "bg-yellow-100 text-yellow-800",
//         text: "Pending",
//       },
//       Processing: {
//         style: "bg-blue-100 text-blue-800",
//         text: "Processing",
//       },
//       Shipped: {
//         style: "bg-purple-100 text-purple-800",
//         text: "Shipped",
//       },
//       Delivered: {
//         style: "bg-green-100 text-green-800",
//         text: "Delivered",
//       },
//       Cancelled: {
//         style: "bg-red-100 text-red-800",
//         text: "Cancelled",
//       },
//       // Add lowercase variations to handle case differences
//       pending: {
//         style: "bg-yellow-100 text-yellow-800",
//         text: "Pending",
//       },
//       processing: {
//         style: "bg-blue-100 text-blue-800",
//         text: "Processing",
//       },
//       shipped: {
//         style: "bg-purple-100 text-purple-800",
//         text: "Shipped",
//       },
//       delivered: {
//         style: "bg-green-100 text-green-800",
//         text: "Delivered",
//       },
//       cancelled: {
//         style: "bg-red-100 text-red-800",
//         text: "Cancelled",
//       },
//     };

//     // Default in case status is not one of the expected values
//     return (
//       statusMap[apiStatus] || {
//         style: "bg-gray-100 text-gray-800",
//         text: apiStatus,
//       }
//     );
//   };

//   const { style, text } = getStatusInfo(status);

//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
//     >
//       {text}
//     </span>
//   );
// };

// const Orders: React.FC = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching orders...");

//         // Fetch orders from the API
//         const fetchedOrders = await getUserOrders();
//         console.log("Orders data:", fetchedOrders);

//         // Set the orders
//         setOrders(fetchedOrders);
//       } catch (err: any) {
//         console.error("Error fetching orders:", err);
//         setError(err.message || "Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchOrders();
//     }
//   }, [user]);

//   if (loading) return <Loading />;

//   if (!user) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//         <p className="text-gray-600 mb-8">
//           You need to be logged in to view your orders.
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

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Orders</h1>

//         {orders.length === 0 ? (
//           <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No orders found
//             </h3>
//             <p className="text-gray-500 mb-6">
//               You haven't placed any orders yet.
//             </p>
//             <Link
//               to="/shop"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <li key={order._id}>
//                   <Link
//                     to={`/orders/${order._id}`}
//                     className="block hover:bg-gray-50"
//                   >
//                     <div className="px-4 py-4 sm:px-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <p className="text-sm font-medium text-indigo-600 truncate">
//                             Order #{order._id.slice(-6)}
//                           </p>
//                         </div>
//                         <div className="ml-2 flex-shrink-0 flex">
//                           <OrderStatusBadge status={order.status} />
//                         </div>
//                       </div>
//                       <div className="mt-2 sm:flex sm:justify-between">
//                         <div className="sm:flex">
//                           <p className="flex items-center text-sm text-gray-500">
//                             <span>
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </span>
//                           </p>
//                           <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
//                             <span>
//                               {order.orderItems.length}{" "}
//                               {order.orderItems.length === 1 ? "item" : "items"}
//                             </span>
//                           </p>
//                         </div>
//                         <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                           <p className="font-medium text-gray-900">
//                             {formatPrice(order.totalAmount)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <div className="mt-8">
//           <Link
//             to="/profile"
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
//             Back to Profile
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;
