import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  disabled = false, 
  loading = false,
  type = 'button',
  icon = null,
  fullWidth = false,
  roundedFull = false
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
    xl: 'px-8 py-4 text-xl rounded-xl'
  };

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-md hover:shadow-lg hover:scale-105',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-md hover:shadow-lg hover:scale-105',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md hover:shadow-lg hover:scale-105',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-md hover:shadow-lg hover:scale-105',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg hover:scale-105',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const roundedClass = roundedFull ? 'rounded-full' : '';

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${roundedClass} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
