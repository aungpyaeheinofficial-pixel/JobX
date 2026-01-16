import React, { useState } from 'react';
import { Bell, MessageSquare, Plus, Home, Users, Briefcase } from 'lucide-react';
import {
  AppleLiquidNavItem,
  AppleLiquidButton,
  AppleLiquidIconButton,
  AppleLiquidAvatar,
} from './AppleLiquidNav.jsx';

// Showcase page to demonstrate all liquid glass effects
export function LiquidGlassShowcase() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userData = { name: 'Alex' };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'community', label: 'Communities' },
    { id: 'projects', label: 'Projects' },
    { id: 'opportunities', label: 'Jobs' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Apple Liquid Glass
          </h1>
          <p className="text-xl text-gray-600">
            Premium navigation components with liquid glass morphing effects
          </p>
        </div>

        {/* Full Navigation Example */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Complete Navigation</h2>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <span className="text-2xl font-semibold">JobX</span>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-0.5 bg-gray-50/80 backdrop-blur-lg p-1 rounded-full border border-gray-200/60 shadow-sm">
                {navItems.map((item) => (
                  <AppleLiquidNavItem
                    key={item.id}
                    label={item.label}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  />
                ))}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <AppleLiquidButton
                  label="Post Job"
                  onClick={() => console.log('Post job')}
                />
                <AppleLiquidIconButton
                  icon={Bell}
                  badge={true}
                  ariaLabel="Notifications"
                  onClick={() => console.log('Notifications')}
                />
                <AppleLiquidIconButton
                  icon={MessageSquare}
                  ariaLabel="Messages"
                  onClick={() => console.log('Messages')}
                />
                <AppleLiquidAvatar
                  userData={userData}
                  onClick={() => console.log('Profile')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Items */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Navigation Items</h2>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-12 shadow-xl">
            <div className="flex items-center justify-center gap-2 bg-gray-50/80 backdrop-blur-lg p-1.5 rounded-full border border-gray-200/60 inline-flex mx-auto">
              <AppleLiquidNavItem
                label="Dashboard"
                isActive={true}
                onClick={() => {}}
              />
              <AppleLiquidNavItem
                label="Projects"
                isActive={false}
                onClick={() => {}}
              />
              <AppleLiquidNavItem
                label="Settings"
                isActive={false}
                onClick={() => {}}
              />
            </div>
            <p className="text-center text-gray-600 mt-6">
              Hover and click to see the liquid glass morphing effect
            </p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Action Buttons</h2>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-12 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AppleLiquidButton
                label="Post Job"
                onClick={() => {}}
              />
              <AppleLiquidButton
                label="Create Project"
                onClick={() => {}}
                icon={Plus}
              />
              <AppleLiquidButton
                label="Join Community"
                onClick={() => {}}
                icon={Users}
              />
            </div>
            <p className="text-center text-gray-600 mt-6">
              Hover to see the liquid gradient animation
            </p>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Icon Buttons</h2>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-12 shadow-xl">
            <div className="flex items-center justify-center gap-4">
              <AppleLiquidIconButton
                icon={Home}
                ariaLabel="Home"
                onClick={() => {}}
              />
              <AppleLiquidIconButton
                icon={Bell}
                badge={true}
                ariaLabel="Notifications"
                onClick={() => {}}
              />
              <AppleLiquidIconButton
                icon={MessageSquare}
                ariaLabel="Messages"
                onClick={() => {}}
              />
              <AppleLiquidIconButton
                icon={Briefcase}
                ariaLabel="Jobs"
                onClick={() => {}}
              />
            </div>
            <p className="text-center text-gray-600 mt-6">
              Interactive icons with micro-animations
            </p>
          </div>
        </section>

        {/* Avatar */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">User Avatar</h2>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-12 shadow-xl">
            <div className="flex items-center justify-center gap-6">
              <AppleLiquidAvatar
                userData={{ name: 'Alex' }}
                onClick={() => {}}
              />
              <AppleLiquidAvatar
                userData={{ name: 'Sarah' }}
                onClick={() => {}}
              />
              <AppleLiquidAvatar
                userData={{ name: 'Mike' }}
                onClick={() => {}}
              />
            </div>
            <p className="text-center text-gray-600 mt-6">
              Animated gradient avatars with hover effects
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-8 shadow-xl">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Liquid Morphing</h3>
            <p className="text-gray-600">
              Smooth spring-based animations that feel natural and responsive
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-8 shadow-xl">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Glass Effects</h3>
            <p className="text-gray-600">
              Multi-layered glass with shimmer, gradients, and depth
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200/60 p-8 shadow-xl">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-600">
              GPU-accelerated animations for 60fps smooth interactions
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LiquidGlassShowcase;
