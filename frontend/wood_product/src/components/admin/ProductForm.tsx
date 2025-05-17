import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../types";
import Alert from "../ui/Alert";

interface ProductFormProps {
  mode: "add" | "edit";
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    rating: 0,
    stock: 0,
    featured: false,
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) throw new Error("Product not found");
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          setError("Failed to load product details");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setProduct((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const url = mode === "add" ? "/api/products" : `/api/products/${id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to save product");

      setSuccess(
        mode === "add"
          ? "Product created successfully!"
          : "Product updated successfully!"
      );

      if (mode === "add") {
        setProduct({
          name: "",
          description: "",
          price: 0,
          category: "",
          image: "",
          rating: 0,
          stock: 0,
          featured: false,
        });
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setError("Error saving product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === "edit") {
    return (
      <div className="flex justify-center p-8">Loading product details...</div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">
        {mode === "add" ? "Add New Product" : "Edit Product"}
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category*
            </label>
            <select
              id="category"
              name="category"
              required
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="books">Books</option>
              <option value="toys">Toys & Games</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="sports">Sports & Outdoors</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock Quantity*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              required
              value={product.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={product.rating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={product.image || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={product.featured || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
            Featured Product
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Saving..."
              : mode === "add"
              ? "Create Product"
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
