import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "magic" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium select-none shadow-sm cursor-pointer";
  
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/85 active:scale-[0.98] border border-lavender-blue/30 font-sans",
    secondary: "bg-[#E9DFD2] text-[#4A3428] hover:bg-[#E9DFD2]/80 active:scale-[0.98] border border-[#cbd5e1]/10 font-sans",
    magic: "bg-gradient-to-r from-[#4A3428] to-navy text-white border border-gold-glow/70 active:scale-[0.98] animate-pulse-gold font-medieval tracking-wide shadow-gold-glow/20",
    accent: "bg-[#AAB2FF] text-[#4A3428] hover:bg-[#AAB2FF]/90 active:scale-[0.98] border border-navy/20 font-sans",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base md:text-lg",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
