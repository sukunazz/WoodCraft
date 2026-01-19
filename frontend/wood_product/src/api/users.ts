import {
  LoginFormData,
  RegisterFormData,
  ApiResponse,
  AuthResponse,
  User,
  LoginActivityEntry,
} from "../types";

export const uploadAvatar = async (
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_URL}/users/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to upload avatar",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetPayload = {
  token: string;
  password: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return { message: "Unexpected server response" };
};

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
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(userData),
    });

    const data = await parseResponse(response);

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
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Login failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

// Get user profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      credentials: "include",
    });

    const data = await parseResponse(response);

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

export const getAuthStatus = async (): Promise<
  ApiResponse<{ authenticated: boolean; user: User }>
> => {
  try {
    const response = await fetch(`${API_URL}/users/status`, {
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch auth status",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const getLoginActivity = async (): Promise<
  ApiResponse<{ activity: LoginActivityEntry[] }>
> => {
  try {
    const response = await fetch(`${API_URL}/users/activity`, {
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch login activity",
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
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await parseResponse(response);

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
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await parseResponse(response);

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

export const refreshSession = async (): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to refresh" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to logout" };
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

    const data = await parseResponse(response);

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
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await parseResponse(response);

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

export const requestPasswordReset = async (
  payload: PasswordResetRequest
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to request password reset",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const resetPassword = async (
  payload: PasswordResetPayload
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/reset-password/${payload.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: payload.password }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to reset password",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
};

