import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-11/12 md:w-1/3 max-w-md',
    md: 'w-11/12 md:w-1/2 max-w-2xl',
    lg: 'w-11/12 md:w-2/3 max-w-4xl',
    xl: 'w-11/12 md:w-3/4 max-w-6xl',
    full: 'w-11/12 h-5/6'
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${sizeClasses[size]} ${className}`} onClick={e => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            {title && (
              <h2 className="text-2xl font-bold text-primary-600 font-cursive">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose} 
                icon={<X size={20} />}
                className="text-gray-500 hover:text-gray-800"
                roundedFull
              />
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
