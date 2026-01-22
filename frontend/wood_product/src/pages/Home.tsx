// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import ProductCard from "../components/ui/ProductCard";
// import Loading from "../components/ui/Loading";
// import { Product } from "../types";
// import { getProducts } from "../api/products"; // Import the API function

// const Home: React.FC = () => {
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [newArrivals, setNewArrivals] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);

//         // Use the API service instead of direct fetch
//         const response = await getProducts();

//         if (!response.success) {
//           throw new Error(response.error || "Failed to fetch products");
//         }

//         const products = response.data.items;
//         console.log(products);
//         // Filter featured products
//         const featured = products
//           .filter((product: Product) => product.featured)
//           .slice(0, 4);
//         setFeaturedProducts(featured);

//         // Get newest products based on id (assuming higher id = newer)
//         const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
//         setNewArrivals(newest);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError("Failed to load products. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Hero Section */}
//       <div
//         className="bg-cover bg-center h-96 flex items-center"
//         style={{ backgroundImage: "url(/assets/images/hero-bg.jpg)" }}
//       >
//         <div className="container mx-auto px-4">
//           <div className="max-w-lg bg-white bg-opacity-90 p-8 rounded-lg">
//             <h1 className="text-4xl font-bold mb-4">Welcome to StyleShop</h1>
//             <p className="text-lg text-gray-700 mb-6">
//               Discover the latest trends and find your perfect style.
//             </p>
//             <Link
//               to="/shop"
//               className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
//             >
//               Shop Now
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Featured Products */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold">Featured Products</h2>
//           <Link to="/shop" className="text-blue-600 hover:text-blue-800">
//             View All
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {featuredProducts.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       </div>

//       {/* Categories Section */}

//       <div className="bg-gray-100 py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl font-bold mb-8 text-center">
//             Shop by Category
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {["Electronics", "Clothing", "Home", "Beauty"].map((category) => (
//               <Link
//                 key={category}
//                 to={`/shop?category=${category.toLowerCase()}`}
//                 className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 <div className="aspect-w-16 aspect-h-9">
//                   <img
//                     src={`/images/${category.toLowerCase()}.jpg`}
//                     alt={category}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-center">
//                   <h3 className="font-medium text-lg">{category}</h3>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* New Arrivals */}
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-bold mb-8">New Arrivals</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {newArrivals.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       </div>

//       {/* Newsletter Section */}
//       <div className="bg-blue-600 py-12 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
//           <p className="mb-6 max-w-md mx-auto">
//             Subscribe to our newsletter to get updates on our latest offers and
//             promotions.
//           </p>

//           <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-1 p-3 rounded-md text-gray-900"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-gray-100"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import Loading from "../components/ui/Loading";
import { Product } from "../types";
import { getProducts } from "../api/products";

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts();

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch products");
        }

        const products = response.data.items;
        // Filter featured products
        const featured = products
          .filter((product: Product) => product.featured)
          .slice(0, 4);
        setFeaturedProducts(featured);

        // Get newest products based on created date
        const newest = [...products]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 8);
        setNewArrivals(newest);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-gray-50">
        {/* Hero Section - With full screen background image */}
        <div
          className="relative bg-cover bg-center h-screen w-full"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            minHeight: "100vh",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10 h-full flex items-center">
            <div className="max-w-xl text-white">
              <h1 className="text-5xl font-bold mb-4">Welcome to WoodCraft</h1>
              <p className="text-xl mb-8">
                Discover the latest trends and find your perfect style.
              </p>
              <Link
                to="/shop"
                className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-blue-700 inline-block transition duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* The rest of your content (Featured Products, etc.) would go here */}
      </div>

      {/* Featured Products - Added proper spacing */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section - Better spacing and styling */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Electronics", "Clothing", "Home", "Beauty"].map((category) => (
              <Link
                key={category}
                to={`/shop?category=${category.toLowerCase()}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 h-48">
                  <img
                    src={`/images/${category.toLowerCase()}.jpg`}
                    alt={category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-lg text-gray-900">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals - Consistent spacing */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            New Arrivals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section - Updated to match aesthetic (removed blue background) */}
      <div className="bg-gray-100 py-16 mb-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Join Our Newsletter
            </h2>
            <p className="mb-6 text-gray-700">
              Subscribe to our newsletter to get updates on our latest offers
              and promotions.
            </p>

            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-medium px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
