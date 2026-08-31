const Card = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      {!noPadding ? <div className="p-5">{children}</div> : children}
    </div>
  );
};

export default Card;
