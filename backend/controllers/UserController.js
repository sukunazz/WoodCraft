// // controllers/userController.js
// import User from "../models/User.js";
// import generateToken from "../utils/generateToken.js";
// import crypto from "crypto"; // Add this import for the hash function
// import { sendVerificationEmail } from "../utils/email.js"; // Import the email service

// // Register a new user
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, address, phone } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       address,
//       phone,
//       isVerified: false,
//     });

//     if (user) {
//       const verificationToken = user.generateVerificationToken(); // ✅

//       await user.save();

//       await sendVerificationEmail(email, verificationToken, name);

//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         message:
//           "Registration successful. Please check your email to verify your account.",
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message:
//           "Invalid or expired verification token. Please request a new one.",
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpires = undefined;

//     await user.save();

//     res.json({ message: "Email verified successfully. You can now login." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Resend Verification Email
// export const resendVerification = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Email already verified" });
//     }

//     const verificationToken = user.generateVerificationToken();
//     await user.save();

//     await sendVerificationEmail(email, verificationToken, user.name);

//     res.json({
//       message: "Verification email resent. Please check your inbox.",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login User
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     if (!user.isVerified) {
//       return res.status(401).json({
//         message: "Please verify your email before logging in",
//         needsVerification: true,
//       });
//     }

//     const isPasswordMatch = await user.matchPassword(password);

//     if (isPasswordMatch) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         address: user.address,
//         phone: user.phone,
//         isAdmin: user.isAdmin,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get user profile
// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         address: user.address,
//         phone: user.phone,
//         isAdmin: user.isAdmin,
//         isVerified: user.isVerified,
//         updatedAt: user.updatedAt,
//         createdAt: user.createdAt,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update user profile
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.address = req.body.address || user.address;
//       user.phone = req.body.phone || user.phone;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         address: updatedUser.address,
//         phone: updatedUser.phone,
//         isAdmin: updatedUser.isAdmin,
//         token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Add this to controllers/UserController.js

// // Change user password
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     // Find the user (req.user comes from the protect middleware)
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify current password
//     const isPasswordMatch = await user.matchPassword(currentPassword);

//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: "Current password is incorrect" });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// controllers/userController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, fileName) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "wood-products",
        resource_type: "image",
        public_id: fileName ? fileName.split(".")[0] : undefined,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });

const accessTokenTtl = process.env.ACCESS_TOKEN_TTL || "15m";
const refreshTokenTtl = process.env.REFRESH_TOKEN_TTL || "7d";

const isProduction = process.env.NODE_ENV === "production";
const cookieSameSite = isProduction
  ? process.env.COOKIE_SAMESITE || "none"
  : "lax";
const cookieSecure = isProduction && cookieSameSite === "none";

const cookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: cookieSameSite,
  path: "/",
};

const toCookieMs = (ttl) => {
  const value = Number.parseInt(ttl, 10);
  if (!Number.isNaN(value)) {
    return ttl.includes("d") ? value * 24 * 60 * 60 * 1000 : value * 60 * 1000;
  }
  if (ttl.endsWith("d")) {
    return Number.parseInt(ttl, 10) * 24 * 60 * 60 * 1000;
  }
  if (ttl.endsWith("h")) {
    return Number.parseInt(ttl, 10) * 60 * 60 * 1000;
  }
  if (ttl.endsWith("m")) {
    return Number.parseInt(ttl, 10) * 60 * 1000;
  }
  return 15 * 60 * 1000;
};

const setAuthCookies = (res, userId) => {
  const accessToken = generateToken(userId, accessTokenTtl);
  const refreshToken = generateToken(userId, refreshTokenTtl);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: toCookieMs(accessTokenTtl),
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: toCookieMs(refreshTokenTtl),
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

const getRequestIp = (req) =>
  req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  "unknown";

const recordLoginActivity = async (user, req, status = "success") => {
  if (!user) return;
  const entry = {
    timestamp: new Date(),
    ip: getRequestIp(req),
    userAgent: req.headers["user-agent"],
    status,
  };

  user.loginActivity = [entry, ...(user.loginActivity || [])].slice(0, 15);
  await user.save();
};

const getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  address: user.address,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
  updatedAt: user.updatedAt,
  createdAt: user.createdAt,
});

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      phone,
      isVerified: false,
    });

    if (user) {
      const verificationToken = user.generateVerificationToken();

      await user.save();

      await sendVerificationEmail(email, verificationToken, name);

      res.status(201).json({
        ...getSafeUser(user),
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new one.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationToken = user.generateVerificationToken();
    await user.save();

    await sendVerificationEmail(email, verificationToken, user.name);

    res.json({
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (isPasswordMatch) {
      setAuthCookies(res, user._id);
      await recordLoginActivity(user, req, "success");
      res.json({
        ...getSafeUser(user),
      });
    } else {
      await recordLoginActivity(user, req, "failed");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const verified = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "User not found" });
    }

    setAuthCookies(res, user._id);
    res.json({ ...getSafeUser(user) });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({ message: "Refresh token invalid" });
  }
};

export const logoutUser = (req, res) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out" });
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(getSafeUser(user));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuthStatus = async (req, res) => {
  try {
    res.json({ authenticated: true, user: getSafeUser(req.user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLoginActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("loginActivity");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      activity: (user.loginActivity || []).map((entry) => ({
        timestamp: entry.timestamp,
        ip: entry.ip,
        userAgent: entry.userAgent,
        status: entry.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar image is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatarUrl = result.secure_url;
    await user.save();

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: error.message || "Avatar upload failed" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json(getSafeUser(updatedUser));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // req.user is set by authentication middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordMatch = await user.matchPassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    }

    if (!user.isVerified) {
      return res.status(200).json({
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    await sendPasswordResetEmail(email, resetToken, user.name);

    res.json({
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

