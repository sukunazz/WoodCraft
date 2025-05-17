import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import Loading from "../components/ui/Loading";
import { Product } from "../types";
import { Filter, Search } from "lucide-react";
import { getProducts } from "../api/products";
import { useCart } from "../hooks/useCart";

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [inputSearchTerm, setInputSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Get values from URL params or use defaults
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000", 10);
  const priceRange = { min: minPrice, max: maxPrice };
  const [totalPages, setTotalPages] = useState(1);

  // Using the cart hook
  const { addToCart, loading: cartLoading } = useCart();

  // Available categories
  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Toys",
    "Beauty",
    "Sports",
  ];

  // Fetch products when URL parameters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Update search params and trigger fetch
  const updateFilters = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams);

    // Process each update
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset to page 1 if anything changes except page parameter
    if (!("page" in updates) && Object.keys(updates).length > 0) {
      newParams.set("page", "1");
    }

    setSearchParams(newParams);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      // Convert sort values to match backend expectations
      let backendSortBy = "";
      switch (sortBy) {
        case "price-asc":
          backendSortBy = "priceAsc";
          break;
        case "price-desc":
          backendSortBy = "priceDesc";
          break;
        case "name-asc":
          backendSortBy = "nameAsc";
          break;
        case "name-desc":
          backendSortBy = "nameDesc";
          break;
        case "rating":
          backendSortBy = "popular";
          break;
        case "newest":
        default:
          backendSortBy = "newest";
          break;
      }

      // Use the imported getProducts function
      const response = await getProducts(
        searchTerm,
        currentPage,
        category,
        backendSortBy
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch products");
      }

      const allProducts = response.data.items;

      // Apply price filter locally
      const productsWithinPriceRange = allProducts.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );

      setProducts(allProducts);
      setFilteredProducts(productsWithinPriceRange);
      setTotalPages(response.data.pages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load products. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1); // Add quantity 1 of the product
  };

  const handleResetFilters = () => {
    setInputSearchTerm(""); // Reset input field
    setSearchParams({}); // Clear all URL params
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: inputSearchTerm });
  };

  const handleRetry = () => {
    fetchProducts();
  };

  const handleCategoryChange = (cat: string) => {
    updateFilters({
      category: cat === "All Categories" ? null : cat,
    });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value === "newest" ? null : value });
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    updateFilters({
      [type === "min" ? "minPrice" : "maxPrice"]:
        type === "min"
          ? value === 0
            ? null
            : value
          : value === 1000
          ? null
          : value,
    });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page: page === 1 ? null : page });
  };

  // Render loading state or error state for product grid only
  const renderProductContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No products match your filters</p>
          <button
            onClick={handleResetFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            loading={cartLoading}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">Shop Our Products</h1>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 p-3 rounded-md"
        >
          <Filter size={18} />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div
          className={`md:w-64 ${
            showMobileFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-medium text-lg mb-4">Search</h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={inputSearchTerm}
                onChange={(e) => setInputSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="h-4 w-4 text-gray-500" />
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center">
                  <input
                    type="radio"
                    id={cat}
                    name="category"
                    checked={
                      cat === "All Categories"
                        ? category === ""
                        : category === cat
                    }
                    onChange={() => handleCategoryChange(cat)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={cat} className="ml-2 text-gray-700">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-medium text-lg mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange.min}
                onChange={(e) =>
                  handlePriceChange("min", Number(e.target.value))
                }
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange.max}
                onChange={(e) =>
                  handlePriceChange("max", Number(e.target.value))
                }
                className="w-full"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  min={priceRange.min}
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) =>
                    handlePriceChange("max", Number(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <button
              onClick={handleResetFilters}
              className="w-full bg-gray-100 text-gray-800 p-2 rounded-md hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {!isLoading && `Showing ${filteredProducts.length} products`}
            </p>
            <div>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products, Loading State, or Error Message */}
          {renderProductContent()}

          {/* Pagination - Only show when not loading and we have multiple pages */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex flex-wrap space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Previous
                </button>

                {/* Show page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "../components/ui/ProductCard";
// import Loading from "../components/ui/Loading";
// import { Product } from "../types";
// import { Filter, Search } from "lucide-react";
// import { getProducts } from "../api/products";
// import { useCart } from "../hooks/useCart";

// const Shop: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Get values from URL params or use defaults
//   const [currentPage, setCurrentPage] = useState(
//     parseInt(searchParams.get("page") || "1", 10)
//   );
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState(
//     searchParams.get("search") || ""
//   );
//   const [category, setCategory] = useState(searchParams.get("category") || "");
//   const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
//   const [priceRange, setPriceRange] = useState({
//     min: parseInt(searchParams.get("minPrice") || "0", 10),
//     max: parseInt(searchParams.get("maxPrice") || "1000", 10),
//   });

//   // Using the cart hook
//   const { addToCart, loading: cartLoading } = useCart();

//   // Available categories
//   const categories = [
//     "All Categories",
//     "Electronics",
//     "Clothing",
//     "Home",
//     "Books",
//     "Toys",
//     "Beauty",
//     "Sports",
//   ];

//   // Sync state from URL params whenever they change
//   useEffect(() => {
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const search = searchParams.get("search") || "";
//     const cat = searchParams.get("category") || "";
//     const sort = searchParams.get("sort") || "newest";
//     const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
//     const maxPrice = parseInt(searchParams.get("maxPrice") || "1000", 10);

//     // Only update state if values are different to avoid infinite loops
//     if (currentPage !== page) setCurrentPage(page);
//     if (searchTerm !== search) setSearchTerm(search);
//     if (category !== cat) setCategory(cat);
//     if (sortBy !== sort) setSortBy(sort);
//     if (priceRange.min !== minPrice || priceRange.max !== maxPrice) {
//       setPriceRange({ min: minPrice, max: maxPrice });
//     }
//   }, [searchParams]);

//   // Fetch products when filter parameters change
//   useEffect(() => {
//     fetchProducts();
//   }, [searchParams]);

//   // Update URL when filters change
//   const updateSearchParams = () => {
//     const params = new URLSearchParams();

//     if (searchTerm) params.set("search", searchTerm);
//     if (category && category !== "All Categories")
//       params.set("category", category);
//     if (sortBy !== "newest") params.set("sort", sortBy);
//     if (priceRange.min > 0) params.set("minPrice", priceRange.min.toString());
//     if (priceRange.max < 1000)
//       params.set("maxPrice", priceRange.max.toString());
//     if (currentPage > 1) params.set("page", currentPage.toString());

//     setSearchParams(params);
//   };

//   // Handle filter changes
//   const handleFilterChange = (
//     type: "search" | "category" | "sort" | "priceMin" | "priceMax" | "page",
//     value: string | number
//   ) => {
//     switch (type) {
//       case "search":
//         setSearchTerm(value as string);
//         setCurrentPage(1); // Reset to first page
//         break;
//       case "category":
//         setCategory(
//           (value as string) === "All Categories" ? "" : (value as string)
//         );
//         setCurrentPage(1); // Reset to first page
//         break;
//       case "sort":
//         setSortBy(value as string);
//         break;
//       case "priceMin":
//         setPriceRange({ ...priceRange, min: value as number });
//         break;
//       case "priceMax":
//         setPriceRange({ ...priceRange, max: value as number });
//         break;
//       case "page":
//         setCurrentPage(value as number);
//         break;
//     }

//     // Use setTimeout to ensure state is updated before updating URL
//     setTimeout(() => updateSearchParams(), 0);
//   };

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);

//       // Convert sort values to match backend expectations
//       let backendSortBy = "";
//       switch (sortBy) {
//         case "price-asc":
//           backendSortBy = "priceAsc";
//           break;
//         case "price-desc":
//           backendSortBy = "priceDesc";
//           break;
//         case "name-asc":
//           backendSortBy = "nameAsc";
//           break;
//         case "name-desc":
//           backendSortBy = "nameDesc";
//           break;
//         case "rating":
//           backendSortBy = "popular";
//           break;
//         case "newest":
//         default:
//           backendSortBy = "newest";
//           break;
//       }

//       // Use the imported getProducts function
//       const response = await getProducts(
//         searchTerm,
//         currentPage,
//         category === "All Categories" ? "" : category,
//         backendSortBy
//       );

//       if (!response.success) {
//         throw new Error(response.error || "Failed to fetch products");
//       }

//       const allProducts = response.data.items;

//       // Apply price filter locally
//       const productsWithinPriceRange = allProducts.filter(
//         (product) =>
//           product.price >= priceRange.min && product.price <= priceRange.max
//       );

//       setProducts(allProducts);
//       setFilteredProducts(productsWithinPriceRange);
//       setTotalPages(response.data.pages);
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Failed to load products. Please try again later.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle adding product to cart
//   const handleAddToCart = (product: Product) => {
//     addToCart(product, 1); // Add quantity 1 of the product
//   };

//   const handleResetFilters = () => {
//     setSearchTerm("");
//     setCategory("");
//     setSortBy("newest");
//     setPriceRange({ min: 0, max: 1000 });
//     setCurrentPage(1);
//     setSearchParams({});
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleFilterChange("search", searchTerm);
//   };

//   const handleRetry = () => {
//     fetchProducts();
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button
//           onClick={handleRetry}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Shop Our Products</h1>

//       {/* Mobile Filter Toggle */}
//       <div className="md:hidden mb-4">
//         <button
//           onClick={() => setShowMobileFilters(!showMobileFilters)}
//           className="w-full flex items-center justify-center gap-2 bg-gray-100 p-3 rounded-md"
//         >
//           <Filter size={18} />
//           {showMobileFilters ? "Hide Filters" : "Show Filters"}
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Filters Sidebar */}
//         <div
//           className={`md:w-64 ${
//             showMobileFilters ? "block" : "hidden md:block"
//           }`}
//         >
//           <div className="bg-white p-4 rounded-lg shadow mb-4">
//             <h3 className="font-medium text-lg mb-4">Search</h3>
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border border-gray-300 rounded-md"
//               />
//               <button type="submit" className="absolute left-3 top-2.5">
//                 <Search className="h-4 w-4 text-gray-500" />
//               </button>
//             </form>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow mb-4">
//             <h3 className="font-medium text-lg mb-4">Categories</h3>
//             <div className="space-y-2">
//               {categories.map((cat) => (
//                 <div key={cat} className="flex items-center">
//                   <input
//                     type="radio"
//                     id={cat}
//                     name="category"
//                     checked={category === (cat === "All Categories" ? "" : cat)}
//                     onChange={() => handleFilterChange("category", cat)}
//                     className="h-4 w-4 text-blue-600"
//                   />
//                   <label htmlFor={cat} className="ml-2 text-gray-700">
//                     {cat}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow mb-4">
//             <h3 className="font-medium text-lg mb-4">Price Range</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between">
//                 <span>${priceRange.min}</span>
//                 <span>${priceRange.max}</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="1000"
//                 step="10"
//                 value={priceRange.min}
//                 onChange={(e) =>
//                   handleFilterChange("priceMin", Number(e.target.value))
//                 }
//                 className="w-full"
//               />
//               <input
//                 type="range"
//                 min="0"
//                 max="1000"
//                 step="10"
//                 value={priceRange.max}
//                 onChange={(e) =>
//                   handleFilterChange("priceMax", Number(e.target.value))
//                 }
//                 className="w-full"
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   min="0"
//                   max={priceRange.max}
//                   value={priceRange.min}
//                   onChange={(e) =>
//                     handleFilterChange("priceMin", Number(e.target.value))
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//                 <input
//                   type="number"
//                   min={priceRange.min}
//                   max="1000"
//                   value={priceRange.max}
//                   onChange={(e) =>
//                     handleFilterChange("priceMax", Number(e.target.value))
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow">
//             <button
//               onClick={handleResetFilters}
//               className="w-full bg-gray-100 text-gray-800 p-2 rounded-md hover:bg-gray-200"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className="flex-1">
//           {/* Sort Controls */}
//           <div className="flex justify-between items-center mb-6">
//             <p className="text-gray-600">
//               Showing {filteredProducts.length} products
//             </p>
//             <div>
//               <select
//                 value={sortBy}
//                 onChange={(e) => handleFilterChange("sort", e.target.value)}
//                 className="p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="price-asc">Price: Low to High</option>
//                 <option value="price-desc">Price: High to Low</option>
//                 <option value="name-asc">Name: A-Z</option>
//                 <option value="name-desc">Name: Z-A</option>
//                 <option value="rating">Top Rated</option>
//               </select>
//             </div>
//           </div>

//           {filteredProducts.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                   onAddToCart={() => handleAddToCart(product)}
//                   loading={cartLoading}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-white rounded-lg shadow">
//               <p className="text-gray-500 mb-4">
//                 No products match your filters
//               </p>
//               <button
//                 onClick={handleResetFilters}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() =>
//                     handleFilterChange("page", Math.max(1, currentPage - 1))
//                   }
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-md ${
//                     currentPage === 1
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 {/* Show page numbers */}
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       onClick={() => handleFilterChange("page", page)}
//                       className={`px-4 py-2 rounded-md ${
//                         currentPage === page
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}

//                 <button
//                   onClick={() =>
//                     handleFilterChange(
//                       "page",
//                       Math.min(totalPages, currentPage + 1)
//                     )
//                   }
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded-md ${
//                     currentPage === totalPages
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Shop;
