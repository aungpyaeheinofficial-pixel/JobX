import React, { useState } from 'react';
import { GlassNavItem } from './GlassNavItem.jsx';

// Example usage of GlassNavItem component
export function GlassNavExample() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'community', label: 'Communities' },
    { id: 'projects', label: 'Projects' },
    { id: 'jobs', label: 'Jobs' },
  ];

  return (
    <nav className="flex items-center gap-2 bg-gray-50/50 backdrop-blur-lg p-2 rounded-full border border-gray-200/50">
      {navItems.map((item) => (
        <GlassNavItem
          key={item.id}
          label={item.label}
          isActive={activeTab === item.id}
          onClick={() => setActiveTab(item.id)}
        />
      ))}
    </nav>
  );
}

// Example integration into your existing header
export function GlassNavHeader({ currentView, onNavigate, userData }) {
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

          {/* Glass Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-gray-50/50 backdrop-blur-lg p-2 rounded-full border border-gray-200/50">
            {navItems.map((item) => (
              <GlassNavItem
                key={item.id}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
            <button
              onClick={() => onNavigate('post-opportunity')}
              className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium text-sm ml-2"
            >
              Post Job
            </button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
              {userData?.name?.charAt(0) || 'A'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
