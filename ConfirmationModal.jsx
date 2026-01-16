import React, { useEffect } from 'react';
import { AlertTriangle, Info, Trash2, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default', // default | danger | warning | info
  icon: CustomIcon,
  isLoading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const variants = {
    default: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmButton: 'bg-black hover:bg-gray-800 text-white',
    },
    danger: {
      icon: Trash2,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const config = variants[variant];
  const Icon = CustomIcon || config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-message"
            >
              {/* Close button */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  className="hover:bg-gray-100 rounded-full p-2 transition-colors"
                  aria-label="Close modal"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-2">
                {/* Icon */}
                <div className={`w-14 h-14 ${config.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${config.iconColor}`} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 id="modal-title" className="text-2xl font-bold text-gray-900 mb-3">
                  {title}
                </h3>

                {/* Message */}
                <p id="modal-message" className="text-base text-gray-600 leading-relaxed mb-8">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 rounded-full transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmButton}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
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
                        Loading...
                      </span>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Preset confirmation modals
export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Delete this item?"
    message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
    confirmText="Delete"
    cancelText="Cancel"
    variant="danger"
    isLoading={isLoading}
  />
);

export const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Logout"
    message="Are you sure you want to logout? You'll need to sign in again to access your account."
    confirmText="Logout"
    cancelText="Stay logged in"
    variant="warning"
    icon={LogOut}
    isLoading={isLoading}
  />
);

export const DiscardChangesModal = ({ isOpen, onClose, onConfirm, isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Discard changes?"
    message="You have unsaved changes. Are you sure you want to discard them?"
    confirmText="Discard"
    cancelText="Keep editing"
    variant="warning"
    isLoading={isLoading}
  />
);

export default ConfirmationModal;
