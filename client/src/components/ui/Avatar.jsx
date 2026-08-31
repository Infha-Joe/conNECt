const Avatar = ({ name, size = "md", src, className = "" }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-xl",
    xl: "h-24 w-24 text-4xl border-4 border-white shadow-sm",
  };

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className={`shrink-0 flex items-center justify-center overflow-hidden rounded-full font-bold uppercase ${sizes[size]} ${src ? "" : "bg-ink text-white"} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};

export default Avatar;
