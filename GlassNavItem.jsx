import React from 'react';
import { motion } from 'framer-motion';

export function GlassNavItem({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 cursor-pointer"
    >
      {/* Glass Hover/Active Background */}
      <motion.div
        layoutId="glass-hover"
        className="absolute inset-0 rounded-full"
        style={{
          filter: "url(#glass-distortion)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 26,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-white/10" />
      </motion.div>

      {/* Label */}
      <span className="relative z-10 text-sm font-medium text-gray-900">
        {label}
      </span>

      {/* SVG Filter for Glass Distortion Effect */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="glass-distortion">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </button>
  );
}
