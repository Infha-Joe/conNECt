const Skeleton = ({ className = "", type = "line" }) => {
  const types = {
    line: "h-4 w-full rounded",
    avatar: "h-10 w-10 rounded-full",
    card: "h-32 w-full rounded-xl",
  };

  return (
    <div className={`animate-pulse bg-slate-200 ${types[type]} ${className}`}></div>
  );
};

export default Skeleton;
