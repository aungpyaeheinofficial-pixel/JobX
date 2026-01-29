import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Enhanced Input Component with validation feedback
 * Provides better UX with real-time validation, helper text, and visual states
 */
const EnhancedInput = ({
  icon: Icon,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = (e) => {
    setIsFocused(false);
    setTouched(true);
    onBlur && onBlur(e);
  };

  const showError = touched && error;
  const showSuccess = touched && success && !error;

  const getBorderColor = () => {
    if (showError) return 'border-red-500 ring-2 ring-red-100';
    if (showSuccess) return 'border-green-500 ring-2 ring-green-100';
    if (isFocused) return 'border-brand ring-2 ring-brand/10';
    return 'border-gray-200';
  };

  const getIconColor = () => {
    if (showError) return 'text-red-500';
    if (showSuccess) return 'text-green-500';
    if (isFocused) return 'text-brand';
    return 'text-gray-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative group">
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          className={`relative flex items-center gap-3 px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 ${getBorderColor()} ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {/* Leading Icon */}
          {Icon && (
            <Icon
              className={`w-5 h-5 transition-colors duration-200 flex-shrink-0 ${getIconColor()}`}
              strokeWidth={2}
            />
          )}

          {/* Input Field */}
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            name={name}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed"
            {...props}
          />

          {/* Trailing Icons */}
          <div className="flex items-center gap-2">
            {/* Password Toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Success Check */}
            {showSuccess && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            )}

            {/* Error Icon */}
            {showError && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error/Success/Helper Text */}
        <AnimatePresence mode="wait">
          {(showError || showSuccess || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex items-start gap-2"
            >
              {showError && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </>
              )}
              {showSuccess && !error && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-600 font-medium">
                    {typeof success === 'string' ? success : 'Looks good!'}
                  </p>
                </>
              )}
              {helperText && !error && !success && (
                <>
                  <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500">{helperText}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Textarea variant
export const EnhancedTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  maxLength,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = (e) => {
    setIsFocused(false);
    setTouched(true);
    onBlur && onBlur(e);
  };

  const showError = touched && error;
  const showSuccess = touched && success && !error;
  const charCount = value?.length || 0;

  const getBorderColor = () => {
    if (showError) return 'border-red-500 ring-2 ring-red-100';
    if (showSuccess) return 'border-green-500 ring-2 ring-green-100';
    if (isFocused) return 'border-brand ring-2 ring-brand/10';
    return 'border-gray-200';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxLength && (
            <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-400'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea Container */}
      <motion.div
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        className={`relative px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 ${getBorderColor()} ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          name={name}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className="w-full bg-transparent outline-none text-base text-gray-900 placeholder-gray-400 resize-none disabled:cursor-not-allowed"
          {...props}
        />
      </motion.div>

      {/* Error/Success/Helper Text */}
      <AnimatePresence mode="wait">
        {(showError || showSuccess || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-start gap-2"
          >
            {showError && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </>
            )}
            {showSuccess && !error && (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-600 font-medium">
                  {typeof success === 'string' ? success : 'Looks good!'}
                </p>
              </>
            )}
            {helperText && !error && !success && (
              <>
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-500">{helperText}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedInput;
