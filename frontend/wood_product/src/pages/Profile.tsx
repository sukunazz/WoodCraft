import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  getLoginActivity,
  uploadAvatar,
} from "../api/users";
import Loading from "../components/ui/Loading";
import Alert from "../components/ui/Alert";
import {
  getPasswordStrength,
  isPasswordAllowed,
} from "../utils/passwordStrength";
import { ApiResponse } from "../types";

const getErrorMessage = <T,>(response: ApiResponse<T>, fallback: string) =>
  response.success ? fallback : response.error || fallback;


interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}


const Profile: React.FC = () => {
  const { user, updateAvatar } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activity, setActivity] = useState<
    Array<{ timestamp: string; ip?: string; userAgent?: string; status: string }>
  >([]);
  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const defaultAvatar =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='%23FEF3C7'/><circle cx='40' cy='32' r='18' fill='%23F59E0B'/><path d='M14 70c6-14 18-22 26-22s20 8 26 22' fill='%23F59E0B'/></svg>";


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();

        if (response.success && response.data) {
          const profileData = {
            ...response.data,
            isVerified: Boolean(response.data.isVerified),
          };

          setProfile(profileData);
          setFormData(profileData);
        } else {
          setError(
            getErrorMessage(response, "Failed to load profile. Please try again.")
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

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      setActivityLoading(true);
      setActivityError(null);

      try {
        const response = await getLoginActivity();
        if (response.success && response.data) {
          setActivity(response.data.activity);
        } else {
          setActivityError(
            getErrorMessage(
              response,
              "Failed to load recent login activity."
            )
          );
        }
      } catch (err) {
        setActivityError("Failed to load recent login activity.");
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivity();
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
          getErrorMessage(response, "Failed to update profile. Please try again.")
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

    if (!isPasswordAllowed(passwordData.newPassword)) {
      setPasswordError(
        passwordStrength.isCommon
          ? "Please choose a stronger password (this one is too common)."
          : "Password must be at least 8 characters."
      );
      return;
    }

    try {
      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (!response.success) {
        setPasswordError(response.error || "Failed to change password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError("Network error. Please try again.");
      console.error(err);
    }
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) {
      setResetError("No email address found for this account.");
      return;
    }

    setResetError(null);
    setResetMessage(null);
    setResetLoading(true);

    try {
      const response = await requestPasswordReset({ email: profile.email });
      if (!response.success) {
        setResetError(response.error || "Failed to send reset email");
        return;
      }

      setResetMessage(
        response.message ||
          "If an account exists, a reset link has been sent to your email."
      );
    } catch (err) {
      setResetError("Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarLoading(true);

    try {
      const response = await uploadAvatar(file);
      const avatarUrl = response.success ? response.data?.avatarUrl : undefined;
      if (!avatarUrl) {
        setAvatarError(
          getErrorMessage(response, "Failed to upload profile photo")
        );
        return;
      }

      updateAvatar(avatarUrl);
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev));
    } catch (err) {
      setAvatarError("Failed to upload profile photo. Please try again.");
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
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
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors"

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
        <div className="px-6 py-8">
          <div className="rounded-3xl border border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/60 p-6 shadow-sm profile-fade-up profile-fade-up-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-600/70">
                  Edit Profile
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                  Update your details
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-amber-200 bg-white text-amber-700 flex items-center justify-center text-lg font-semibold">
                  <img
                    src={profile?.avatarUrl || defaultAvatar}
                    alt={profile?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm hover:bg-amber-50">
                  <span>{avatarLoading ? "Uploading..." : "Change photo"}</span>
                  <input
                    id="avatarUpload"
                    name="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={avatarLoading}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email || ""}
                    disabled
                    className="w-full rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-gray-500 shadow-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Email address cannot be changed
                  </p>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              {avatarError && (
                <p className="mt-3 text-xs text-rose-500">{avatarError}</p>
              )}

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile || {});
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-5 py-2 rounded-full border border-amber-200 text-sm font-semibold text-gray-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full border border-transparent text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }


    if (activeTab === "profile") {
      return (
        <div className="p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/70 p-6 shadow-sm profile-fade-up profile-fade-up-1">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-600/70">
                    Profile Snapshot
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                    {profile?.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-700">
                    {profile?.isVerified ? "Verified" : "Unverified"}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                    {profile?.isAdmin ? "Admin" : "Customer"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Orders</p>
                  <p className="text-lg font-semibold text-gray-900">—</p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Total Spent</p>
                  <p className="text-lg font-semibold text-gray-900">—</p>
                  <p className="text-xs text-gray-500">Connect orders</p>
                </div>
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Last Order</p>
                  <p className="text-lg font-semibold text-gray-900">—</p>
                  <p className="text-xs text-gray-500">No data yet</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile?.address || "No address provided"}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100/60 bg-white/80 p-4">
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-800">
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-amber-100/60 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-2">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Quick Actions
                </p>
                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50"
                  >
                    Edit Profile Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    Go to Security Settings
                  </button>
                  <Link
                    to="/orders"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    View Order History
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100/60 bg-amber-50/60 p-6 profile-fade-up profile-fade-up-3">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-700/70">
                  Address Tip
                </p>
                <p className="mt-3 text-sm text-gray-700">
                  Keep your shipping address up to date to speed up checkout and deliveries.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }


    if (activeTab === "security") {
      return (
        <div className="px-6 py-6 space-y-10">
          <div className="rounded-3xl border border-amber-100/60 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Password & Login
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Update your password regularly to keep your account secure.
            </p>

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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Password strength</span>
                      <span className="font-semibold text-gray-700">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full ${
                            passwordStrength.score > index
                              ? passwordStrength.score >= 3
                                ? "bg-emerald-500"
                                : passwordStrength.score === 2
                                ? "bg-amber-400"
                                : "bg-rose-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.hints.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-500 space-y-1">
                        {passwordStrength.hints.slice(0, 3).map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full px-5 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-6 profile-fade-up profile-fade-up-2">
            <div className="flex flex-col gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                Forgot your password?
              </h4>
              <p className="text-sm text-gray-600">
                We'll email you a secure reset link. Use it within 1 hour to set a
                new password.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {resetError && <Alert type="error" message={resetError} />}
              {resetMessage && <Alert type="success" message={resetMessage} />}

              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="w-full px-5 py-3 border border-amber-700 rounded-lg text-sm font-medium text-amber-700 bg-white hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors shadow-sm"
              >
                {resetLoading ? "Sending reset email..." : "Send reset email"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm profile-fade-up profile-fade-up-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-gray-900">
                  Recent login activity
                </h4>
                <p className="text-sm text-gray-500">
                  Review recent sign-ins to spot unusual activity.
                </p>
              </div>
              <span className="text-xs text-gray-400">Last 15 events</span>
            </div>

            <div className="mt-6 space-y-3">
              {activityError && <Alert type="error" message={activityError} />}
              {activityLoading && (
                <p className="text-sm text-gray-500">Loading activity...</p>
              )}
              {!activityLoading && activity.length === 0 && !activityError && (
                <p className="text-sm text-gray-500">No login activity yet.</p>
              )}

              {!activityLoading && activity.length > 0 && (
                <div className="divide-y divide-gray-100">
                  {activity.map((entry, index) => {
                    const eventDate = new Date(entry.timestamp);
                    const statusLabel =
                      entry.status === "success" ? "Successful" : "Failed";
                    const statusClass =
                      entry.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700";
                    const agent = entry.userAgent || "Unknown device";
                    return (
                      <div
                        key={`${entry.timestamp}-${index}`}
                        className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {agent}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.ip || "Unknown IP"} • {eventDate.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }


    return null;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_15%_10%,rgba(253,230,138,0.35),transparent),radial-gradient(50%_50%_at_85%_0%,rgba(251,191,36,0.2),transparent),linear-gradient(180deg,rgba(255,251,235,0.92),rgba(255,255,255,0.98))] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="overflow-hidden rounded-[32px] border border-amber-100/70 bg-white/90 shadow-[0_30px_80px_-60px_rgba(120,53,15,0.6)] backdrop-blur">
            <div className="relative px-6 py-10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,53,15,0.95),rgba(146,64,14,0.92),rgba(180,83,9,0.85))]" />
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(253,230,138,0.7),transparent_60%)]" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-amber-100/70">
                    Account Overview
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold text-white">My Account</h1>
                  <p className="mt-3 text-amber-100">
                    Manage your personal information, security, and recent activity.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-50/20 px-3 py-1 text-xs font-semibold text-amber-100">
                      {profile?.isVerified ? "Verified" : "Unverified"}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-50/20 px-3 py-1 text-xs font-semibold text-amber-100">
                      Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl border border-amber-100/60 bg-amber-50 text-amber-700 shadow-lg flex items-center justify-center text-2xl font-semibold">
                      <img
                        src={profile?.avatarUrl || defaultAvatar}
                        alt={profile?.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="avatar"
                      className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-amber-700 shadow-md ring-2 ring-amber-200/80"
                    >
                      <span className="text-[10px] font-semibold">Edit</span>
                      <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {profile?.name}
                    </p>
                    <p className="text-xs text-amber-100/80">
                      {profile?.email}
                    </p>
                    <p className="text-xs text-amber-100/80">
                      {avatarLoading ? "Uploading photo..." : "Profile photo"}
                    </p>
                    {avatarError && (
                      <p className="text-xs text-amber-100 mt-1">{avatarError}</p>
                    )}
                  </div>
                </div>
              </div>
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

            <div className="border-b border-amber-100/60 bg-white/90">
              <nav className="flex -mb-px overflow-x-auto px-4">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setEditing(false);
                  }}
                  className={`whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-sm tracking-wide ${
                    activeTab === "profile" && !editing
                      ? "border-amber-600 text-amber-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-amber-200"
                  }`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => {
                    setActiveTab("security");
                    setEditing(false);
                  }}
                  className={`whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-sm tracking-wide ${
                    activeTab === "security"
                      ? "border-amber-600 text-amber-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-amber-200"
                  }`}
                >
                  Security
                </button>
                <Link
                  to="/orders"
                  className="whitespace-nowrap py-4 px-4 border-b-2 border-transparent font-semibold text-sm tracking-wide text-gray-500 hover:text-gray-700 hover:border-amber-200"
                >
                  Order History
                </Link>
              </nav>
            </div>

            {renderTab()}
          </div>


          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              ← Back to Home
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center px-5 py-2 rounded-full border border-transparent shadow-sm text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors"
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
