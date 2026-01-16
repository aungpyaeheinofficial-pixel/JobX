import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  Zap,
  Crown,
  Eye,
  TrendingUp,
  Clock,
  Users,
  CreditCard,
  Wallet,
  Shield,
  X,
  Building2
} from 'lucide-react';
import { HiringModeHeader } from './EnhancedLiquidNav.jsx';

// Job Posting Tier Card Component
const PostingTierCard = ({ tier, isSelected, onSelect }) => {
  const tiers = {
    free: {
      name: 'Free Job Post',
      price: 0,
      icon: Eye,
      color: 'gray',
      features: [
        'Live for 7 days',
        'Standard visibility',
        'Appears in search results',
        'Limited reach (no boost)'
      ]
    },
    standard: {
      name: 'Standard Job Post',
      price: 15,
      icon: TrendingUp,
      color: 'blue',
      popular: true,
      features: [
        'Live for 30 days',
        'Higher visibility',
        'Appears in search & feed',
        'Employer profile shown',
        'Edit or close anytime'
      ]
    },
    featured: {
      name: 'Featured Job Post',
      price: 39,
      icon: Crown,
      color: 'amber',
      features: [
        'Live for 45 days',
        'Top placement in search & feed',
        'Highlighted "Featured" badge',
        'Recommended to active candidates',
        'Highest applicant response'
      ]
    }
  };

  const config = tiers[tier];
  const Icon = config.icon;

  const colorConfig = {
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-500',
      border: 'border-gray-300',
      hover: 'hover:border-gray-400',
      selected: 'border-gray-600 bg-gray-50 ring-2 ring-gray-400'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-300',
      hover: 'hover:border-blue-400',
      selected: 'border-blue-600 bg-blue-50 ring-2 ring-blue-400'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-300',
      hover: 'hover:border-amber-400',
      selected: 'border-amber-600 bg-amber-50 ring-2 ring-amber-400'
    }
  };

  const colors = colorConfig[config.color];

  return (
    <div
      onClick={onSelect}
      className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all ${
        isSelected ? colors.selected : `${colors.border} ${colors.hover}`
      }`}
    >
      {config.popular && !isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}

      {isSelected && (
        <div className="absolute -top-3 right-6 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${colors.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{config.name}</h3>
          <div className="text-3xl font-bold">
            {config.price === 0 ? '$0' : `$${config.price}`}
          </div>
          {config.price > 0 && <div className="text-sm text-gray-500">per job</div>}
        </div>
      </div>

      <ul className="space-y-3">
        {config.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Payment Modal - Updated for tier pricing
const PaymentModal = ({ isOpen, onClose, tier, amount, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onConfirm();
  };

  const tierNames = {
    free: 'Free',
    standard: 'Standard',
    featured: 'Featured'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
          <p className="text-gray-600 mb-6">
            {tierNames[tier]} Job Posting
          </p>

          {/* Amount */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Job Posting Fee</span>
              <span className="text-3xl font-bold text-blue-600">${amount}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">One-time payment</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-sm text-gray-500">PAYMENT METHOD</h3>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Credit / Debit Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
              </div>
              {paymentMethod === 'card' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
            </button>

            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                paymentMethod === 'mobile' ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Mobile Wallet</div>
                <div className="text-sm text-gray-500">KPay, WavePay, CB Pay</div>
              </div>
              {paymentMethod === 'mobile' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
            </button>

            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                paymentMethod === 'wallet' ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">JobX Wallet</div>
                <div className="text-sm text-gray-500">Balance: 250K MMK</div>
              </div>
              {paymentMethod === 'wallet' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Shield className="w-4 h-4" />
            <span>Secure payment powered by Stripe</span>
          </div>

          {/* CTA */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {(amount / 1000).toFixed(0)}K MMK
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostJob = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Choose Plan, 3: Review
  const [selectedTier, setSelectedTier] = useState('standard');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Get company data from userData (set during onboarding)
  const companyData = userData?.companyData || {};
  
  const [formData, setFormData] = useState({
    title: '',
    company: companyData.companyName || '', // Pre-fill from onboarding
    location: companyData.location || '', // Pre-fill from onboarding
    type: 'Full-time',
    workMode: 'On-site',
    salary: '',
    description: '',
    requirements: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  const tierPrices = {
    free: 0,
    standard: 15,
    featured: 39
  };

  const handleSubmit = () => {
    if (selectedTier === 'free') {
      completePosting();
    } else {
      setShowPaymentModal(true);
    }
  };

  const completePosting = () => {
    alert(`Job posted successfully with ${selectedTier} tier!`);
    onNavigate('opportunities');
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput('');
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Company comes from onboarding, so we don't validate it here
  const isFormValid = formData.title && formData.location && formData.description;

  return (
    <div className="min-h-screen bg-white">
      <HiringModeHeader
        userData={userData}
        userRole={userRole}
        activeTab="employer"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onNavigate('opportunities')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step > 1 ? 'Back' : 'Cancel'}</span>
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${s <= step ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s < step ? 'bg-green-500 text-white' :
                  s === step ? 'bg-black text-white' :
                  'bg-gray-200'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="font-medium hidden sm:inline">
                  {s === 1 ? 'Job Details' : s === 2 ? 'Choose Plan' : 'Review'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Job Details */}
        {step === 1 && (
          <>
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tight mb-4">Post a job</h1>
              <p className="text-xl text-gray-500">
            Share your open position with Myanmar's builder community.
          </p>
        </div>

            <div className="space-y-10">
          {/* Job Title */}
          <div>
                <label className="block text-xl font-semibold mb-3">
                  Job title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Frontend Developer"
                  className="w-full text-lg px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
            />
          </div>

              {/* Company - Display only (from onboarding) */}
              {companyData.companyName && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Posting as
            </label>
                  <div className="flex items-center gap-4">
                    {companyData.logoPreview ? (
                      <img 
                        src={companyData.logoPreview} 
                        alt={companyData.companyName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="text-xl font-bold text-gray-900">{companyData.companyName}</div>
                      <div className="text-sm text-gray-500">{companyData.industry}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('employer')}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Update company profile →
                  </button>
          </div>
              )}

          {/* Location */}
          <div>
                <label className="block text-xl font-semibold mb-3">
                  Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Yangon, Myanmar"
                  className="w-full text-lg px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
            />
          </div>

              {/* Job Type & Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
                  <label className="block text-xl font-semibold mb-3">Job type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Full-time', 'Part-time', 'Freelance', 'Internship'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                        className={`px-5 py-3 rounded-full transition-all ${
                    formData.type === type
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-semibold mb-3">Work mode</label>
                  <div className="flex flex-wrap gap-3">
                    {['On-site', 'Remote', 'Hybrid'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setFormData({ ...formData, workMode: mode })}
                        className={`px-5 py-3 rounded-full transition-all ${
                          formData.workMode === mode
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
            </div>
          </div>

          {/* Salary */}
          <div>
                <label className="block text-xl font-semibold mb-3">Salary range</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="800K - 1.2M MMK per month"
                  className="w-full text-lg px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
            />
          </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xl font-semibold mb-3">Required skills</label>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. React)"
                    className="flex-1 text-lg px-5 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    onClick={addSkill}
                    className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button onClick={() => removeSkill(idx)} className="hover:text-violet-900">
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
          </div>

          {/* Description */}
          <div>
                <label className="block text-xl font-semibold mb-3">
                  Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about this role and what the ideal candidate looks like..."
              rows={6}
                  className="w-full text-lg px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {/* Requirements */}
          <div>
                <label className="block text-xl font-semibold mb-3">Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="What qualifications, experience, or certifications are required?"
                  rows={4}
                  className="w-full text-lg px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors resize-none"
            />
          </div>
        </div>

            {/* Continue Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => setStep(2)}
                disabled={!isFormValid}
                className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Pricing
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Choose Plan */}
        {step === 2 && (
          <>
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tight mb-4">Choose your plan</h1>
              <p className="text-xl text-gray-500">
                Select the best option for your job posting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <PostingTierCard
                tier="free"
                isSelected={selectedTier === 'free'}
                onSelect={() => setSelectedTier('free')}
              />
              <PostingTierCard
                tier="standard"
                isSelected={selectedTier === 'standard'}
                onSelect={() => setSelectedTier('standard')}
              />
              <PostingTierCard
                tier="featured"
                isSelected={selectedTier === 'featured'}
                onSelect={() => setSelectedTier('featured')}
              />
            </div>

            <div className="pt-8 border-t border-gray-200">
              <button
                onClick={() => setStep(3)}
                className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                Continue to Review
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <>
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tight mb-4">Review & Publish</h1>
              <p className="text-xl text-gray-500">
                Review your job posting before publishing
              </p>
            </div>

            {/* Job Summary */}
            <div className="bg-gray-50 rounded-3xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-2">{formData.title}</h2>
              <p className="text-xl text-gray-600 mb-6">
                {companyData.companyName || formData.company} • {formData.location}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-semibold">{formData.type}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500">Work Mode</div>
                  <div className="font-semibold">{formData.workMode}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500">Salary</div>
                  <div className="font-semibold">{formData.salary || 'Not specified'}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500">Plan</div>
                  <div className="font-semibold capitalize">{selectedTier}</div>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Required Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Description</div>
                <p className="text-gray-700">{formData.description}</p>
              </div>

              {formData.requirements && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Requirements</div>
                  <p className="text-gray-700">{formData.requirements}</p>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 capitalize">
                  {selectedTier} Job Posting
                </span>
                <span className="font-semibold text-lg">
                  {tierPrices[selectedTier] === 0 ? 'Free' : `$${tierPrices[selectedTier]}`}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-bold">
                  {tierPrices[selectedTier] === 0 ? '$0' : `$${tierPrices[selectedTier]}`}
                </span>
              </div>
            </div>

            {/* Publish Button */}
          <button
            onClick={handleSubmit}
              className={`w-full py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 ${
                tierPrices[selectedTier] === 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
              }`}
            >
              {tierPrices[selectedTier] === 0 ? (
                <>
                  <Check className="w-5 h-5" />
                  Publish Job (Free)
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ${tierPrices[selectedTier]} & Publish
                </>
              )}
          </button>
            {tierPrices[selectedTier] > 0 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                Secured by Stripe • Full refund within 24 hours
            </p>
          )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tier={selectedTier}
        amount={tierPrices[selectedTier]}
        onConfirm={completePosting}
      />
    </div>
  );
};

export default PostJob;
