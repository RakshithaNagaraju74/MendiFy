import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  let variantClasses = "";

  switch (variant) {
    case "outline":
      variantClasses = "bg-transparent border-2 border-[#0a1172] text-[#0a1172] hover:bg-[#e6eaff]";
      break;
    case "ghost":
      variantClasses = "bg-transparent text-gray-600 hover:text-[#0a1172]";
      break;
    default:
      variantClasses = "bg-[#0a1172] text-white hover:bg-[#1a2aad]";
  }

  return (
    <button
      className={`px-6 py-3 rounded-2xl font-medium shadow-lg transition duration-300 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
