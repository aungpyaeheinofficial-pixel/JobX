import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import {
  AppleLiquidNavItem,
  AppleLiquidButton,
  AppleLiquidIconButton,
  AppleLiquidAvatar,
} from './AppleLiquidNav.jsx';

export function SharedLiquidHeader({ currentView, userData, onNavigate, onOpenMessages }) {
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

          {/* Apple Liquid Glass Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 bg-gray-50/80 backdrop-blur-lg p-1 rounded-full border border-gray-200/60 shadow-sm">
            {navItems.map((item) => (
              <AppleLiquidNavItem
                key={item.id}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Post Job Button */}
            <AppleLiquidButton
              label="Post Job"
              onClick={() => onNavigate('post-opportunity')}
            />

            {/* Notification Bell */}
            <AppleLiquidIconButton
              icon={Bell}
              badge={true}
              ariaLabel="Notifications"
              onClick={() => console.log('Open notifications')}
            />

            {/* Messages */}
            <AppleLiquidIconButton
              icon={MessageSquare}
              ariaLabel="Messages"
              onClick={onOpenMessages}
            />

            {/* User Avatar */}
            <AppleLiquidAvatar
              userData={userData}
              onClick={() => onNavigate('profile')}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SharedLiquidHeader;
