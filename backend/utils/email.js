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

import { Resend } from "resend";

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM || process.env.MAIL_FROM || process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!from) {
    throw new Error("RESEND_FROM, MAIL_FROM, or EMAIL_FROM is not configured");
  }

  return { apiKey, from };
};

const sendResendEmail = async ({ to, subject, html }) => {
  const { apiKey, from } = getResendConfig();
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const sendVerificationEmail = async (email, token, name) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationUrl = `${baseUrl}/verify-account/${token}`;

    return await sendResendEmail({
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
    });
  } catch (error) {
    console.error("Email sending failed:", error?.response?.data || error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    return await sendResendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Hello ${name},</p>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Password reset email failed:", error?.response?.data || error);
    throw new Error("Failed to send password reset email");
  }
};

