import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Briefcase,
  Trophy,
  User,
  Bell,
  MessageSquare,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Rss,
  Globe,
  FileText,
  ChevronDown,
  BarChart,
} from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown.jsx';

// Enhanced Apple-style Liquid Glass Navigation
export const EnhancedLiquidNav = ({ activeTab = 'dashboard', onNavigate, userData, userRole, onOpenMessages, onLogout }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'opportunities', label: 'Find Jobs', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Trophy },
  ];

  useEffect(() => {
    if (showProfileMenu || showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showProfileMenu, showMobileMenu]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-2xl p-1.5 rounded-[20px] border border-gray-200/60 shadow-lg shadow-black/5">
        <div className="relative flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative z-10 px-5 py-2.5 rounded-[14px] transition-colors duration-200"
              >
                {/* Active Background - Liquid Morphing Effect */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-[14px] shadow-lg ${
                      item.isAction
                        ? 'bg-brand shadow-brand'
                        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-black/20'
                    }`}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Hover Background */}
                {!isActive && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute inset-0 backdrop-blur-sm rounded-[14px] ${
                      item.isAction ? 'bg-brand/10' : 'bg-gray-100/80'
                    }`}
                    transition={{ duration: 0.15 }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center gap-2.5">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      isActive ? 'text-white' : item.isAction ? 'text-brand' : 'text-gray-600'
                    }`}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`text-[15px] font-semibold transition-colors duration-200 ${
                      isActive ? 'text-white' : item.isAction ? 'text-brand' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 bg-white/70 backdrop-blur-xl rounded-full border border-gray-200/60 shadow-lg"
      >
        <Menu className="w-5 h-5 text-gray-700" strokeWidth={2} />
      </button>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-2xl border-r border-gray-200 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">J</span>
                    </div>
                    <span className="text-xl font-semibold">JobX</span>
                  </div>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === activeTab;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-black text-white shadow-lg shadow-black/10'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2.5} />
                          <span className="text-base font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-base font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Hiring Mode Navigation (Employer Dashboard)
export const HiringModeNav = ({ activeTab = 'employer', onNavigate, userData, userRole, onOpenMessages, onLogout }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'employer', label: 'Dashboard', icon: Briefcase },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-2xl p-1.5 rounded-[20px] border border-gray-200/60 shadow-lg shadow-black/5">
        <div className="relative flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative z-10 px-5 py-2.5 rounded-[14px] transition-colors duration-200"
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabHiring"
                    className="absolute inset-0 rounded-[14px] shadow-lg bg-brand shadow-brand"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Hover Background */}
                {!isActive && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 backdrop-blur-sm rounded-[14px] bg-brand/10"
                    transition={{ duration: 0.15 }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center gap-2.5">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-brand'
                    }`}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`text-[15px] font-semibold transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-brand'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Post a Job CTA - Primary action in Hiring Mode */}
          <button
            onClick={() => onNavigate('post-opportunity')}
            className="relative z-10 ml-2 px-5 py-2.5 rounded-[14px] bg-brand text-white font-semibold shadow-brand hover:bg-brand-dark hover:shadow-brand-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
            <span className="text-[15px]">Post a Job</span>
          </button>
        </div>
      </nav>
    </>
  );
};

// Enhanced Action Button
export const EnhancedActionButton = ({ label, icon: Icon, onClick, variant = 'primary', badge = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      text: 'text-white',
      shadow: 'shadow-lg shadow-black/20',
      hover: 'hover:shadow-xl hover:shadow-black/30',
    },
    secondary: {
      bg: 'bg-white/70 backdrop-blur-xl',
      text: 'text-gray-700',
      shadow: 'shadow-md shadow-black/5',
      hover: 'hover:shadow-lg hover:shadow-black/10',
    },
  };

  const config = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative px-5 py-2.5 rounded-[14px] border border-gray-200/60 ${config.bg} ${config.text} ${config.shadow} ${config.hover} transition-all duration-200`}
    >
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} />}
        <span className="text-[15px] font-semibold whitespace-nowrap">{label}</span>
      </div>
      {badge && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      )}
    </motion.button>
  );
};

// Enhanced Icon Button
export const EnhancedIconButton = ({ icon: Icon, badge = false, ariaLabel, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/70 backdrop-blur-xl hover:bg-white/90',
    active: 'bg-black text-white hover:bg-gray-800',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-10 h-10 rounded-[14px] border border-gray-200/60 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-200 flex items-center justify-center ${variants[variant]}`}
      aria-label={ariaLabel}
    >
      <Icon className="w-5 h-5" strokeWidth={2.5} />
      {badge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
        >
          <span className="text-[10px] font-bold text-white">3</span>
        </motion.div>
      )}
    </motion.button>
  );
};

