import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const login = auth?.login;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!login) {
      setError("Authentication service is not available");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! You're signed in.");
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">
          Sign in
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900">
          Login to your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Access your orders, saved items, and account settings.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-amber-700 hover:text-amber-800"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-2 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-amber-700 hover:text-amber-800"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import Button from "../ui/Button";
// import Alert from "../ui/Alert";

// const LoginForm: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Fix: Add null check for useAuth
//   const auth = useAuth();
//   const login = auth?.login;

//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     // Check if login function exists
//     if (!login) {
//       setError("Authentication service is not available");
//       return;
//     }

//     try {
//       setLoading(true);
//       await login(email, password);
//       navigate("/");
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Failed to login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         Login to Your Account
//       </h2>

//       {error && (
//         <Alert
//           type="error"
//           message={error}
//           onClose={() => setError(null)}
//           className="mb-4"
//         />
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email address
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             autoComplete="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         <div>
//           <div className="flex items-center justify-between">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <Link
//               to="/forgot-password"
//               className="text-sm text-indigo-600 hover:text-indigo-500"
//             >
//               Forgot password?
//             </Link>
//           </div>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             autoComplete="current-password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         <div className="flex items-center">
//           <input
//             id="remember-me"
//             name="remember-me"
//             type="checkbox"
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           <label
//             htmlFor="remember-me"
//             className="ml-2 block text-sm text-gray-900"
//           >
//             Remember me
//           </label>
//         </div>

//         <div>
//           <Button type="submit" variant="primary" fullWidth disabled={loading}>
//             {loading ? "Logging in..." : "Log in"}
//           </Button>
//         </div>
//       </form>

//       <div className="mt-6">
//         <p className="text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
