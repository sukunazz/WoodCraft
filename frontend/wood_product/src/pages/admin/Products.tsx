// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { getProducts, updateProductStock } from "../../api/products";
// import { FaEdit, FaPlus, FaTrash, FaSearch, FaSort } from "react-icons/fa";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("newest");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [updateMode, setUpdateMode] = useState(null);
//   const [newStock, setNewStock] = useState(0);

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, search, sortBy, categoryFilter]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await getProducts(
//         search,
//         currentPage,
//         categoryFilter,
//         sortBy
//       );

//       if (response.success) {
//         setProducts(response.data.items);
//         setTotalPages(response.data.pages);

//         // Extract unique categories for filter dropdown
//         const uniqueCategories = [
//           ...new Set(response.data.items.map((product) => product.category)),
//         ];
//         setCategories(uniqueCategories);
//       } else {
//         setError(response.error);
//       }
//     } catch (err) {
//       setError("Failed to load products");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStockUpdate = async (productId) => {
//     try {
//       const response = await updateProductStock(productId, newStock);

//       if (response.success) {
//         setProducts(
//           products.map((product) =>
//             product._id === productId
//               ? { ...product, countInStock: newStock }
//               : product
//           )
//         );
//         setUpdateMode(null);
//       } else {
//         setError(response.error);
//       }
//     } catch (err) {
//       setError("Failed to update stock");
//       console.error(err);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page with new search
//   };

//   if (loading && currentPage === 1) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Products</h1>
//         <Link
//           to="/admin/products/add"
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
//         >
//           <FaPlus className="mr-2" /> Add Product
//         </Link>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       {/* Filters and Search */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
//           <form onSubmit={handleSearchSubmit} className="flex-1 mb-4 md:mb-0">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
//           </form>

//           <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//             <select
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="newest">Newest</option>
//               <option value="priceAsc">Price: Low to High</option>
//               <option value="priceDesc">Price: High to Low</option>
//               <option value="popular">Most Popular</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stock
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Rating
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products.map((product) => (
//                 <tr key={product._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img
//                           className="h-10 w-10 object-cover rounded"
//                           src={product.image}
//                           alt={product.name}
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {product.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           ID: {product._id.substring(0, 8)}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                       {product.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ${product.price.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {updateMode === product._id ? (
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           className="w-20 border rounded px-2 py-1"
//                           value={newStock}
//                           onChange={(e) =>
//                             setNewStock(parseInt(e.target.value))
//                           }
//                         />
//                         <button
//                           onClick={() => handleStockUpdate(product._id)}
//                           className="text-green-600 hover:text-green-900"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setUpdateMode(null)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center">
//                         <span
//                           className={`text-sm ${
//                             product.countInStock > 10
//                               ? "text-green-600"
//                               : product.countInStock > 0
//                               ? "text-yellow-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {product.countInStock} in stock
//                         </span>
//                         <button
//                           onClick={() => {
//                             setUpdateMode(product._id);
//                             setNewStock(product.countInStock);
//                           }}
//                           className="ml-2 text-gray-500 hover:text-gray-700"
//                         >
//                           <FaEdit size={14} />
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="text-sm text-gray-900">
//                         {product.ratings.toFixed(1)}
//                       </div>
//                       <div className="ml-1 text-sm text-gray-500">
//                         ({product.numReviews})
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
//                       <Link
//                         to={`/admin/products/edit/${product._id}`}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         <FaEdit size={18} />
//                       </Link>
//                       <button className="text-red-600 hover:text-red-900">
//                         <FaTrash size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing page <span className="font-medium">{currentPage}</span>{" "}
//                 of <span className="font-medium">{totalPages}</span>
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === 1
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === totalPages
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, updateProductStock } from "../../api/products";
import { FaEdit, FaPlus, FaTrash, FaSearch, FaSort } from "react-icons/fa";
import { debounce } from "lodash";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [updateMode, setUpdateMode] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch all categories only once when component mounts
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getProducts("", 1, "", "newest");
        if (response.success) {
          const uniqueCategories = [
            ...new Set(response.data.items.map((product) => product.category)),
          ];
          setAllCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchAllCategories();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Effect for fetching products based on filters
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, sortBy, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(
        searchQuery,
        currentPage,
        categoryFilter,
        sortBy
      );

      if (response.success) {
        setProducts(response.data.items);
        setTotalPages(response.data.pages);

        // Only update categories if we're not filtering by category
        if (!categoryFilter) {
          const uniqueCategories = [
            ...new Set(response.data.items.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          // Use all categories when filtering
          setCategories(allCategories);
        }
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      const response = await updateProductStock(productId, newStock);

      if (response.success) {
        setProducts(
          products.map((product) =>
            product._id === productId
              ? { ...product, countInStock: newStock }
              : product
          )
        );
        setUpdateMode(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to update stock");
      console.error(err);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(search);
    setCurrentPage(1);
  };

  // Calculate average rating from ratings array
  const calculateAverageRating = (ratings) => {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      return 0;
    }

    const sum = ratings.reduce((total, ratingObj) => {
      return total + (ratingObj.rating || 0);
    }, 0);

    return sum / ratings.length;
  };

  // Get number of reviews
  const getReviewCount = (ratings) => {
    return Array.isArray(ratings) ? ratings.length : 0;
  };

  if (loading && currentPage === 1 && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Products
        </h1>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center w-full sm:w-auto justify-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col space-y-4">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-500 text-white rounded px-3 py-1 text-sm"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Rating
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 object-cover rounded"
                          src={
                            product.image ||
                            (product.images && product.images.length > 0
                              ? product.images[0]
                              : "/placeholder.jpg")
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          ID: {product._id.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    {updateMode === product._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          className="w-16 sm:w-20 border rounded px-2 py-1"
                          value={newStock}
                          onChange={(e) =>
                            setNewStock(parseInt(e.target.value) || 0)
                          }
                        />
                        <button
                          onClick={() => handleStockUpdate(product._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setUpdateMode(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span
                          className={`text-sm ${
                            (product.countInStock || product.inStock) > 10
                              ? "text-green-600"
                              : (product.countInStock || product.inStock) > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.countInStock || product.inStock || 0} in
                          stock
                        </span>
                        <button
                          onClick={() => {
                            setUpdateMode(product._id);
                            setNewStock(
                              product.countInStock || product.inStock || 0
                            );
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {calculateAverageRating(product.ratings).toFixed(1)}
                      </div>
                      <div className="ml-1 text-sm text-gray-500">
                        ({getReviewCount(product.ratings)})
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view product cards - shown on smaller screens */}
        <div className="sm:hidden">
          {products.map((product) => (
            <div key={product._id} className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    <img
                      className="h-12 w-12 object-cover rounded"
                      src={
                        product.image ||
                        (product.images && product.images.length > 0
                          ? product.images[0]
                          : "/placeholder.jpg")
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="text-blue-600 p-2"
                  >
                    <FaEdit size={16} />
                  </Link>
                  <button className="text-red-600 p-2">
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                <span
                  className={`${
                    (product.countInStock || product.inStock) > 10
                      ? "text-green-600"
                      : (product.countInStock || product.inStock) > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {product.countInStock || product.inStock || 0} in stock
                </span>
                <span className="text-gray-600">
                  Rating: {calculateAverageRating(product.ratings).toFixed(1)} (
                  {getReviewCount(product.ratings)})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex justify-center w-full sm:w-auto sm:justify-end space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 sm:hidden">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
