// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import Button from "../ui/Button";
// import Alert from "../ui/Alert";
// import { isValidEmail, isValidPassword } from "../../utils/validators";

// const RegisterForm: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     const { name, email, password, confirmPassword } = formData;

//     // Validate form fields
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     if (!isValidPassword(password)) {
//       setError(
//         "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);
//       await register(name, email, password);
//       navigate("/verify-account");
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Failed to register");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         Create an Account
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
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Full Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             autoComplete="name"
//             required
//             value={formData.name}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

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
//             value={formData.email}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             autoComplete="new-password"
//             required
//             value={formData.password}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Password must be at least 8 characters long and contain at least one
//             uppercase letter, one lowercase letter, and one number.
//           </p>
//         </div>

//         <div>
//           <label
//             htmlFor="confirmPassword"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Confirm Password
//           </label>
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type="password"
//             autoComplete="new-password"
//             required
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         <div className="flex items-center">
//           <input
//             id="terms"
//             name="terms"
//             type="checkbox"
//             required
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
//             I agree to the{" "}
//             <a href="#" className="text-indigo-600 hover:text-indigo-500">
//               Terms and Conditions
//             </a>{" "}
//             and{" "}
//             <a href="#" className="text-indigo-600 hover:text-indigo-500">
//               Privacy Policy
//             </a>
//           </label>
//         </div>

//         <div>
//           <Button type="submit" variant="primary" fullWidth disabled={loading}>
//             {loading ? "Creating account..." : "Create Account"}
//           </Button>
//         </div>
//       </form>

//       <div className="mt-6">
//         <p className="text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import { registerUser } from "../../api/users";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, email, phone, address, password, confirmPassword } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(formData);
      if (response.success) {
        navigate("/verify-account");
      } else {
        setError(response.error || "Failed to register");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create an Account
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

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
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, and one number.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </label>
        </div>

        <div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
