import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
}) => {
  const baseStyle =
    "font-medium rounded focus:outline-none transition duration-200 flex items-center justify-center";

  const variantStyles = {
    primary: "bg-amber-700 hover:bg-amber-800 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
    outline:
      "bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
