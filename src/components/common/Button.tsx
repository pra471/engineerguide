import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white hover:from-blue-800 hover:to-indigo-800 focus:ring-blue-700 shadow-lg',
    secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-700 shadow-lg',
    danger: 'bg-gradient-to-r from-red-800 to-red-900 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-700 shadow-lg',
    success: 'bg-gradient-to-r from-green-800 to-green-900 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-700 shadow-lg',
    outline: 'border-2 border-gray-700 text-gray-200 hover:bg-gray-800 focus:ring-blue-700',
    glass: 'glass-card border-none text-gray-100 hover:bg-white/10 focus:ring-blue-700 shadow-lg',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <motion.button
      whileHover={{ scale: (disabled || isLoading) ? 1 : 1.05 }}
      whileTap={{ scale: (disabled || isLoading) ? 1 : 0.97 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </motion.button>
  );
};

export default Button;