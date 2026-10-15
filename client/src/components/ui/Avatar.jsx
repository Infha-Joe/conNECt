import { useMemo } from "react";
import api from "../../services/api";

const Avatar = ({ name, size = "md", src, className = "" }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-xl",
    xl: "h-24 w-24 text-4xl border-4 border-white shadow-sm",
  };

  const initial = name && typeof name === 'string' ? name.trim().charAt(0).toUpperCase() : "?";

  const resolvedSrc = useMemo(() => {
    if (!src) return null;
    if (src.startsWith('http')) return src;
    if (src.startsWith('/uploads')) {
      const serverUrl = api.defaults.baseURL.replace('/api', '');
      return `${serverUrl}${src}`;
    }
    return src;
  }, [src]);

  return (
    <div className={`shrink-0 flex items-center justify-center overflow-hidden rounded-full font-bold uppercase ${sizes[size]} ${resolvedSrc ? "" : "bg-ink text-white"} ${className}`}>
      {resolvedSrc ? (
        <img src={resolvedSrc} alt={name || "User avatar"} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};

export default Avatar;
