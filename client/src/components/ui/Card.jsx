import React from 'react';

const Card = ({ children, className = "", noPadding = false, hover = false }) => {
  return (
    <div 
      className={`bg-surface border border-border rounded-lg shadow-sm transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-hover hover:border-primary/30' : ''} ${className}`}
    >
      {!noPadding ? <div className="p-6">{children}</div> : children}
    </div>
  );
};

export default Card;
