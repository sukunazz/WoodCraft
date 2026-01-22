import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders, updateOrderStatus } from "../../api/orders";
import {
  FaSearch,
  FaEye,
  FaTruck,
  FaFilter,
} from "react-icons/fa";
import { Order } from "../../types";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getUserOrders();
      // Sort by date, newest first
      const sortedOrders = ordersData.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(term) ||
          (typeof order.user === "object" &&
            order.user?.name?.toLowerCase().includes(term)) ||
          (order.shippingAddress &&
            ((order.shippingAddress.address &&
              order.shippingAddress.address.toLowerCase().includes(term)) ||
              (order.shippingAddress.city &&
                order.shippingAddress.city.toLowerCase().includes(term))))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "paid":
          result = result.filter((order) => order.isPaid);
          break;
        case "unpaid":
          result = result.filter((order) => !order.isPaid);
          break;
        case "delivered":
          result = result.filter((order) => order.isDelivered);
          break;
        case "processing":
          result = result.filter((order) => order.isPaid && !order.isDelivered);
          break;
      }
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      switch (dateFilter) {
        case "today":
          result = result.filter(
            (order) => new Date(order.createdAt || 0) >= today
          );
          break;
        case "7days":
          result = result.filter(
            (order) => new Date(order.createdAt || 0) >= sevenDaysAgo
          );
          break;
        case "30days":
          result = result.filter(
            (order) => new Date(order.createdAt || 0) >= thirtyDaysAgo
          );
          break;
      }
    }

    setFilteredOrders(result);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdateLoading(orderId);
      const response = await updateOrderStatus(orderId, newStatus);

      if (response.success) {
        // Update the local orders array with the updated order
        const updatedOrders = orders.map((order: Order) =>
          order._id === orderId
            ? {
                ...order,
                isDelivered:
                  newStatus === "delivered" ? true : order.isDelivered,
                deliveredAt:
                  newStatus === "delivered"
                    ? new Date().toISOString()
                    : order.deliveredAt,
              }
            : order
        );
        setOrders(updatedOrders);
      } else {
        const errorMessage = response.success
          ? "Failed to update order status"
          : response.error;
        setError(errorMessage || "Failed to update order status");
      }
    } catch (err) {
      setError("Error updating order status");
      console.error(err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusBadge = (order: Order) => {
    if (!order.isPaid) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          Unpaid
        </span>
      );
    } else if (order.isDelivered) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Delivered
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Processing
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Orders Management
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{order._id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof order.user === "object" && order.user?.name
                          ? order.user.name
                          : "Guest User"}
                      </div>
                      {order.shippingAddress && (
                        <div className="text-xs text-gray-500">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.country}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(
                          order.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(
                          order.createdAt || Date.now()
                        ).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${(order.totalAmount ?? order.totalPrice ?? 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye size={18} />
                        </Link>

                        {order.isPaid && !order.isDelivered && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "delivered")
                            }
                            disabled={updateLoading === order._id}
                            className={`text-green-600 hover:text-green-900 ${
                              updateLoading === order._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {updateLoading === order._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-green-500"></div>
                            ) : (
                              <FaTruck size={18} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Count Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredOrders.length}</span>{" "}
            of <span className="font-medium">{orders.length}</span> orders
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
