import {
  LoginFormData,
  RegisterFormData,
  ApiResponse,
  AuthResponse,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Register a new user
export const registerUser = async (
  userData: RegisterFormData
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Registration failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Login user
export const loginUser = async (
  userData: LoginFormData
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Login failed" };
    }

    // Save token to localStorage
    localStorage.setItem("userToken", data.token);

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Get user profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return { success: false, error: "No authentication token found" };
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch profile",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Update user profile
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<ApiResponse<User>> => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return { success: false, error: "No authentication token found" };
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update profile",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Resend verification email
export const resendVerification = async (
  email: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to resend verification",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Verify email with token
export const verifyEmail = async (
  token: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/verify/${token}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to verify email",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<null>> => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return { success: false, error: "No authentication token found" };
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to change password",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};
