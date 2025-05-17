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
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password) {
//       setError("Please fill in all fields");
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fix: Add null check for useAuth
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

    // Check if login function exists
    if (!login) {
      setError("Authentication service is not available");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Login to Your Account
      </h2>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
