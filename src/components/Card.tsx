import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "parchment" | "glass" | "indigo";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = "parchment",
  hoverable = false,
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "rounded-xl border transition-all duration-300 overflow-hidden";
  
  const variants = {
    parchment: "bg-[#F8EAE5] border-navy/15 shadow-sm text-soft-espresso",
    glass: "glass-card hover:bg-white/50 text-soft-espresso",
    indigo: "bg-[#E9DFD2] border-lavender-blue/20 text-soft-espresso shadow-md"
  };

  const hoverClass = hoverable 
    ? "hover:-translate-y-1 hover:shadow-lg hover:border-gold-glow/50 cursor-pointer duration-300" 
    : "";

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
