import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick,
  hover = false,
  padding = 'normal',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2 md:p-3',
    normal: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `bg-white rounded-xl transition-all duration-200 ${paddingClasses[padding]} ${shadowClasses[shadow]}`;
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
