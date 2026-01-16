import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Toast Notification System - Apple Style
 * Premium spring animations, clean design
 */

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      showSuccess,
      showError,
      showInfo,
      showWarning,
      removeToast
    }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onClose(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      iconColor: 'text-green-600'
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      iconColor: 'text-red-600'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      iconColor: 'text-blue-600'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      iconColor: 'text-yellow-600'
    }
  };

  const { icon: Icon, bg, border, text, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className={`
        ${bg} ${border} ${text}
        px-6 py-4 rounded-2xl border-2
        shadow-xl shadow-black/10
        flex items-center gap-3
        max-w-md min-w-[320px]
        pointer-events-auto
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <p className="font-medium flex-1">{message}</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default ToastProvider;
