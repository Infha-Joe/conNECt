const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover",
    secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-ink",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
