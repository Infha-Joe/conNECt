import React from 'react';

const Button = ({ children, variant = "primary", className = "", isLoading, disabled, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 disabled:bg-primary-light disabled:text-primary-dark disabled:opacity-100 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:-translate-y-0.5",
    secondary: "bg-surface text-primary-dark border border-border hover:border-primary-dark",
    accent: "bg-secondary text-white hover:opacity-90 shadow-sm",
    ghost: "bg-transparent text-ink-light hover:text-primary-dark hover:bg-background",
    danger: "bg-danger text-white shadow-sm hover:opacity-90",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading || disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
