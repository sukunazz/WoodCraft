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
import { sendVerificationEmail } from "../utils/email.js";

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
        _id: user._id,
        name: user.name,
        email: user.email,
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
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
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
