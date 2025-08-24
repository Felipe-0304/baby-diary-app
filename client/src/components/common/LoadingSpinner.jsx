import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-r-transparent ${sizes[size]} ${colors[color]} ${className}`}>
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;
