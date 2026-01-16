import React, { useState } from 'react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import {
  Wallet,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Filter,
  Search,
  Building2,
  Briefcase,
  Star,
  Shield,
  Zap,
  Crown,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Trash2,
  Edit3,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Send,
  RefreshCw,
  Lock,
  Unlock,
  X,
  Check
} from 'lucide-react';

// Premium Subscription Modal
const PremiumModal = ({ isOpen, onClose, currentPlan, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '5 job applications/month',
        'Basic profile',
        'Community access',
        'Job alerts'
      ],
      limitations: [
        'Limited visibility',
        'No priority support',
        'Ads displayed'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 15000, yearly: 150000 },
      popular: true,
      features: [
        'Unlimited applications',
        'Featured profile badge',
        'Priority in search results',
        'Advanced analytics',
        'No ads',
        'Resume builder',
        'Direct messaging'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: { monthly: 50000, yearly: 500000 },
      features: [
        'Everything in Pro',
        '10 job postings/month',
        'Applicant tracking system',
        'Team collaboration',
        'API access',
        'Dedicated support',
        'Custom branding'
      ]
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `${(price / 1000).toFixed(0)}K MMK`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
              <p className="text-gray-600">Unlock all features and boost your career</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-white shadow text-black' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'yearly' ? 'bg-white shadow text-black' : 'text-gray-600'
                }`}
              >
                Yearly <span className="text-green-600 text-sm ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${currentPlan === plan.id ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                {currentPlan === plan.id && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    Current
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(plan.price[billingCycle])}</span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-full font-medium hover:bg-gray-50"
            >
              Maybe Later
            </button>
            <button
              onClick={() => onUpgrade(selectedPlan, billingCycle)}
              disabled={currentPlan === selectedPlan}
              className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentPlan === selectedPlan ? 'Current Plan' : 'Upgrade Now'}
              {currentPlan !== selectedPlan && <ArrowUpRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Payment Method Modal
const AddPaymentMethodModal = ({ isOpen, onClose, onAdd }) => {
  const [methodType, setMethodType] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [mobileData, setMobileData] = useState({
    provider: 'kpay',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (methodType === 'card') {
      onAdd({
        type: 'card',
        last4: cardData.number.slice(-4),
        brand: 'Visa',
        expiry: cardData.expiry,
        name: cardData.name
      });
    } else {
      onAdd({
        type: 'mobile',
        provider: mobileData.provider,
        phone: mobileData.phone
      });
    }
    onClose();
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

          <h2 className="text-2xl font-bold mb-6">Add Payment Method</h2>

          {/* Method Type Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMethodType('card')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                methodType === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Card</div>
            </button>
            <button
              onClick={() => setMethodType('mobile')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                methodType === 'mobile' ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Mobile Wallet</div>
            </button>
          </div>

          {methodType === 'card' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {['kpay', 'wavepay', 'cbpay'].map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setMobileData({ ...mobileData, provider })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mobileData.provider === provider ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{provider}</div>
                  </button>
                ))}
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={mobileData.phone}
                onChange={(e) => setMobileData({ ...mobileData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800"
          >
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

// Freelance Payment Modal
const FreelancePaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    recipientName: '',
    recipientEmail: '',
    amount: '',
    description: '',
    projectName: '',
    milestones: [{ name: 'Initial Milestone', amount: '', status: 'pending' }],
    useEscrow: true
  });

  if (!isOpen) return null;

  const addMilestone = () => {
    setPaymentData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { name: '', amount: '', status: 'pending' }]
    }));
  };

  const updateMilestone = (index, field, value) => {
    setPaymentData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };

  const removeMilestone = (index) => {
    if (paymentData.milestones.length <= 1) return;
    setPaymentData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const totalAmount = paymentData.milestones.reduce((sum, m) => sum + (parseInt(m.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Send Freelance Payment</h2>
          <p className="text-gray-600">Pay securely with escrow protection</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Project Name</label>
                <input
                  type="text"
                  value={paymentData.projectName}
                  onChange={(e) => setPaymentData({ ...paymentData, projectName: e.target.value })}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={paymentData.recipientName}
                    onChange={(e) => setPaymentData({ ...paymentData, recipientName: e.target.value })}
                    placeholder="Freelancer name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={paymentData.recipientEmail}
                    onChange={(e) => setPaymentData({ ...paymentData, recipientEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={paymentData.description}
                  onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                  placeholder="Payment details and work description..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black resize-none"
                />
              </div>

              {/* Escrow Toggle */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold">Escrow Protection</div>
                    <div className="text-sm text-gray-600">Funds held until work is approved</div>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentData(prev => ({ ...prev, useEscrow: !prev.useEscrow }))}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    paymentData.useEscrow ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    paymentData.useEscrow ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!paymentData.projectName || !paymentData.recipientName}
                className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                Continue to Milestones
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Payment Milestones</h3>
                <button
                  onClick={addMilestone}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {paymentData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Milestone {index + 1}</span>
                      {paymentData.milestones.length > 1 && (
                        <button onClick={() => removeMilestone(index)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                        placeholder="Milestone name"
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-black"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                          placeholder="Amount"
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-black pr-16"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">MMK</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">{totalAmount.toLocaleString()} MMK</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-full font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    onSubmit({ ...paymentData, totalAmount });
                    onClose();
                  }}
                  disabled={totalAmount === 0}
                  className="flex-1 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentsPage = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showFreelanceModal, setShowFreelanceModal] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');

  const [wallet, setWallet] = useState({
    balance: 250000,
    pending: 150000,
    escrow: 500000,
    currency: 'MMK'
  });

  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active',
    nextBilling: null
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: 2, type: 'mobile', provider: 'kpay', phone: '09123456789', isDefault: false }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'incoming',
      amount: 150000,
      description: 'Payment for Website Design',
      from: 'TechStart Myanmar',
      date: '2025-01-14',
      status: 'completed',
      category: 'freelance'
    },
    {
      id: 2,
      type: 'outgoing',
      amount: 15000,
      description: 'Pro Subscription - Monthly',
      to: 'JobX Premium',
      date: '2025-01-10',
      status: 'completed',
      category: 'subscription'
    },
    {
      id: 3,
      type: 'outgoing',
      amount: 25000,
      description: 'Featured Job Posting - Frontend Developer',
      to: 'JobX',
      date: '2025-01-08',
      status: 'completed',
      category: 'job_posting'
    },
    {
      id: 4,
      type: 'incoming',
      amount: 500000,
      description: 'Mobile App Development - Milestone 2',
      from: 'Digital Solutions',
      date: '2025-01-05',
      status: 'escrow',
      category: 'freelance'
    },
    {
      id: 5,
      type: 'outgoing',
      amount: 50000,
      description: 'Freelance Payment - Logo Design',
      to: 'Thiri Win',
      date: '2025-01-03',
      status: 'pending',
      category: 'freelance'
    }
  ]);

  const [freelanceProjects, setFreelanceProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Website',
      client: 'Fashion Store MM',
      totalAmount: 800000,
      paidAmount: 400000,
      status: 'in_progress',
      milestones: [
        { name: 'Design', amount: 200000, status: 'released' },
        { name: 'Frontend', amount: 200000, status: 'released' },
        { name: 'Backend', amount: 200000, status: 'escrow' },
        { name: 'Testing', amount: 200000, status: 'pending' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App UI',
      client: 'StartupXYZ',
      totalAmount: 500000,
      paidAmount: 500000,
      status: 'completed',
      milestones: [
        { name: 'Wireframes', amount: 150000, status: 'released' },
        { name: 'UI Design', amount: 200000, status: 'released' },
        { name: 'Prototyping', amount: 150000, status: 'released' }
      ]
    }
  ]);

  const filteredTransactions = transactions.filter(t => 
    transactionFilter === 'all' || t.category === transactionFilter
  );

  const formatCurrency = (amount) => {
    return `${(amount / 1000).toFixed(0)}K MMK`;
  };

  const handleUpgrade = (plan, cycle) => {
    setSubscription({ plan, status: 'active', nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
    setShowPremiumModal(false);
    // Simulate transaction
    setTransactions(prev => [{
      id: Date.now(),
      type: 'outgoing',
      amount: plan === 'pro' ? (cycle === 'monthly' ? 15000 : 150000) : (cycle === 'monthly' ? 50000 : 500000),
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription - ${cycle}`,
      to: 'JobX Premium',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      category: 'subscription'
    }, ...prev]);
  };

  const handleAddPaymentMethod = (method) => {
    setPaymentMethods(prev => [...prev, { ...method, id: Date.now(), isDefault: false }]);
  };

  const handleFreelancePayment = (data) => {
    setTransactions(prev => [{
      id: Date.now(),
      type: 'outgoing',
      amount: data.totalAmount,
      description: `${data.projectName} - Freelance Payment`,
      to: data.recipientName,
      date: new Date().toISOString().split('T')[0],
      status: data.useEscrow ? 'escrow' : 'pending',
      category: 'freelance'
    }, ...prev]);
    if (data.useEscrow) {
      setWallet(prev => ({ ...prev, escrow: prev.escrow + data.totalAmount }));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'freelance', label: 'Freelance', icon: Briefcase },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'methods', label: 'Payment Methods', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="payments"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Payments</h1>
            <p className="text-xl text-gray-600">Manage your wallet, subscriptions, and transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFreelanceModal(true)}
              className="px-6 py-3 border border-gray-200 rounded-full font-medium hover:bg-white transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Payment
            </button>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-1 flex gap-1 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(wallet.balance)}</div>
                <div className="text-sm opacity-80">Current Balance</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                </div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(wallet.pending)}</div>
                <div className="text-sm text-gray-500">Pending Payments</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-green-500" />
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Protected</span>
                </div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(wallet.escrow)}</div>
                <div className="text-sm text-gray-500">In Escrow</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">This Month</span>
                </div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(650000)}</div>
                <div className="text-sm text-gray-500">Total Earned</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-black mb-3" />
                <div className="font-semibold">Add Funds</div>
                <div className="text-sm text-gray-500">Top up wallet</div>
              </button>
              <button
                onClick={() => setShowFreelanceModal(true)}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <Send className="w-8 h-8 text-gray-400 group-hover:text-black mb-3" />
                <div className="font-semibold">Send Payment</div>
                <div className="text-sm text-gray-500">Pay freelancers</div>
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-black mb-3" />
                <div className="font-semibold">View History</div>
                <div className="text-sm text-gray-500">All transactions</div>
              </button>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all text-left group"
              >
                <Crown className="w-8 h-8 text-amber-500 mb-3" />
                <div className="font-semibold">Go Premium</div>
                <div className="text-sm text-gray-500">Unlock features</div>
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'incoming' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {tx.type === 'incoming' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-sm text-gray-500">
                          {tx.type === 'incoming' ? `From ${tx.from}` : `To ${tx.to}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.type === 'incoming' ? 'text-green-600' : ''}`}>
                        {tx.type === 'incoming' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                      <div className="text-sm text-gray-500">{tx.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-gray-200">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>
                <select
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                >
                  <option value="all">All Types</option>
                  <option value="freelance">Freelance</option>
                  <option value="subscription">Subscription</option>
                  <option value="job_posting">Job Posting</option>
                </select>
                <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        tx.type === 'incoming' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {tx.type === 'incoming' ? (
                          <ArrowDownLeft className="w-6 h-6 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{tx.description}</div>
                        <div className="text-sm text-gray-500">
                          {tx.type === 'incoming' ? `From ${tx.from}` : `To ${tx.to}`} • {tx.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        tx.status === 'escrow' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                      <div className={`text-xl font-semibold ${tx.type === 'incoming' ? 'text-green-600' : ''}`}>
                        {tx.type === 'incoming' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Freelance Tab */}
        {activeTab === 'freelance' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowFreelanceModal(true)}
                className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Payment
              </button>
            </div>

            {freelanceProjects.map(project => (
              <div key={project.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      <p className="text-gray-500">Client: {project.client}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-lg font-semibold">{formatCurrency(project.totalAmount)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Paid</div>
                      <div className="text-lg font-semibold text-green-600">{formatCurrency(project.paidAmount)}</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(project.paidAmount / project.totalAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-4">MILESTONES</h4>
                  <div className="space-y-3">
                    {project.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === 'released' ? 'bg-green-100' :
                            milestone.status === 'escrow' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {milestone.status === 'released' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : milestone.status === 'escrow' ? (
                              <Lock className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium">{milestone.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm ${
                            milestone.status === 'released' ? 'text-green-600' :
                            milestone.status === 'escrow' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {milestone.status === 'released' ? 'Released' :
                             milestone.status === 'escrow' ? 'In Escrow' : 'Pending'}
                          </span>
                          <span className="font-semibold">{formatCurrency(milestone.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    subscription.plan === 'free' ? 'bg-gray-100' :
                    subscription.plan === 'pro' ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                    'bg-gradient-to-br from-amber-400 to-orange-500'
                  }`}>
                    <Crown className={`w-8 h-8 ${subscription.plan === 'free' ? 'text-gray-400' : 'text-white'}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan</h2>
                    <p className="text-gray-600">
                      {subscription.plan === 'free' ? 'Basic features included' : 'All premium features unlocked'}
                    </p>
                  </div>
                </div>

                {subscription.plan !== 'free' && (
                  <div className="p-4 bg-gray-50 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Next billing date</div>
                        <div className="font-medium">{subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <button className="text-sm text-gray-500 hover:text-black">Manage billing</button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  {subscription.plan === 'free' ? 'Upgrade to Premium' : 'Change Plan'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold mb-4">Your Benefits</h3>
                <ul className="space-y-3">
                  {subscription.plan === 'free' ? (
                    <>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> 5 applications/month</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Basic profile</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Community access</li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Unlimited applications</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Featured badge</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Priority support</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> Advanced analytics</li>
                      <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> No ads</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Payment Method
            </button>

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      method.type === 'card' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {method.type === 'card' ? (
                        <CreditCard className="w-7 h-7 text-blue-600" />
                      ) : (
                        <Wallet className="w-7 h-7 text-green-600" />
                      )}
                    </div>
                    <div>
                      {method.type === 'card' ? (
                        <>
                          <div className="font-semibold">{method.brand} •••• {method.last4}</div>
                          <div className="text-sm text-gray-500">Expires {method.expiry}</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold capitalize">{method.provider}</div>
                          <div className="text-sm text-gray-500">{method.phone}</div>
                        </>
                      )}
                    </div>
                    {method.isDefault && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Default</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === method.id })))}
                        className="px-4 py-2 text-sm text-gray-500 hover:text-black"
                      >
                        Set Default
                      </button>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        currentPlan={subscription.plan}
        onUpgrade={handleUpgrade}
      />
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onAdd={handleAddPaymentMethod}
      />
      <FreelancePaymentModal
        isOpen={showFreelanceModal}
        onClose={() => setShowFreelanceModal(false)}
        onSubmit={handleFreelancePayment}
      />
    </div>
  );
};

export default PaymentsPage;
