import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Linear progress bar
export const LinearProgress = ({ progress = 0, showLabel = true, className = '' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-black h-full rounded-full"
        />
      </div>
    </div>
  );
};

// Circular progress indicator
export const CircularProgress = ({ progress = 0, size = 120, strokeWidth = 8, showLabel = true }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#000000"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Multi-step progress indicator
export const StepProgress = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {/* Circle */}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCompleted
                      ? 'bg-black text-white'
                      : isActive
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {/* Label */}
                <div className="text-left">
                  <div
                    className={`text-sm font-semibold ${
                      isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500">{step.description}</div>
                  )}
                </div>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-y-0 left-0 bg-black"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <LinearProgress progress={((currentStep + 1) / steps.length) * 100} showLabel={false} />
        <div className="mt-4">
          <div className="text-base font-semibold text-gray-900">{steps[currentStep]?.label}</div>
          {steps[currentStep]?.description && (
            <div className="text-sm text-gray-500 mt-1">{steps[currentStep]?.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dots progress indicator (for carousels/onboarding)
export const DotsProgress = ({ total = 5, current = 0, onDotClick, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        const isClickable = !!onDotClick;

        return (
          <button
            key={index}
            onClick={() => isClickable && onDotClick(index)}
            disabled={!isClickable}
            className={`transition-all ${
              isActive ? 'w-8 h-2 bg-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            } rounded-full ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`Go to step ${index + 1}`}
            aria-current={isActive ? 'step' : undefined}
          />
        );
      })}
    </div>
  );
};

// Spinner loading indicator
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ message = 'Loading...', show = true }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-lg font-medium text-gray-900">{message}</p>
      </div>
    </motion.div>
  );
};

// Skeleton loader for content
export const Skeleton = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
};

export default {
  LinearProgress,
  CircularProgress,
  StepProgress,
  DotsProgress,
  Spinner,
  LoadingOverlay,
  Skeleton,
};
