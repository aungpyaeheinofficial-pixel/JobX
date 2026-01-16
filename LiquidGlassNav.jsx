import React from 'react';
import { motion } from 'framer-motion';

export function LiquidGlassNavItem({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-2.5 cursor-pointer transition-colors"
    >
      {/* Liquid Glass Background */}
      {isActive && (
        <motion.div
          layoutId="liquid-glass"
          className="absolute inset-0 rounded-full overflow-hidden"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          {/* Main glass layer */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/10" />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.1)]" />
        </motion.div>
      )}

      {/* Label */}
      <span className={`relative z-10 text-sm font-medium transition-colors ${
        isActive ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </button>
  );
}

export function LiquidGlassButton({ label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-6 py-2.5 rounded-full overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Black background */}
      <div className="absolute inset-0 bg-black rounded-full" />

      {/* Liquid hover effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Label */}
      <span className="relative z-10 text-sm font-medium text-white">
        {label}
      </span>
    </motion.button>
  );
}

export function LiquidGlassHeader({ currentView, onNavigate, userData, onOpenMessages }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'community', label: 'Communities' },
    { id: 'projects', label: 'Projects' },
    { id: 'opportunities', label: 'Jobs' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-semibold">JobX</span>
          </div>

          {/* Liquid Glass Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 backdrop-blur-lg p-1.5 rounded-full border border-gray-200/50">
            {navItems.map((item) => (
              <LiquidGlassNavItem
                key={item.id}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LiquidGlassButton
              label="Post Job"
              onClick={() => onNavigate('post-opportunity')}
            />

            {/* Notification Bell */}
            <motion.button
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Messages */}
            <motion.button
              onClick={onOpenMessages}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </motion.button>

            {/* User Avatar */}
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {userData?.name?.charAt(0) || 'A'}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
