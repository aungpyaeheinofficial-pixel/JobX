import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from './src/services/api.js';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Upload,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { HiringModeHeader } from './EnhancedLiquidNav.jsx';

/**
 * Company Profile Page - Apple Editorial Style
 * Clean, confident, generous whitespace
 */
const CompanyProfilePage = ({ userData, onNavigate, onOpenMessages, onLogout, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    website: '',
    description: '',
    email: '',
    phone: '',
  });

  // Fetch company data on mount
  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await api.companies.getMyCompany();
      const company = response.company || {};
      
      setFormData({
        companyName: company.company_name || '',
        industry: company.industry || '',
        companySize: company.company_size || '',
        location: company.location || '',
        website: company.website || '',
        description: company.description || '',
        email: company.email || '',
        phone: company.phone || '',
      });
    } catch (error) {
      console.error('Failed to load company:', error);
      // Company might not exist yet, that's okay
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const companyData = {
        company_name: formData.companyName,
        industry: formData.industry,
        company_size: formData.companySize,
        location: formData.location,
        website: formData.website,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
      };

      await api.companies.create(companyData);
      
      if (onSave) {
        onSave(formData);
      }
      setIsEditing(false);
      
      // Reload to get latest data
      await loadCompany();
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('Failed to save company profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reload original data
    loadCompany();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <HiringModeHeader
        userData={userData}
        userRole="employer"
        activeTab="employer"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate('employer')}
          className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Hero Section - Large Confident Typography */}
        <div className="mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold tracking-tight mb-6"
          >
            Company Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 leading-relaxed"
          >
            Your company information shown to candidates
          </motion.p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-16">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full text-lg font-medium hover:border-gray-400 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </motion.button>
            </div>
          )}
        </div>

        {/* Form - Generous Whitespace */}
        <div className="space-y-16">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
              Company Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full text-4xl font-bold border-b-2 border-gray-200 focus:border-black outline-none py-4 transition-colors"
                placeholder="Your Company"
              />
            ) : (
              <div className="text-4xl font-bold py-4">
                {formData.companyName || 'Not set'}
              </div>
            )}
          </div>

          {/* Industry & Size - Two Columns */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                Industry
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors"
                  placeholder="Technology"
                />
              ) : (
                <div className="text-2xl font-medium py-3">
                  {formData.industry || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                Company Size
              </label>
              {isEditing ? (
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors bg-white"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              ) : (
                <div className="text-2xl font-medium py-3">
                  {formData.companySize || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors"
                  placeholder="Yangon, Myanmar"
                />
              ) : (
                <div className="text-2xl font-medium py-3">
                  {formData.location || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors"
                  placeholder="https://yourcompany.com"
                />
              ) : (
                <div className="text-2xl font-medium py-3">
                  {formData.website ? (
                    <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {formData.website}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
              About Company
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full text-xl leading-relaxed border-2 border-gray-200 focus:border-black outline-none p-6 rounded-2xl transition-colors resize-none"
                placeholder="Tell candidates about your company, mission, and culture..."
              />
            ) : (
              <div className="text-xl leading-relaxed py-6 text-gray-700">
                {formData.description || 'No description provided'}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="pt-8 border-t-2 border-gray-100">
            <h2 className="text-3xl font-bold mb-12">Contact Information</h2>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors"
                    placeholder="contact@company.com"
                  />
                ) : (
                  <div className="text-2xl font-medium py-3">
                    {formData.email || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-2xl font-medium border-b-2 border-gray-200 focus:border-black outline-none py-3 transition-colors"
                    placeholder="+95 9 123 456 789"
                  />
                ) : (
                  <div className="text-2xl font-medium py-3">
                    {formData.phone || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default CompanyProfilePage;
