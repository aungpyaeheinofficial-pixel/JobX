import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  closable = true,
  className = '',
  action,
  actionLabel,
  onAction,
}) => {
  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      titleColor: 'text-green-900',
      buttonBg: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      titleColor: 'text-red-900',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      titleColor: 'text-amber-900',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      titleColor: 'text-blue-900',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor, titleColor, buttonBg } =
    config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${bgColor} ${borderColor} border rounded-2xl p-4 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} strokeWidth={2} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold mb-1 ${titleColor}`}>{title}</h4>
          )}
          {message && (
            <p className={`text-sm ${textColor} leading-relaxed`}>{message}</p>
          )}
          {action && actionLabel && (
            <button
              onClick={onAction}
              className={`mt-3 px-4 py-2 ${buttonBg} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        {closable && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:bg-black/5 rounded-lg p-1 transition-colors"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const InlineAlert = ({ type = 'info', message, icon: CustomIcon, className = '' }) => {
  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
  };

  const { icon: DefaultIcon, bgColor, textColor, iconColor } = config[type];
  const Icon = CustomIcon || DefaultIcon;

  return (
    <div className={`flex items-center gap-2 ${bgColor} ${textColor} px-3 py-2 rounded-lg ${className}`}>
      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} strokeWidth={2} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export const BannerAlert = ({ type = 'info', message, onClose, closable = true }) => {
  const config = {
    success: {
      bgColor: 'bg-green-600',
      textColor: 'text-white',
    },
    error: {
      bgColor: 'bg-red-600',
      textColor: 'text-white',
    },
    warning: {
      bgColor: 'bg-amber-600',
      textColor: 'text-white',
    },
    info: {
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
    },
  };

  const { bgColor, textColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${bgColor} ${textColor} py-3 px-4`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>
        {closable && onClose && (
          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-lg p-1 transition-colors flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;
