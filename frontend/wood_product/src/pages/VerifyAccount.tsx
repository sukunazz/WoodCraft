import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/users";
import Loading from "../components/ui/Loading";
import logo from "../assets/react.svg";


const VerifyAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>(
    "Verifying your email address..."
  );

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) {
          setStatus("error");
          setMessage("Invalid verification link.");
          return;
        }

        await verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");

        // Redirect to login after successful verification
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          "Email verification failed. The link may be expired or invalid."
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src={logo}
          alt="Store Logo"
        />

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center">
              <Loading />
              <p className="mt-4 text-gray-600">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                {message}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting you to the login page...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                {message}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
