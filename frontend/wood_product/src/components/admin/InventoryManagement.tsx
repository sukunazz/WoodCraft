// components/admin/InventoryManagement.tsx
import React, { useState, useEffect } from "react";
import { Product } from "../../types";
import { Link } from "react-router-dom";
import { Edit, Trash2, Search } from "lucide-react";
import Alert from "../ui/Alert";
import Modal from "../ui/Modal";
import { formatPrice } from "../../utils/formatPrice";

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Toys",

    "All Categories",
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Toys",
    "Beauty",
    "Sports",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Error loading products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All Categories") {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setSuccess(`Product "${productToDelete.name}" deleted successfully`);
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      setError("Error deleting product. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading inventory...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Inventory Management</h2>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category === "All Categories" ? "" : category}
              >
                {category}
              </option>
            ))}
          </select>

          <Link
            to="/admin/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-4">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            product.image ||
                            "/assets/images/product-placeholder.jpg"
                          }
                          alt={product.name}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        product.stock <= 10
                          ? "text-red-600 font-medium"
                          : "text-gray-900"
                      }`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <Modal isOpen={showDeleteModal} onClose={cancelDelete}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the product "
              {productToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryManagement;