// Enhanced Avatar with Dropdown (Mode-Aware)
export const EnhancedAvatar = ({ userData, userRole, onClick, onNavigate, onLogout, onSettings, isHiringMode = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const hasCompany = userData?.companyData; // Check if user has company setup

  const handleMenuClick = (id) => {
    setShowMenu(false);
    switch(id) {
      case 'personal-profile':
        onClick();
        break;
      case 'company-profile':
        onNavigate && onNavigate('employer');
        break;
      case 'switch-to-employer':
        // If no company, trigger company setup, else go to employer dashboard
        if (!hasCompany) {
          onNavigate && onNavigate('employer-onboarding');
        } else {
          onNavigate && onNavigate('employer');
        }
        break;
      case 'switch-to-personal':
        // Switch back to Personal Mode (Home/Feed)
        onNavigate && onNavigate('feed');
        break;
      case 'settings':
        onSettings && onSettings();
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand/30 border-2 border-white/50 backdrop-blur-xl"
      >
        {userData?.name?.charAt(0) || 'U'}
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-200/60 shadow-2xl shadow-black/10 overflow-hidden z-50"
            >
              {/* Personal Profile Section */}
              <button
                onClick={() => handleMenuClick('personal-profile')}
                className="w-full px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-sm">
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {userData?.name || 'User'}
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Personal</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {userData?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Menu Items */}
              <div className="p-2">
                {/* Mode Switcher */}
                {isHiringMode ? (
                  // In Hiring Mode - Show "Switch to Personal"
                  <button
                    onClick={() => handleMenuClick('switch-to-personal')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-gray-100 text-gray-700 border border-gray-200 mb-2"
                  >
                    <Home className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold">Switch to Personal</span>
                      <div className="text-xs text-gray-500">Browse jobs & network</div>
                    </div>
                  </button>
                ) : (
                  // In Personal Mode - Show "Switch to Hiring"
                  hasCompany ? (
                    <button
                      onClick={() => handleMenuClick('company-profile')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-brand/10 text-gray-700 mb-1"
                    >
                      <Briefcase className="w-5 h-5 text-brand" />
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">Employer Dashboard</span>
                        <div className="text-xs text-gray-500">{userData?.companyData?.companyName || 'Your Company'}</div>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMenuClick('switch-to-employer')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-brand/10 text-brand border border-brand/30 mb-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <span className="text-sm font-semibold">Switch to Hiring</span>
                        <div className="text-xs text-brand">Post jobs & hire talent</div>
                      </div>
                    </button>
                  )
                )}

                <button
                  onClick={() => handleMenuClick('settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-gray-100 text-gray-700"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </button>

                <button
                  onClick={() => handleMenuClick('logout')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-50 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Legacy menu items support (deprecated, kept for compatibility)
const LegacyEnhancedAvatar = ({ userData, onClick, onLogout, onSettings }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'View Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut, danger: true },
  ];

  const handleMenuClick = (id) => {
    setShowMenu(false);
    if (id === 'profile') onClick();
    if (id === 'settings') onSettings && onSettings();
    if (id === 'logout') onLogout();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand/30 border-2 border-white/50 backdrop-blur-xl"
      >
        {userData?.name?.charAt(0) || 'U'}
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-200/60 shadow-2xl shadow-black/10 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="font-semibold text-gray-900 text-sm">
                  {userData?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {userData?.email || 'user@example.com'}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        item.danger
                          ? 'hover:bg-red-50 text-red-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Complete Enhanced Header Component
export const EnhancedHeader = ({
  userData,
  userRole,
  activeTab,
  onNavigate,
  onOpenMessages,
  onLogout,
  onSettings,
  showPostButton = true,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-2xl border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('feed')}
              className="w-11 h-11 bg-brand rounded-[14px] flex items-center justify-center shadow-brand cursor-pointer"
            >
              <span className="text-white font-bold text-lg">J</span>
            </motion.div>
            <span className="text-xl font-bold text-black">
              JobX
            </span>
          </div>

          {/* Navigation */}
          <EnhancedLiquidNav
            activeTab={activeTab}
            onNavigate={onNavigate}
            userData={userData}
            userRole={userRole}
            onOpenMessages={onOpenMessages}
            onLogout={onLogout}
          />

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <NotificationsDropdown onNavigate={onNavigate} />

            <EnhancedIconButton
              icon={MessageSquare}
              ariaLabel="Messages"
              onClick={onOpenMessages}
            />

            <EnhancedAvatar
              userData={userData}
              userRole={userRole}
              onClick={() => onNavigate('profile')}
              onNavigate={onNavigate}
              onLogout={onLogout}
              onSettings={onSettings}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Hiring Mode Header (for Employer Dashboard)
export const HiringModeHeader = ({
  userData,
  userRole,
  activeTab,
  onNavigate,
  onOpenMessages,
  onLogout,
  onSettings,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-2xl border-b border-black/10 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo with Hiring Badge */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('feed')}
              className="w-11 h-11 bg-brand rounded-[14px] flex items-center justify-center shadow-brand cursor-pointer"
            >
              <span className="text-white font-bold text-lg">J</span>
            </motion.div>
            <div>
              <span className="text-xl font-bold text-black">
                JobX
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-brand">Hiring Mode</span>
                <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Hiring Mode Navigation */}
          <HiringModeNav
            activeTab={activeTab}
            onNavigate={onNavigate}
            userData={userData}
            userRole={userRole}
            onOpenMessages={onOpenMessages}
            onLogout={onLogout}
          />

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <NotificationsDropdown onNavigate={onNavigate} />

            <EnhancedIconButton
              icon={MessageSquare}
              ariaLabel="Messages"
              onClick={onOpenMessages}
            />

            <EnhancedAvatar
              userData={userData}
              userRole={userRole}
              onClick={() => onNavigate('profile')}
              onNavigate={onNavigate}
              onLogout={onLogout}
              onSettings={onSettings}
              isHiringMode={true}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedLiquidNav;
