import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  color = "primary",
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-amber-700",
    white: "text-white",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 text-sm ${colorClasses[color]}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
