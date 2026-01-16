import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Zap, ArrowRight } from 'lucide-react';

const RoleSelection = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('job_seeker');

  const roles = [
    {
      id: 'job_seeker',
      icon: Search,
      title: 'Find Jobs & Grow Network',
      subtitle: 'For professionals',
      features: [
        'Discover jobs',
        'Build your profile',
        'Connect with builders'
      ],
      ctaText: 'Continue',
      isPrimary: true
    },
    {
      id: 'hirer',
      icon: Briefcase,
      title: 'Hire Talent / Post Jobs',
      subtitle: 'For companies & founders',
      features: [
        'Post jobs',
        'Hire faster',
        'Reach builders directly'
      ],
      ctaText: 'Continue',
      isPrimary: false
    },
    {
      id: 'both',
      icon: Zap,
      title: 'Both',
      subtitle: "I'm building & hiring",
      features: [
        'Full access',
        'Dual feed',
        'All features'
      ],
      ctaText: 'Continue',
      isPrimary: false
    }
  ];

  const handleContinue = () => {
    onRoleSelect(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
            How do you want to use JobX?
          </h1>
          <p className="text-xl text-gray-500">
            Select one. You can change this anytime.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRole(role.id)}
                className={`relative p-8 rounded-3xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-2 border-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.15)]'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {role.isPrimary && !isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 right-6 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {role.subtitle}
                </p>

                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="mt-4 text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors">
            Change later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
