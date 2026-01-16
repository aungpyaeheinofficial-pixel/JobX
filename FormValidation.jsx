import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Validation utility functions
export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  phoneNumber: (value) => {
    if (!value) return null;
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  match: (otherValue, fieldName) => (value) => {
    if (!value) return null;
    if (value !== otherValue) {
      return `Must match ${fieldName}`;
    }
    return null;
  },
};

// Custom hook for form validation
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    const ruleArray = Array.isArray(rules) ? rules : [rules];

    for (const rule of ruleArray) {
      const error = rule(value);
      if (error) return error;
    }

    return null;
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(validationRules).forEach((name) => {
      newTouched[name] = true;
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  };
};

// FormInput component with validation
export const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  touched,
  required = false,
  onChange,
  onBlur,
  disabled = false,
  helperText,
  className = '',
  showSuccess = false,
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value && showSuccess;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all ${
            hasError
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
              : isValid
              ? 'border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100'
              : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-1.5 mt-2"
            id={`${name}-error`}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-red-600 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {!hasError && helperText && (
        <p className="text-sm text-gray-500 mt-2" id={`${name}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

// FormTextarea component
export const FormTextarea = ({
  label,
  name,
  placeholder,
  value,
  error,
  touched,
  required = false,
  onChange,
  onBlur,
  disabled = false,
  rows = 4,
  helperText,
  maxLength,
  className = '',
}) => {
  const hasError = touched && error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all resize-none ${
          hasError
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex-1">
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-1.5"
                id={`${name}-error`}
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!hasError && helperText && (
            <p className="text-sm text-gray-500" id={`${name}-helper`}>
              {helperText}
            </p>
          )}
        </div>
        {maxLength && (
          <span className="text-sm text-gray-500 ml-2">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// FormSelect component
export const FormSelect = ({
  label,
  name,
  value,
  error,
  touched,
  required = false,
  onChange,
  onBlur,
  disabled = false,
  options = [],
  placeholder = 'Select an option',
  helperText,
  className = '',
}) => {
  const hasError = touched && error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all ${
          hasError
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-100'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-1.5 mt-2"
            id={`${name}-error`}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-red-600 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {!hasError && helperText && (
        <p className="text-sm text-gray-500 mt-2" id={`${name}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default { FormInput, FormTextarea, FormSelect, useFormValidation, validators };
