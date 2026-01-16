import React, { useState } from 'react';
import { EnhancedHeader, EnhancedLiquidNav, EnhancedActionButton, EnhancedIconButton, EnhancedAvatar } from './EnhancedLiquidNav.jsx';
import { ArrowLeft, Zap, Play, Plus, Bell, MessageSquare, Star, Heart, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const NavigationShowcase = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredCard, setHoveredCard] = useState(null);

  const mockUser = {
    name: 'Aung Pyae Hein',
    email: 'aungpyae@jobx.com',
  };

  const features = [
    {
      id: 1,
      title: 'Liquid Morphing Animation',
      description: 'Smooth spring-based transitions between active states with Apple-quality animation curves',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Glassmorphism Design',
      description: 'Beautiful frosted glass effect with backdrop blur for modern, depth-rich UI',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      title: 'Responsive Mobile Menu',
      description: 'Slide-out drawer navigation with smooth animations for mobile devices',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      title: 'Hover & Focus States',
      description: 'Subtle hover effects and focus indicators for enhanced user interaction',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <EnhancedHeader
        userData={mockUser}
        userRole="seeker"
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenMessages={() => console.log('Messages')}
        onLogout={() => console.log('Logout')}
        onSettings={() => console.log('Settings')}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-xl rounded-full border border-gray-200/60 shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">Back</span>
            </button>

            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30">
              <Zap className="w-5 h-5 text-white" fill="white" />
              <span className="text-sm font-bold text-white">Enhanced Navigation</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            >
              Apple-Quality Navigation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed"
            >
              Experience buttery-smooth animations, glassmorphism design, and liquid morphing transitions
            </motion.p>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] border border-gray-200/60 shadow-2xl shadow-black/10 p-12 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Try It Yourself</h2>
            <div className="flex flex-col items-center gap-8">
              <EnhancedLiquidNav
                activeTab={activeTab}
                onNavigate={setActiveTab}
                userData={mockUser}
              />
              <p className="text-center text-gray-600 text-lg">
                Click on different tabs to see the liquid morphing animation
              </p>
            </div>
          </div>

          {/* Component Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] border border-gray-200/60 shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Action Buttons</h3>
              <div className="space-y-3">
                <EnhancedActionButton
                  label="Primary"
                  icon={Plus}
                  onClick={() => {}}
                  variant="primary"
                />
                <EnhancedActionButton
                  label="Secondary"
                  icon={Star}
                  onClick={() => {}}
                  variant="secondary"
                />
                <EnhancedActionButton
                  label="With Badge"
                  icon={Bell}
                  onClick={() => {}}
                  variant="primary"
                  badge={true}
                />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] border border-gray-200/60 shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <EnhancedIconButton icon={Bell} badge={true} ariaLabel="Notifications" />
                <EnhancedIconButton icon={MessageSquare} ariaLabel="Messages" />
                <EnhancedIconButton icon={Heart} ariaLabel="Favorites" />
                <EnhancedIconButton icon={Share2} ariaLabel="Share" />
                <EnhancedIconButton icon={Download} ariaLabel="Download" />
                <EnhancedIconButton icon={Play} ariaLabel="Play" variant="active" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] border border-gray-200/60 shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Avatar Dropdown</h3>
              <div className="flex items-center justify-center py-8">
                <EnhancedAvatar
                  userData={mockUser}
                  onClick={() => console.log('Profile')}
                  onLogout={() => console.log('Logout')}
                  onSettings={() => console.log('Settings')}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">Click to see dropdown menu</p>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] border border-gray-200/60 shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Mobile Menu</h3>
              <p className="text-sm text-gray-600 mb-4">
                Resize your browser or view on mobile to see the slide-out drawer navigation
              </p>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📱</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                onHoverStart={() => setHoveredCard(feature.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white/70 backdrop-blur-2xl rounded-[28px] border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all p-8 overflow-hidden"
              >
                {/* Gradient Background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === feature.id ? 0.1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color}`}
                />

                {/* Content */}
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6`}>
                    <span className="text-2xl font-bold text-white">{feature.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[32px] shadow-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-8 text-center">Technical Implementation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  500ms
                </div>
                <div className="text-lg font-semibold mb-2">Spring Stiffness</div>
                <div className="text-gray-400">Perfect balance for smooth, natural-feeling animations</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  35
                </div>
                <div className="text-lg font-semibold mb-2">Damping Value</div>
                <div className="text-gray-400">Prevents overshoot while maintaining fluid motion</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  2.5px
                </div>
                <div className="text-lg font-semibold mb-2">Icon Stroke Width</div>
                <div className="text-gray-400">Crisp, clear icons that match Apple's design language</div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-4">Built With</h3>
              <div className="flex flex-wrap gap-3">
                {['Framer Motion', 'React Hooks', 'Tailwind CSS', 'Lucide Icons'].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-sm font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-16 bg-white/70 backdrop-blur-2xl rounded-[32px] border border-gray-200/60 shadow-xl p-12">
            <h2 className="text-3xl font-bold mb-6">Usage Example</h2>
            <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
              <pre className="text-sm text-gray-100 leading-relaxed">
                <code>{`import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <EnhancedHeader
      userData={userData}
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onOpenMessages={() => console.log('Messages')}
      onLogout={() => console.log('Logout')}
    />
  );
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-white/50 backdrop-blur-xl py-8 mt-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-600">
            Enhanced Apple-Style Navigation System for <span className="font-bold">JobX</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with precision and attention to detail
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NavigationShowcase;
