import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaSave, FaArrowLeft, FaImage, FaTrash } from "react-icons/fa";

// Import API functions
import { getProductById, updateProduct } from "../../api/products";

// Define interface for component props and URL params
interface RouteParams {
  id: string;
  [key: string]: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    material: "",
    dimensions: { length: 0, width: 0, height: 0 },
    weight: 0,
    images: [] as string[],
    countInStock: 0,
    inStock: 0,
    featured: false,
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("Product ID is missing");
          setLoading(false);
          return;
        }

        const response = await getProductById(id);

        if (response.success && response.data) {
          // Handle potential different field names
          const productData = response.data;
          setProduct({
            ...productData,
            countInStock: productData.countInStock || productData.inStock || 0,
            inStock: productData.inStock || productData.countInStock || 0,
            dimensions: productData.dimensions || {
              length: 0,
              width: 0,
              height: 0,
            },
            images: productData.images || [],
          });

          // Set first image as preview if available
          if (productData.images && productData.images.length > 0) {
            setImagePreview(productData.images[0]);
          } else if (productData.image) {
            setImagePreview(productData.image);
          }
        } else {
          setError(response.error || "Failed to load product");
        }
      } catch (err) {
        setError("An error occurred while fetching the product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      // Handle nested fields like dimensions.length
      const [parent, child] = name.split(".");
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === "number" ? parseFloat(value) : value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? parseFloat(value)
            : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      // Here you would typically upload the image to your server/cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageUrl = reader.result as string;
        setImagePreview(newImageUrl);

        // Add the new image URL to the product images array
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, newImageUrl],
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));

    // Update preview if needed
    if (product.images.length > 0 && indexToRemove === 0) {
      setImagePreview(product.images[1] || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      if (!id) {
        setError("Product ID is missing");
        setSaving(false);
        return;
      }

      // Make sure stock values are synchronized
      const updatedProduct = {
        ...product,
        countInStock: product.countInStock,
        inStock: product.countInStock,
      };

      // Call the API to update the product
      const response = await updateProduct(id, updatedProduct);

      if (response.success) {
        setSuccess(true);
        // Redirect after short delay or let user see success message
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      } else {
        setError(response.error || "Failed to update product");
      }
    } catch (err) {
      setError("An error occurred while updating the product");
      console.error(err);
    } finally {
      setSaving(false);
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to="/admin/products"
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Edit Product
            </h1>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Product updated successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Basic info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={product.price}
                        onChange={handleChange}
                        required
                        className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={product.material}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      min="0"
                      step="0.1"
                      value={product.weight}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Dimensions
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        name="dimensions.length"
                        min="0"
                        step="0.1"
                        value={product.dimensions?.length || 0}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        name="dimensions.width"
                        min="0"
                        step="0.1"
                        value={product.dimensions?.width || 0}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="dimensions.height"
                        min="0"
                        step="0.1"
                        value={product.dimensions?.height || 0}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Images and inventory */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Product Images
                  </h3>

                  <div className="border border-gray-300 rounded-md p-4 mb-4">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-40 object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40 bg-gray-100 rounded mb-4">
                        <span className="text-gray-500">No image preview</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <label className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
                        <FaImage className="mr-2" />
                        <span>Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      <div className="text-sm text-gray-600">
                        {product.images ? product.images.length : 0} image(s)
                      </div>
                    </div>
                  </div>

                  {/* Image gallery */}
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-16 w-full object-cover rounded border border-gray-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/placeholder.jpg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Inventory
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="countInStock"
                      min="0"
                      value={product.countInStock}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={product.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="featured"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <div className="flex space-x-3">
                <Link
                  to="/admin/products"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
