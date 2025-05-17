// // utils/emailService.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// // Configure transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Send verification email
// export const sendVerificationEmail = async (email, token, name) => {
//   const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

//   const mailOptions = {
//     from: `"Wood Crafts" <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: "Email Verification - Wood Crafts",
//     html: `
//       <h1>Email Verification</h1>
//       <p>Hello ${name},</p>
//       <p>Thank you for registering with Wood Crafts. Please verify your email address by clicking the link below:</p>
//       <a href="${verificationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 5px;">Verify Email</a>
//       <p>This link will expire in 24 hours.</p>
//       <p>If you did not create this account, please ignore this email.</p>
//       <p>Best regards,<br>Wood Crafts Team</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// // Send password reset email
// export const sendPasswordResetEmail = async (email, token, name) => {
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

//   const mailOptions = {
//     from: `"Wood Crafts" <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: "Password Reset - Wood Crafts",
//     html: `
//       <h1>Password Reset</h1>
//       <p>Hello ${name},</p>
//       <p>You requested a password reset. Please click the link below to set a new password:</p>
//       <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 5px;">Reset Password</a>
//       <p>This link will expire in 1 hour.</p>
//       <p>If you did not request this reset, please ignore this email and your password will remain unchanged.</p>
//       <p>Best regards,<br>Wood Crafts Team</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// utils/email.js
// This is a suggested implementation since your original email.js was not provided

import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token, name) => {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Create verification URL
    const verificationUrl = `${baseUrl}/verify-account/${token}`;

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "youremail@example.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <div style="margin: 20px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          <p>Or you can use this verification code: <strong>${token}</strong></p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send verification email");
  }
};
