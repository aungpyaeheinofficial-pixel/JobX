import React, { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Mail, Lock, User, MapPin, Briefcase, Target, CheckCircle2, Eye, EyeOff, Search, Zap, Building2, Calendar, Users } from 'lucide-react';
import api from './src/services/api.js';

// Apple-style smooth Input Field
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name, showPassword, onTogglePassword }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div
        className={`relative flex items-center gap-4 px-6 py-4 bg-white border-2 rounded-2xl transition-all duration-200 ${
          isFocused
            ? 'border-black shadow-sm'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-black' : 'text-gray-400'
          }`}
          strokeWidth={2}
        />
        {type === 'password' ? (
          <>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              name={name}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent border-0 outline-none shadow-none ring-0 focus:ring-0 focus:outline-none focus:shadow-none text-lg font-medium placeholder:text-gray-400 placeholder:font-normal"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-gray-400 hover:text-black transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent border-0 outline-none shadow-none ring-0 focus:ring-0 focus:outline-none focus:shadow-none text-lg font-medium placeholder:text-gray-400 placeholder:font-normal"
          />
        )}
      </div>
    );
  };

const JobXAuth = ({ onBack, onAuthComplete }) => {
  const [currentPage, setCurrentPage] = useState('signup'); // signup, login, reset, onboarding
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    role: 'job_seeker', // Always default to job_seeker, no selection needed
    industries: [],
    skills: [],
    goal: ''
  });

  // Industry options
  const industries = [
    'Technology', 'Business', 'Construction',
    'Architecture', 'Design', 'Real Estate', 'Production'
  ];

  // Skill options
  const skills = [
    'Web Development', 'Mobile Development', 'UI/UX Design',
    'Project Management', 'Marketing', 'Architecture Design',
    'Construction Management', 'Graphic Design', 'Data Analysis',
    'Business Strategy', 'Real Estate Development', 'Video Production'
  ];

  // Company size options
  const companySizes = [
    { id: 'solo', label: 'Just me', icon: '👤' },
    { id: 'small', label: '2-10 people', icon: '👥' },
    { id: 'medium', label: '11-50 people', icon: '🏢' },
    { id: 'large', label: '51-200 people', icon: '🏛️' },
    { id: 'enterprise', label: '201+ people', icon: '🌐' }
  ];

  // Memoize toggle password handler
  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const SelectableChip = ({ label, isSelected, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="px-5 py-3 rounded-full border transition-all duration-300"
        style={{
          backgroundColor: isSelected ? '#000000' : '#ffffff',
          color: isSelected ? '#ffffff' : '#000000',
          borderColor: isSelected ? '#000000' : '#e5e7eb',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {label}
      </button>
    );
  };

  const signUpPage = (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Create Account</h1>
        <p className="text-xl text-gray-500">Start your builder journey</p>
      </div>

      <form autoComplete="off" className="space-y-4 mb-6">
        <InputField
          icon={User}
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
          name="name"
        />
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
          name="email"
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
          name="password"
          showPassword={showPassword}
          onTogglePassword={togglePassword}
        />
      </form>

      <button
        onClick={() => setCurrentPage('onboarding')}
        className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group mb-6"
      >
        Continue
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      <button className="w-full py-4 bg-white border border-gray-200 rounded-full font-medium hover:border-gray-300 hover:shadow-sm transition-all duration-300 mb-8">
        Continue with Google
      </button>

      <p className="text-center text-gray-500">
        Already have an account?{' '}
        <button
          onClick={() => setCurrentPage('login')}
          className="text-black font-medium hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );

  const loginPage = (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
        <p className="text-xl text-gray-500">Continue building your future</p>
      </div>

      <form autoComplete="off" className="space-y-4 mb-6">
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
          name="email"
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
          name="password"
          showPassword={showPassword}
          onTogglePassword={togglePassword}
        />
      </form>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setCurrentPage('reset')}
          className="text-gray-500 hover:text-black transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <button 
        onClick={async () => {
          if (formData.email && formData.password) {
            try {
              const response = await api.auth.login(formData.email, formData.password);
              if (onAuthComplete) {
                onAuthComplete(response.user);
              }
            } catch (error) {
              alert(error.message || 'Login failed. Please check your credentials.');
            }
          }
        }}
        className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group mb-6"
      >
        Log In
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      <button className="w-full py-4 bg-white border border-gray-200 rounded-full font-medium hover:border-gray-300 hover:shadow-sm transition-all duration-300 mb-8">
        Continue with Google
      </button>

      <p className="text-center text-gray-500">
        Don't have an account?{' '}
        <button
          onClick={() => setCurrentPage('signup')}
          className="text-black font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );

  const resetPasswordPage = (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setCurrentPage('login')}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to login
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Reset Password</h1>
        <p className="text-xl text-gray-500">
          Enter your email and we'll send you instructions
        </p>
      </div>

      <form autoComplete="off" className="space-y-4 mb-6">
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
          name="email"
        />
      </form>

      <button className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 mb-6">
        Send Reset Link
      </button>
    </div>
  );

  // Step 1: Industries (no role selection)
  const onboardingStep1 = (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-sm text-gray-500 mb-4">Step 1 of 3</div>
        <h1 className="text-5xl font-bold mb-4">Choose Your Industries</h1>
        <p className="text-xl text-gray-500">
          Select the fields you're interested in or working in
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {industries.map((industry) => (
          <SelectableChip
            key={industry}
            label={industry}
            isSelected={formData.industries.includes(industry)}
            onClick={() => {
              setFormData(prev => {
                if (prev.industries.includes(industry)) {
                  return {
                    ...prev,
                    industries: prev.industries.filter(i => i !== industry)
                  };
              } else {
                  return {
                    ...prev,
                    industries: [...prev.industries, industry]
                  };
              }
              });
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setOnboardingStep(2)}
        disabled={formData.industries.length === 0}
        className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  // Step 2: Skills
  const onboardingStep2 = (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={() => setOnboardingStep(1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-12">
        <div className="text-sm text-gray-500 mb-4">Step 2 of 3</div>
        <h1 className="text-5xl font-bold mb-4">Select Your Skills</h1>
        <p className="text-xl text-gray-500">
          What can you do or what do you want to learn?
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {skills.map((skill) => (
          <SelectableChip
            key={skill}
            label={skill}
            isSelected={formData.skills.includes(skill)}
            onClick={() => {
              setFormData(prev => {
                if (prev.skills.includes(skill)) {
                  return {
                    ...prev,
                    skills: prev.skills.filter(s => s !== skill)
                  };
              } else {
                  return {
                    ...prev,
                    skills: [...prev.skills, skill]
                  };
              }
              });
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setOnboardingStep(3)}
        disabled={formData.skills.length === 0}
        className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  // Step 3: Goal
  const onboardingStep3 = (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={() => setOnboardingStep(2)}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-12">
        <div className="text-sm text-gray-500 mb-4">Step 3 of 3</div>
        <h1 className="text-5xl font-bold mb-4">What Do You Want to Build?</h1>
        <p className="text-xl text-gray-500">
          Share your goals with the community
        </p>
      </div>

      <div className="mb-6">
        <textarea
          value={formData.goal}
          onChange={(e) => setFormData(prev => ({...prev, goal: e.target.value}))}
          placeholder="I want to build..."
          rows={6}
          className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-black transition-all duration-200 resize-none text-lg font-medium placeholder:text-gray-400 placeholder:font-normal shadow-none ring-0 focus:ring-0 focus:outline-none focus:shadow-none"
        />
      </div>

      <div className="mb-6">
        <InputField
          icon={MapPin}
          type="text"
          placeholder="City (e.g., Yangon, Mandalay)"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
          name="location"
        />
      </div>

      <button
        onClick={async () => {
          if (!formData.goal || !formData.location) return;
          
          try {
            // Register user with backend
            const response = await api.auth.register({
              email: formData.email,
              password: formData.password,
              name: formData.name,
              location: formData.location,
              industries: formData.industries,
              skills: formData.skills,
              goal: formData.goal
            });
            
            if (onAuthComplete) {
              onAuthComplete(response.user);
            }
          } catch (error) {
            alert(error.message || 'Registration failed. Please try again.');
          }
        }}
        disabled={!formData.goal || !formData.location}
        className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Setup
        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand/20 rounded-full blur-3xl opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-8 py-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <button
              onClick={() => {
                setCurrentPage('signup');
                setOnboardingStep(1);
              }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-semibold">JobX</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-20">
          {currentPage === 'signup' && signUpPage}
          {currentPage === 'login' && loginPage}
          {currentPage === 'reset' && resetPasswordPage}
          {currentPage === 'onboarding' && (
            <>
              {onboardingStep === 1 && onboardingStep1}
              {onboardingStep === 2 && onboardingStep2}
              {onboardingStep === 3 && onboardingStep3}
            </>
          )}
        </div>

        {/* Progress Indicator for Onboarding */}
        {currentPage === 'onboarding' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: onboardingStep === step ? '48px' : '24px',
                  backgroundColor: onboardingStep >= step ? '#000000' : '#e5e7eb',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobXAuth;
