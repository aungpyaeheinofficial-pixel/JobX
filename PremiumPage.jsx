import React, { useState } from 'react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import {
  Crown,
  Check,
  X,
  Star,
  Eye,
  Send,
  TrendingUp,
  Users,
  Briefcase,
  Search,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Award,
  BookOpen,
  Target,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Building2,
  UserCheck,
  FileText,
  Lightbulb
} from 'lucide-react';

const PremiumPage = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState('free'); // free or premium

  // Single Premium Plan - Clean & Simple
  const premiumPlan = {
    name: 'JobX Premium',
    price: { monthly: 9.99, yearly: 99 },
    features: [
      {
        category: 'Visibility & Status',
        icon: Star,
        items: [
          'Premium badge on profile',
          'Boosted visibility in Feed, Network, Jobs',
          'Higher ranking in job applications'
        ]
      },
      {
        category: 'Insights',
        icon: Eye,
        items: [
          'See who viewed your profile',
          'Profile performance summary (weekly)'
        ]
      },
      {
        category: 'Networking',
        icon: Users,
        items: [
          'Unlimited profile views',
          '5 InMail messages / month',
          'Unlimited connection requests'
        ]
      },
      {
        category: 'Jobs & Projects',
        icon: Briefcase,
        items: [
          'Priority job applications',
          'Early access to selected jobs/projects',
          'Unlimited project creation',
          'Feature projects in feed'
        ]
      },
      {
        category: 'Experience',
        icon: Zap,
        items: [
          'Faster feed refresh priority',
          'Early access to new features',
          'Beta access (opt-in)'
        ]
      }
    ]
  };

  const testimonials = [
    {
      name: 'Aung Kyaw',
      role: 'Software Engineer at TechStart',
      image: null,
      quote: 'JobX Premium helped me land my dream job in just 2 weeks. The Premium badge really makes a difference!'
    },
    {
      name: 'Thiri Win',
      role: 'Marketing Lead at Digital Myanmar',
      image: null,
      quote: 'Being able to see who viewed my profile and getting priority visibility helped me connect with the right people.'
    }
  ];

  const stats = [
    { value: '2.5x', label: 'more likely to get hired' },
    { value: '5x', label: 'more profile views' },
    { value: '3x', label: 'more interview invites' }
  ];

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const handleSubscribe = () => {
    setCurrentPlan('premium');
    alert('Successfully subscribed to JobX Premium!');
  };

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="premium"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-700 font-medium mb-6">
              <Crown className="w-5 h-5" />
              JobX Premium
            </div>
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              One plan. One decision.
            </h1>
            <p className="text-2xl text-gray-600">
              Everything you need to stand out and get hired faster
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-16 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-amber-600 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Toggle - Enhanced for visibility */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
        <div className="flex flex-col items-center gap-6">
          {/* Heading for clarity */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose your billing cycle</h3>
            <p className="text-lg text-gray-600">Save up to 33% with yearly billing</p>
          </div>

          {/* Enhanced Toggle */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-2 flex shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Yearly
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                billingCycle === 'yearly'
                  ? 'bg-yellow-400 text-green-900'
                  : 'bg-green-100 text-green-700'
              }`}>
                💰 Save 33%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Single Premium Plan */}
      <div className="max-w-5xl mx-auto px-8 pb-20">
        {/* Pricing Card */}
        <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-12 mb-12 shadow-2xl">
          {currentPlan === 'premium' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-green-500 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg">
              <Check className="w-5 h-5" />
              Current Plan
            </div>
          )}

          <div className="text-center text-white mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8" />
              <h2 className="text-4xl font-bold">{premiumPlan.name}</h2>
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-6xl font-bold">
                {formatPrice(premiumPlan.price[billingCycle])}
              </span>
              <span className="text-2xl opacity-90">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>

            {billingCycle === 'yearly' && (
              <p className="text-white/90 text-lg">
                Save $20 per year • Just $8.25/month
              </p>
            )}
          </div>

          {/* Subscribe Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleSubscribe}
              disabled={currentPlan === 'premium'}
              className={`px-16 py-5 rounded-full font-bold text-xl transition-all ${
                currentPlan === 'premium'
                  ? 'bg-white/30 text-white cursor-not-allowed'
                  : 'bg-white text-amber-600 hover:shadow-2xl hover:scale-105'
              }`}
            >
              {currentPlan === 'premium' ? 'Current Plan' : 'Get Premium'}
            </button>
          </div>

          <p className="text-center text-white/80 text-sm">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {premiumPlan.features.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-amber-300 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.category}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Not Included Section */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            What's NOT included (coming later as separate products)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Hiring/Recruiter tools', 'Job posting', 'ATS', 'AI tools', 'Certificates'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <X className="w-4 h-4" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-8 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Success stories from Premium members</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
                <div className="ml-auto">
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <p className="text-gray-700 text-lg italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-8 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>

        <div className="space-y-4">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept Visa, Mastercard, American Express, PayPal, and local payment methods including KPay, WavePay, and CB Pay.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! New members get a 7-day free trial of JobX Premium. Cancel anytime during the trial and you won\'t be charged.'
            },
            {
              q: 'What\'s the difference between monthly and yearly?',
              a: 'Same features, different billing. Yearly saves you $20 per year - that\'s like getting 2 months free!'
            }
          ].map((faq, idx) => (
            <details key={idx} className="group bg-gray-50 rounded-2xl">
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <span className="font-semibold">{faq.q}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-12 text-white">
          <Crown className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Ready to stand out?</h2>
          <p className="text-xl opacity-90 mb-8">
            One simple plan. Everything you need to get hired faster.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-4 bg-white text-amber-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
          >
            Get Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
