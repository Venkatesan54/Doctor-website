import React from "react";

/**
 * Reusable Skeleton loader for premium UI loading states.
 * Supports variants: 'rectangle', 'circle', 'text'
 */
const Skeleton = ({ className = "", variant = "rectangle" }) => {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-700";
  
  const variantClasses = {
    rectangle: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full",
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || ""} ${className}`} 
      aria-hidden="true"
    />
  );
};

export default Skeleton;
