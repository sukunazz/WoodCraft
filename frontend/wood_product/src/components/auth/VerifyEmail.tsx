import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";
// Import the API functions with their correct names
import {
  verifyEmail as verifyEmailApi,
  resendVerification, // Import with its actual name
} from "../../api/users";

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Get functions from auth context, but also have direct API imports as fallback
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams<{ token?: string }>();

  // Extract email from location state and store it in state to ensure persistence
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Set email from location state when component mounts
    if (location.state?.email) {
      setUserEmail(location.state.email);
      // Store in localStorage as a backup
      localStorage.setItem("verificationEmail", location.state.email);
    } else {
      // Try to get from localStorage if not in location state
      const savedEmail = localStorage.getItem("verificationEmail");
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
    }
  }, [location.state]);

  // Auto verify with token in URL
  useEffect(() => {
    if (token) {
      handleVerifyWithToken(token);
    }
  }, [token]);

  // Cooldown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerifyWithToken = async (tokenValue: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use the auth context function if available, otherwise use direct API call
      const verifyFn = auth?.verifyEmail || verifyEmailApi;

      const result = await verifyFn(tokenValue);
      if (result.success) {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(result.error || "Verification failed.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      return setError("Please enter a verification code.");
    }

    setLoading(true);
    setError(null);

    try {
      // Use the auth context function if available, otherwise use direct API call
      const verifyFn = auth?.verifyEmail || verifyEmailApi;

      const result = await verifyFn(verificationCode);
      if (result.success) {
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(result.error || "Verification failed.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      return setError(
        "Email address not found. Please go back to the registration page."
      );
    }

    setError(null);
    setMessage(null);
    setResendLoading(true);

    try {
      // Use the auth context function if available, otherwise use direct API call
      // Use the correct function name - resendVerification
      const resendFn = auth?.resendVerificationCode || resendVerification;

      const result = await resendFn(userEmail);
      if (result.success) {
        setMessage("Verification code resent! Check your inbox.");
        setTimeLeft(60);
      } else {
        setError(result.error || "Failed to resend code.");
      }
    } catch (err: any) {
      console.error("Error resending verification:", err);
      setError(err.message || "Error resending code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <img
            src="/assets/images/logo.svg"
            alt="Logo"
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Email Verification
          </h2>
          {userEmail && (
            <p className="mt-2 text-sm text-gray-600">Verifying: {userEmail}</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded px-8 py-6">
          {loading && (
            <div className="text-center mb-4">
              <Loading />
              <p className="text-sm text-gray-600 mt-2">
                Processing verification...
              </p>
            </div>
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}

          {message && (
            <Alert
              type="success"
              message={message}
              onClose={() => setMessage(null)}
              className="mb-4"
            />
          )}

          {!token && !loading && !message && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your 6-digit code"
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          )}

          {!token && !message && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={resendLoading || timeLeft > 0 || !userEmail}
              >
                {resendLoading
                  ? "Sending..."
                  : timeLeft > 0
                  ? `Resend Code (${timeLeft}s)`
                  : "Resend Code"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
