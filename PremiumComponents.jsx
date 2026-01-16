import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Apple-style Interactive Components
 * Spring physics, micro-interactions, smooth animations
 */

// Spring animation config (Apple-like)
const springConfig = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

const smoothConfig = {
  type: "spring",
  stiffness: 300,
  damping: 25
};

/**
 * Premium Button with press feedback
 * Scale on click, smooth hover
 */
export const PremiumButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-white text-black border-2 border-gray-200 hover:border-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={springConfig}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-4 rounded-full font-medium
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
      {Icon && <Icon className="w-5 h-5" />}
    </motion.button>
  );
};

/**
 * Premium Card with hover lift
 * Subtle shadow, smooth elevation
 */
export const PremiumCard = ({
  children,
  onClick,
  className = '',
  hoverable = true
}) => {
  return (
    <motion.div
      whileHover={hoverable ? {
        y: -4,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      } : {}}
      transition={smoothConfig}
      onClick={onClick}
      className={`
        bg-white rounded-3xl border-2 border-gray-200 p-8
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

/**
 * Skeleton Loader - Apple style
 * Smooth shimmer animation
 */
export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    text: 'h-4 w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-12 w-32 rounded-full',
    card: 'h-64 w-full rounded-3xl'
  };

  return (
    <motion.div
      animate={{
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        bg-[length:200%_100%]
        animate-shimmer
        rounded-2xl
        ${variants[variant]}
        ${className}
      `}
    />
  );
};

/**
 * Card Skeleton for loading states
 */
export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-3">
        <Skeleton variant="title" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3" />
    <Skeleton className="h-3" />
    <Skeleton className="h-3 w-4/5" />
    <div className="flex gap-2 pt-4">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  </div>
);

/**
 * Page transition wrapper
 * Smooth fade + slide
 */
export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={smoothConfig}
  >
    {children}
  </motion.div>
);

/**
 * Stagger children animation
 * For lists and grids
 */
export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={smoothConfig}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Icon Button with feedback
 */
export const IconButton = ({
  icon: Icon,
  onClick,
  className = '',
  label
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    transition={springConfig}
    onClick={onClick}
    className={`
      p-3 rounded-full
      hover:bg-gray-100
      transition-colors duration-200
      ${className}
    `}
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
  </motion.button>
);

/**
 * Floating Action Button
 */
export const FloatingButton = ({
  icon: Icon,
  onClick,
  label,
  className = ''
}) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={springConfig}
    onClick={onClick}
    className={`
      fixed bottom-8 right-8
      w-16 h-16 rounded-full
      bg-black text-white
      shadow-xl shadow-black/20
      flex items-center justify-center
      hover:shadow-2xl
      transition-shadow duration-200
      ${className}
    `}
    aria-label={label}
  >
    <Icon className="w-6 h-6" />
  </motion.button>
);

/**
 * Smooth scale on hover (for images, icons)
 */
export const ScaleOnHover = ({ children, scale = 1.05 }) => (
  <motion.div
    whileHover={{ scale }}
    transition={springConfig}
  >
    {children}
  </motion.div>
);

/**
 * Premium Badge with subtle animation
 */
export const PremiumBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    primary: 'bg-black text-white'
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springConfig}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

/**
 * Loading Dots Animation
 */
export const LoadingDots = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -8, 0]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15
        }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
    ))}
  </div>
);

/**
 * Premium Toast Notification
 */
export const Toast = ({
  message,
  type = 'success',
  onClose,
  icon: Icon
}) => {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={springConfig}
      className={`
        fixed top-8 right-8 z-50
        px-6 py-4 rounded-2xl border-2
        shadow-xl shadow-black/10
        flex items-center gap-3
        max-w-md
        ${types[type]}
      `}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <p className="font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

/**
 * Smooth reveal on scroll
 */
export const RevealOnScroll = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={smoothConfig}
    className={className}
  >
    {children}
  </motion.div>
);

export default {
  PremiumButton,
  PremiumCard,
  Skeleton,
  CardSkeleton,
  PageTransition,
  StaggerContainer,
  StaggerItem,
  IconButton,
  FloatingButton,
  ScaleOnHover,
  PremiumBadge,
  LoadingDots,
  Toast,
  RevealOnScroll
};
