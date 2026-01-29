import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AppleLiquidNavItem({ label, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-6 py-2.5 cursor-pointer"
    >
      {/* Active/Hover Liquid Glass */}
      <AnimatePresence>
        {(isActive || isHovered) && (
          <motion.div
            layoutId={isActive ? "liquid-glass-active" : undefined}
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          >
            {/* Multi-layer glass effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Base glass layer */}
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xl" />

              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-white/20" />

              {/* Top highlight */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-full" />

              {/* Bottom shadow */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent rounded-b-full" />

              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  ],
                  backgroundPosition: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />

              {/* Inner glow border */}
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/50" />

              {/* Outer subtle shadow */}
              <div className="absolute inset-0 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label with smooth color transition */}
      <motion.span
        className="relative z-10 text-sm font-medium"
        animate={{
          color: isActive ? '#FC5114' : isHovered ? '#374151' : '#9CA3AF',
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </button>
  );
}

export function AppleLiquidButton({ label, onClick, icon: Icon }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-6 py-2.5 rounded-full overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {/* Base brand background */}
      <div className="absolute inset-0 bg-brand rounded-full" />

      {/* Liquid hover gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light via-brand to-brand-dark rounded-full" />

        {/* Animated shine */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            ],
            backgroundPosition: ['-200%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </motion.div>

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-full" />

      {/* Label */}
      <span className="relative z-10 text-sm font-medium text-white flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </span>
    </motion.button>
  );
}

export function AppleLiquidIconButton({ onClick, icon: Icon, badge = false, ariaLabel }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative p-2.5 rounded-xl transition-colors group"
      whileHover={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      aria-label={ariaLabel}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
      </motion.div>

      {badge && (
        <motion.div
          className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

export function AppleLiquidAvatar({ userData, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl overflow-hidden"
      whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Gradient background - brand + black */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light via-brand to-brand-dark" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            'linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />

      {/* User initial */}
      <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-semibold">
        {userData?.name?.charAt(0) || 'A'}
      </div>
    </motion.button>
  );
}
