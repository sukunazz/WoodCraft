import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../api/users";
import Loading from "../components/ui/Loading";
import Alert from "../components/ui/Alert";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();

        // Debug log to see the response structure
        console.log("Profile API response:", response);

        if (response.success && response.data) {
          // Make sure isVerified is properly set from the response
          const profileData = {
            ...response.data,
            // Ensure isVerified is explicitly set as a boolean
            isVerified: Boolean(response.data.isVerified),
          };

          console.log("Processed profile data:", profileData);
          setProfile(profileData);
          setFormData(profileData);
        } else {
          setError(
            response.error || "Failed to load profile. Please try again."
          );
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await updateUserProfile(formData);

      if (response.success && response.data) {
        // Ensure isVerified is properly preserved
        const updatedProfile = {
          ...response.data,
          isVerified: response.data.isVerified === true,
        };
        setProfile(updatedProfile);
        setSuccess("Profile updated successfully!");
        setEditing(false);
      } else {
        setError(
          response.error || "Failed to update profile. Please try again."
        );
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Failed to change password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordForm(false);
      }, 2000);
    } catch (err) {
      setPasswordError("Network error. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Please Login
            </h2>
            <p className="text-gray-600 mb-8">
              You need to be logged in to view your profile.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    if (editing) {
      return (
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 shadow-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile || {});
                  setError(null);
                  setSuccess(null);
                }}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0) || "U"}
            </div>
            <h3 className="text-xl font-bold">{profile?.name || "User"}</h3>
            <p className="text-gray-500">{profile?.email}</p>

            {/* Debug information - remove in production */}
            {/* <div className="text-xs text-gray-400 mt-1">
              isVerified value: {profile?.isVerified?.toString()}
            </div> */}

            {/* Use double equality (==) to handle both "true" string and true boolean */}
            {profile?.isVerified == true ? (
              <span className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Verified Account
              </span>
            ) : (
              <span className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Not Verified
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Shipping Information
              </h4>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium">
                  {profile?.address || "No address provided"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Account Details
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "security") {
      return (
        <div className="px-6 py-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Security Settings
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            {passwordError && (
              <div className="mb-6">
                <Alert type="error" message={passwordError} />
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-6">
                <Alert type="success" message={passwordSuccess} />
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-5 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6">
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="text-blue-100 mt-2">
                Manage your personal information and preferences
              </p>
            </div>

            {error && (
              <div className="px-6 pt-6">
                <Alert type="error" message={error} />
              </div>
            )}

            {success && (
              <div className="px-6 pt-6">
                <Alert type="success" message={success} />
              </div>
            )}

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setEditing(false);
                  }}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === "profile" && !editing
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => {
                    setActiveTab("security");
                    setEditing(false);
                  }}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === "security"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Security
                </button>
                <Link
                  to="/orders"
                  className="whitespace-nowrap py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Order History
                </Link>
              </nav>
            </div>

            {renderTab()}
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              ← Back to Home
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
