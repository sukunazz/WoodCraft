import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { clearTokenFromLocalStorage } from "../../utils/localStorage";


interface HeaderProps {
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNavigation = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fix: Add null check for useAuth
  const auth = useAuth();
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated || false;
  const logout = auth?.logout || (async () => {});

  // Fix: Add null check for useCart
  const cart = useCart();
  const totalItems = cart?.totalItems || 0;

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Fix: Use proper URL encoding for the search query
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      navigate(`/shop?search=${encodedQuery}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearTokenFromLocalStorage();

    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);

    window.location.href = "/login";
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-700">WoodCraft</span>
          </Link>

          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-amber-700 font-medium"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-amber-700 font-medium"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-amber-700 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-amber-700 font-medium"
              >
                Contact
              </Link>
            </nav>
          )}

          {/* Desktop Right Section */}
          {showNavigation && (
            <div className="hidden md:flex items-center space-x-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-40 focus:w-56 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Cart - Only show when authenticated */}
            {isAuthenticated ? (
              <Link to="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 hover:text-amber-700"
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
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            ) : null}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-700"
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden border border-amber-200 bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user?.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-amber-700 font-medium"
              >
                Sign In
              </Link>
            )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {showNavigation && (
            <div className="flex items-center md:hidden">
            {/* Cart - Only show when authenticated */}
            {isAuthenticated && (
              <Link to="/cart" className="mr-4 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
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
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showNavigation && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
            >
              Contact
            </Link>

            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
                >
                  My Orders
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block py-2 text-gray-700 hover:text-amber-700 font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useCart } from "../../hooks/useCart";
// import {
//   clearTokenFromLocalStorage,
//   clearCartFromLocalStorage,
// } from "../../utils/localStorage";
// import * as api from "../../api/cart";

// const Header: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fix: Add null check for useAuth
//   const auth = useAuth();
//   const user = auth?.user;
//   const isAuthenticated = auth?.isAuthenticated || false;
//   const logout = auth?.logout || (() => {});

//   // Fix: Add null check for useCart
//   const cart = useCart();
//   const totalItems = cart?.totalItems || 0;
//   const clearCart = cart?.clearCart || (() => {});

//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/shop?search=${searchQuery}`);
//       setSearchQuery("");
//       setIsMobileMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     // Clear all carts and tokens
//     clearCart(); // Clear cart from context state
//     clearCartFromLocalStorage(); // Clear cart from localStorage
//     api.clearCart(); // Clear any server-side cart if applicable
//     logout(); // Logout from auth context
//     clearTokenFromLocalStorage(); // Clear tokens from localStorage

//     setIsProfileMenuOpen(false);
//     setIsMobileMenuOpen(false);

//     // Force a page reload to ensure all state is reset properly
//     window.location.href = "/login";
//   };

//   return (
//     <header
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-white shadow-md py-2"
//           : "bg-white/90 backdrop-blur-sm py-4"
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <span className="text-2xl font-bold text-amber-700">WoodCraft</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <Link
//               to="/"
//               className="text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Home
//             </Link>
//             <Link
//               to="/shop"
//               className="text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Shop
//             </Link>
//             <Link
//               to="/about"
//               className="text-gray-700 hover:text-amber-700 font-medium"
//             >
//               About
//             </Link>
//             <Link
//               to="/contact"
//               className="text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Contact
//             </Link>
//           </nav>

//           {/* Desktop Right Section */}
//           <div className="hidden md:flex items-center space-x-6">
//             {/* Search Form */}
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-40 focus:w-56 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//             </form>

//             {/* Cart - Only show when authenticated */}
//             {isAuthenticated ? (
//               <Link to="/cart" className="relative">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-gray-700 hover:text-amber-700"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                   />
//                 </svg>
//                 {totalItems > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>
//             ) : null}

//             {/* User Menu */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                   className="flex items-center space-x-1 text-gray-700 hover:text-amber-700"
//                 >
//                   <span className="font-medium">
//                     {user?.name?.split(" ")[0] || "User"}
//                   </span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//                 {isProfileMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
//                     <Link
//                       to="/profile"
//                       onClick={() => setIsProfileMenuOpen(false)}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Profile
//                     </Link>
//                     <Link
//                       to="/orders"
//                       onClick={() => setIsProfileMenuOpen(false)}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       My Orders
//                     </Link>
//                     {user?.isAdmin && (
//                       <Link
//                         to="/admin/dashboard"
//                         onClick={() => setIsProfileMenuOpen(false)}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Admin Dashboard
//                       </Link>
//                     )}
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-gray-700 hover:text-amber-700 font-medium"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex items-center md:hidden">
//             {/* Cart - Only show when authenticated */}
//             {isAuthenticated && (
//               <Link to="/cart" className="mr-4 relative">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-gray-700"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                   />
//                 </svg>
//                 {totalItems > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>
//             )}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-gray-700 focus:outline-none"
//             >
//               {isMobileMenuOpen ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-t mt-2 py-4">
//           <div className="container mx-auto px-4 space-y-3">
//             <form onSubmit={handleSearch} className="relative mb-4">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-amber-700"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//             </form>

//             <Link
//               to="/"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Home
//             </Link>
//             <Link
//               to="/shop"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Shop
//             </Link>
//             <Link
//               to="/about"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//             >
//               About
//             </Link>
//             <Link
//               to="/contact"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//             >
//               Contact
//             </Link>

//             {isAuthenticated && (
//               <div className="pt-4 border-t border-gray-200">
//                 <Link
//                   to="/profile"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//                 >
//                   Profile
//                 </Link>
//                 <Link
//                   to="/orders"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//                 >
//                   My Orders
//                 </Link>
//                 {user?.isAdmin && (
//                   <Link
//                     to="/admin/dashboard"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//                   >
//                     Admin Dashboard
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="block py-2 text-gray-700 hover:text-amber-700 font-medium w-full text-left"
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             )}

//             {!isAuthenticated && (
//               <div className="pt-4 border-t border-gray-200">
//                 <Link
//                   to="/login"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
//                 >
//                   Sign In
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
