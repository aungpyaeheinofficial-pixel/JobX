import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Globe,
  Sparkles,
  Target,
  Clock,
  Zap
} from 'lucide-react';

const EmployerOnboarding = ({ userData, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companySize: '',
    industry: '',
    location: '',
    website: '',
    logo: null,
    logoPreview: null,
    description: ''
  });

  const totalSteps = 2;

  const industries = [
    'Technology',
    'Construction',
    'Design & Creative',
    'Finance & Banking',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail & E-commerce',
    'Hospitality',
    'Real Estate',
    'Consulting',
    'Other'
  ];

  const companySizes = [
    { value: '1-10', label: '1-10 employees', icon: '👤' },
    { value: '11-50', label: '11-50 employees', icon: '👥' },
    { value: '51-200', label: '51-200 employees', icon: '🏢' },
    { value: '201-500', label: '201-500 employees', icon: '🏬' },
    { value: '500+', label: '500+ employees', icon: '🌆' }
  ];

  const hiringOptions = [
    { value: 'immediately', label: 'Immediately', desc: 'Ready to hire now', icon: Zap },
    { value: '1-2weeks', label: '1-2 Weeks', desc: 'Starting soon', icon: Clock },
    { value: '1month', label: 'Within a Month', desc: 'Planning ahead', icon: Calendar },
    { value: 'exploring', label: 'Just Exploring', desc: 'Building talent pool', icon: Target }
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        ...companyData,
        setupComplete: true,
        setupDate: new Date().toISOString()
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return companyData.companyName && companyData.industry && companyData.companySize && companyData.location;
      case 2:
        return true;
      default:
        return false;
    }
  };

  // Step 1: Company Info
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Tell us about your company</h1>
        <p className="text-xl text-gray-500">Help candidates learn more about who you are</p>
      </div>

      {/* Company Logo */}
      <div className="flex justify-center mb-8">
        <label className="cursor-pointer group">
          <div className={`w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all ${
            companyData.logoPreview 
              ? 'border-transparent' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}>
            {companyData.logoPreview ? (
              <img 
                src={companyData.logoPreview} 
                alt="Company logo" 
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-500">Add Logo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={companyData.companyName}
          onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="e.g., TechStart Myanmar"
          className="w-full px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Industry *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {industries.map(industry => (
            <button
              key={industry}
              onClick={() => setCompanyData(prev => ({ ...prev, industry }))}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                companyData.industry === industry
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Company Size */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Company Size *
        </label>
        <div className="grid grid-cols-5 gap-3">
          {companySizes.map(size => (
            <button
              key={size.value}
              onClick={() => setCompanyData(prev => ({ ...prev, companySize: size.value }))}
              className={`px-4 py-4 rounded-xl border text-center transition-all ${
                companyData.companySize === size.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{size.icon}</div>
              <div className="text-xs font-medium">{size.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={companyData.location}
            onChange={(e) => setCompanyData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Yangon, Myanmar"
            className="w-full pl-12 pr-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Website (optional)
        </label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={companyData.website}
            onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourcompany.com"
            className="w-full pl-12 pr-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Hiring Timeline
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">When are you hiring?</h1>
        <p className="text-xl text-gray-500">This helps us prioritize your job posts</p>
      </div>

      {/* Hiring Urgency */}
      <div className="grid grid-cols-2 gap-4">
        {hiringOptions.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setCompanyData(prev => ({ ...prev, hiringUrgency: option.value }))}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                companyData.hiringUrgency === option.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-4 ${
                companyData.hiringUrgency === option.value ? 'text-white' : 'text-gray-600'
              }`} />
              <div className="text-lg font-semibold mb-1">{option.label}</div>
              <div className={`text-sm ${
                companyData.hiringUrgency === option.value ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {option.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Number of roles */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          How many roles are you looking to fill?
        </label>
        <div className="flex gap-3">
          {['1', '2-5', '6-10', '10+'].map(count => (
            <button
              key={count}
              onClick={() => setCompanyData(prev => ({ ...prev, rolesCount: count }))}
              className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                companyData.rolesCount === count
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {count} {count === '1' ? 'role' : 'roles'}
            </button>
          ))}
        </div>
      </div>

      {/* Company Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Tell candidates about your company (optional)
        </label>
        <textarea
          value={companyData.description}
          onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What makes your company a great place to work?"
          rows={4}
          className="w-full px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors resize-none"
        />
      </div>
    </motion.div>
  );

  // Step 3: Complete
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <h1 className="text-4xl font-bold tracking-tight mb-4">You're all set!</h1>
      <p className="text-xl text-gray-500 mb-12 max-w-md mx-auto">
        Your employer account is ready. Start posting jobs and find the perfect candidates.
      </p>

      {/* Company Preview Card */}
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 mb-12 text-left">
        <div className="flex items-center gap-4 mb-4">
          {companyData.logoPreview ? (
            <img 
              src={companyData.logoPreview} 
              alt={companyData.companyName}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{companyData.companyName}</h3>
            <p className="text-gray-500">{companyData.industry}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
            {companyData.companySize} employees
          </span>
          {companyData.location && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {companyData.location}
            </span>
          )}
        </div>
      </div>

      {/* What's Next */}
      <div className="max-w-lg mx-auto">
        <h3 className="text-lg font-semibold mb-4">What's next?</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-blue-50 rounded-xl">
            <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Post your first job</div>
            <div className="text-sm text-gray-500">Reach thousands of candidates</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Browse talent</div>
            <div className="text-sm text-gray-500">Explore candidate profiles</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          {step > 1 && step < 3 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-8 py-4 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className={`ml-auto px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all ${
                canProceed()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="mx-auto px-12 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Go to Employer Dashboard
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployerOnboarding;
