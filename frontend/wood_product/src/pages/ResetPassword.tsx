import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../api/users";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import {
  getPasswordStrength,
  isPasswordAllowed,
} from "../utils/passwordStrength";
import logo from "../assets/react.svg";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const strength = getPasswordStrength(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Reset token is missing");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordAllowed(password)) {
      setError(
        strength.isCommon
          ? "Please choose a stronger password (this one is too common)."
          : "Password must be at least 8 characters long"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ token, password });
      if (response.success) {
        setMessage(response.message || "Password reset successfully");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/60 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur">
          <div className="text-center">
            <img className="mx-auto h-12 w-12" src={logo} alt="Store Logo" />
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Set a new password
            </h2>
          </div>

          <div className="mt-8">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {message && (
            <Alert
              type="success"
              message={message}
              onClose={() => setMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Password strength</span>
                  <span className="font-semibold text-gray-700">
                    {strength.label}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full ${
                        strength.score > index
                          ? strength.score >= 3
                            ? "bg-emerald-500"
                            : strength.score === 2
                            ? "bg-amber-400"
                            : "bg-rose-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {strength.hints.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    {strength.hints.slice(0, 3).map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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

            <div>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Saving..." : "Reset password"}
              </Button>
            </div>
          </form>
        </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-amber-700 hover:text-amber-800"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
