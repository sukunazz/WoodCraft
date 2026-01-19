import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, uploadProductImage } from "../../api/products";
import { toast } from "react-toastify";
import {
  FaSave,
  FaTimes,
  FaUpload,
  FaTag,
  FaLayerGroup,
  FaChevronLeft,
} from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [""], // Changed from single image to array of images
    brand: "",
    category: "",
    inStock: "", // Changed from countInStock to inStock
    description: "",
    material: "", // Added material field
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "cm",
    },
    weight: "",
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  // Predefined categories for selection
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Books",
    "Sports",
    "Toys",
    "Automotive",
    "Other",
  ];

  // Predefined materials for selection
  const materials = [
    "Wood",
    "Metal",
    "Plastic",
    "Glass",
    "Fabric",
    "Leather",
    "Ceramic",
    "Paper",
    "Composite",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For number fields, ensure they're properly formatted
    if (name === "price" || name === "inStock" || name === "weight") {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) && value !== "") return;
    }

    // For dimensions
    if (name.startsWith("dimensions.")) {
      const dimensionProperty = name.split(".")[1];
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions,
          [dimensionProperty]: value,
        },
      });
      return;
    }

    // For checkbox (featured)
    if (name === "featured") {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setFormData({
      ...formData,
      images: [imageUrl], // Set as first image in the array
    });

    // Set preview if it's a valid URL
    if (imageUrl) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const response = await uploadProductImage(file);
      if (response.success && response.data?.url) {
        setFormData((prev) => ({
          ...prev,
          images: [response.data.url],
        }));
        setImagePreview(response.data.url);
        toast.success("Image uploaded successfully.");
      } else {
        setError(response.error || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.images?.[0]) {
      setError("Please upload or provide an image URL.");
      setLoading(false);
      return;
    }

    try {
      // Convert string values to appropriate types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        inStock: parseInt(formData.inStock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length
            ? parseFloat(formData.dimensions.length)
            : undefined,
          width: formData.dimensions.width
            ? parseFloat(formData.dimensions.width)
            : undefined,
          height: formData.dimensions.height
            ? parseFloat(formData.dimensions.height)
            : undefined,
          unit: formData.dimensions.unit,
        },
      };

      const response = await addProduct(productData);

      if (response.success) {
        toast.success("Product created successfully.");
        navigate("/admin/products");
      } else {
        setError(response.error || "Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaChevronLeft className="mr-1" /> Back to Products
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-800">
              Add New Product
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Basic Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (USD) *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="text"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full pl-7 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          In Stock *
                        </label>
                        <input
                          type="number"
                          name="inStock"
                          required
                          min="0"
                          value={formData.inStock}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brand name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material *
                      </label>
                      <select
                        name="material"
                        required
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a material</option>
                        {materials.map((material) => (
                          <option key={material} value={material}>
                            {material}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Feature this product</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Dimensions
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Length
                      </label>
                      <input
                        type="text"
                        name="dimensions.length"
                        value={formData.dimensions.length}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width
                      </label>
                      <input
                        type="text"
                        name="dimensions.width"
                        value={formData.dimensions.width}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <input
                        type="text"
                        name="dimensions.height"
                        value={formData.dimensions.height}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="dimensions.unit"
                      value={formData.dimensions.unit}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="m">Meters (m)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Description
                  </h2>
                  <div>
                    <textarea
                      name="description"
                      rows={6}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed product description..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Image Upload & Preview */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Product Image
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64 mb-4 bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="max-h-full object-contain"
                      onError={() => setImagePreview(null)}
                    />
                  ) : (
                    <div className="text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag an image here or upload one.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload image
                    </label>
                    <label className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer">
                      <FaUpload className="text-base" />
                      {uploading ? "Uploading..." : "Select file"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      Images are uploaded to Cloudinary.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Or paste image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.images[0] || ""}
                      onChange={handleImageChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Product
                    </>
                  )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
