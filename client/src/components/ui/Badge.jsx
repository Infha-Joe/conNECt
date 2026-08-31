const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-500 border border-slate-200",
    primary: "bg-brand/10 text-brand font-medium",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    alumni: "bg-ink text-white font-medium",
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
