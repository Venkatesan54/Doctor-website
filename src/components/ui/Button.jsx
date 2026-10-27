import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-ghost';
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
