import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../../api/orders";
import { getLowStockProducts } from "../../api/products";
import {
  FaBox,
  FaClipboardList,
  FaExclamationTriangle,
  FaDollarSign,
} from "react-icons/fa";
import { Order, Product } from "../../types";

const Dashboard = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch low stock products
        const lowStockResponse = await getLowStockProducts();
        if (lowStockResponse.success && lowStockResponse.data) {
          setLowStockProducts(lowStockResponse.data);
        } else {
          setLowStockProducts([]);
        }

        // Fetch recent orders
        const orders = await getUserOrders();
        setRecentOrders(orders.slice(0, 5)); // Get only 5 most recent orders

        // Calculate stats
        const totalRevenue = orders.reduce(
          (sum, order) =>
            sum +
            (order.isPaid
              ? order.totalAmount ?? order.totalPrice ?? 0
              : 0),
          0
        );

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((order) => !order.isDelivered).length,
          totalRevenue,
          lowStockCount:
            lowStockResponse.success && lowStockResponse.data
              ? lowStockResponse.data.length
              : 0,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
        console.error("Dashboard data error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaClipboardList className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaBox className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.pendingOrders}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaDollarSign className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              ${(stats.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order._id.substring(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-800 font-medium">
                        ${(order.totalAmount ?? order.totalPrice ?? 0).toFixed(2)}
                      </span>
                      <span
                        className={`ml-4 px-2 py-1 text-xs rounded-full ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No recent orders found.</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all orders →
            </Link>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">
              Low Stock Products
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product._id} className="p-4 hover:bg-gray-50">
                  <Link
                    to={`/admin/products/${product._id}`}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          product.image ||
                          product.images?.[0] ||
                          "/assets/images/product-placeholder.jpg"
                        }
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          (product.inStock ?? product.countInStock ?? 0) === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.inStock === 0
                          ? "Out of Stock"
                          : `Only ${product.inStock} left`}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No low stock products found.</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <Link
              to="/admin/products"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all products →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/products/add"
            className="block p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
          >
            <h3 className="font-medium text-blue-800 mb-1">Add New Product</h3>
            <p className="text-sm text-blue-600">
              Create a new product listing
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="block p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition"
          >
            <h3 className="font-medium text-green-800 mb-1">Manage Orders</h3>
            <p className="text-sm text-green-600">
              View and update order status
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="block p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition"
          >
            <h3 className="font-medium text-purple-800 mb-1">
              Update Inventory
            </h3>
            <p className="text-sm text-purple-600">
              Manage product stock levels
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
