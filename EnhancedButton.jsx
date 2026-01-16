import React from 'react';
import { motion } from 'framer-motion';
import { ButtonLoader } from './LoadingSkeleton';

/**
 * Enhanced Button Component
 * Beautiful, accessible, with loading states and animations
 */
const EnhancedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      text: 'text-white',
      hover: 'hover:from-blue-700 hover:to-indigo-700',
      shadow: 'shadow-lg shadow-blue-500/30',
      hoverShadow: 'hover:shadow-xl hover:shadow-blue-500/40',
    },
    secondary: {
      bg: 'bg-white border-2 border-gray-300',
      text: 'text-gray-700',
      hover: 'hover:border-gray-400 hover:bg-gray-50',
      shadow: 'shadow-md',
      hoverShadow: 'hover:shadow-lg',
    },
    success: {
      bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
      text: 'text-white',
      hover: 'hover:from-green-700 hover:to-emerald-700',
      shadow: 'shadow-lg shadow-green-500/30',
      hoverShadow: 'hover:shadow-xl hover:shadow-green-500/40',
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-600 to-rose-600',
      text: 'text-white',
      hover: 'hover:from-red-700 hover:to-rose-700',
      shadow: 'shadow-lg shadow-red-500/30',
      hoverShadow: 'hover:shadow-xl hover:shadow-red-500/40',
    },
    ghost: {
      bg: 'bg-transparent',
      text: 'text-gray-700',
      hover: 'hover:bg-gray-100',
      shadow: '',
      hoverShadow: '',
    },
    outline: {
      bg: 'bg-transparent border-2 border-blue-600',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-50',
      shadow: '',
      hoverShadow: 'hover:shadow-md',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const config = variants[variant];
  const sizeClass = sizes[size];
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      disabled={isDisabled}
      className={`
        ${config.bg} ${config.text} ${sizeClass}
        ${config.hover} ${config.shadow} ${config.hoverShadow}
        font-semibold rounded-full
        transition-all duration-200
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && <ButtonLoader />}

      {/* Left Icon */}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="w-5 h-5" strokeWidth={2.5} />
      )}

      {/* Button Text */}
      {!isLoading && children}

      {/* Right Icon */}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-5 h-5" strokeWidth={2.5} />
      )}
    </motion.button>
  );
};

// Icon Button (for actions like delete, edit)
export const IconButton = ({
  icon: Icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  ariaLabel,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      <Icon className="w-5 h-5" strokeWidth={2} />
    </motion.button>
  );
};

// Button Group (for multiple actions)
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {children}
    </div>
  );
};

// Floating Action Button (for primary actions like "Post")
export const FAB = ({
  icon: Icon,
  onClick,
  label,
  position = 'bottom-right',
  variant = 'primary',
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/50',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/50',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        fixed ${positions[position]}
        ${variants[variant]}
        text-white
        w-14 h-14 md:w-16 md:h-16
        rounded-full
        shadow-2xl
        flex items-center justify-center
        z-50
        group
      `}
      aria-label={label}
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />

      {/* Tooltip */}
      {label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 10 }}
          whileHover={{ opacity: 1, scale: 1, x: 0 }}
          className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  );
};

export default EnhancedButton;
