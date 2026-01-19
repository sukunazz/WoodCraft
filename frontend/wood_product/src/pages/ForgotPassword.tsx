import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/users";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import logo from "../assets/react.svg";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset({ email: email.trim() });
      if (response.success) {
        setMessage(
          response.message ||
            "If an account exists, a reset link has been sent to your email."
        );
      } else {
        setError(response.error || "Failed to request password reset");
      }
    } catch (err) {
      setError("Failed to request password reset");
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
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and we will send you a reset link.
            </p>
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
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
