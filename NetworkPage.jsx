import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  UserPlus,
  UserCheck,
  MessageSquare,
  MapPin,
  Briefcase,
  Link2,
  Filter,
  X,
  Check,
  ChevronDown,
  Building,
  GraduationCap,
  Star,
  TrendingUp,
  Eye,
  Mail,
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import { useToast } from './ToastContext.jsx';
import { PremiumButton, IconButton } from './PremiumComponents.jsx';

// Sample network data
const allPeople = [
  {
    id: 1,
    name: 'Aung Kyaw Moe',
    title: 'Senior Software Engineer',
    company: 'TechStartup Myanmar',
    location: 'Yangon',
    initials: 'AM',
    mutual: 12,
    skills: ['React', 'Node.js', 'TypeScript'],
    isConnected: false,
    isPending: false,
    industry: 'Technology',
    profileViews: 234,
    isVerified: true,
  },
  {
    id: 2,
    name: 'May Thu Zar',
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Mandalay',
    initials: 'MT',
    mutual: 8,
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    isConnected: true,
    isPending: false,
    industry: 'Design',
    profileViews: 189,
    isVerified: true,
  },
  {
    id: 3,
    name: 'Ko Zaw Lin',
    title: 'Architect',
    company: 'Yangon Architects',
    location: 'Yangon',
    initials: 'ZL',
    mutual: 5,
    skills: ['AutoCAD', 'Revit', 'Sustainable Design'],
    isConnected: false,
    isPending: true,
    industry: 'Architecture',
    profileViews: 156,
    isVerified: false,
  },
  {
    id: 4,
    name: 'Hnin Ei Phyu',
    title: 'Marketing Manager',
    company: 'GrowthLab',
    location: 'Yangon',
    initials: 'HE',
    mutual: 15,
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    isConnected: false,
    isPending: false,
    industry: 'Business',
    profileViews: 278,
    isVerified: true,
  },
  {
    id: 5,
    name: 'Pyae Phyo Aung',
    title: 'Construction Manager',
    company: 'BuildRight Construction',
    location: 'Naypyidaw',
    initials: 'PA',
    mutual: 3,
    skills: ['Project Management', 'Safety', 'Budgeting'],
    isConnected: false,
    isPending: false,
    industry: 'Construction',
    profileViews: 98,
    isVerified: false,
  },
  {
    id: 6,
    name: 'Su Su Hlaing',
    title: 'Data Scientist',
    company: 'AI Myanmar',
    location: 'Yangon',
    initials: 'SH',
    mutual: 7,
    skills: ['Python', 'Machine Learning', 'SQL'],
    isConnected: true,
    isPending: false,
    industry: 'Technology',
    profileViews: 312,
    isVerified: true,
  },
  {
    id: 7,
    name: 'Thura Aung',
    title: 'Real Estate Developer',
    company: 'Premium Estates',
    location: 'Mandalay',
    initials: 'TA',
    mutual: 4,
    skills: ['Property Development', 'Investment', 'Negotiation'],
    isConnected: false,
    isPending: false,
    industry: 'Real Estate',
    profileViews: 145,
    isVerified: false,
  },
  {
    id: 8,
    name: 'Wai Yan Min',
    title: 'Video Producer',
    company: 'Creative Studios',
    location: 'Yangon',
    initials: 'WY',
    mutual: 6,
    skills: ['Video Editing', 'Motion Graphics', 'Storytelling'],
    isConnected: false,
    isPending: false,
    industry: 'Production',
    profileViews: 167,
    isVerified: false,
  },
];

// Connection requests
const connectionRequests = [
  {
    id: 101,
    name: 'Myo Min Htet',
    title: 'Frontend Developer',
    company: 'WebDev Co',
    location: 'Yangon',
    initials: 'MM',
    mutual: 4,
    message: 'Hi! I saw your work on the e-commerce project. Would love to connect!',
  },
  {
    id: 102,
    name: 'Aye Chan',
    title: 'UI Designer',
    company: 'Freelance',
    location: 'Mandalay',
    initials: 'AC',
    mutual: 2,
    message: null,
  },
];

// Person Card Component - Apple-style hover
const PersonCard = ({ person, onConnect, onMessage, onViewProfile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
    >
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" />
      
      {/* Content */}
      <div className="px-5 pb-5 relative">
        {/* Avatar */}
        <div className="-mt-10 mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
            {person.initials}
          </div>
        </div>

        {/* Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{person.name}</h3>
            {person.isVerified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{person.title}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Building className="w-3.5 h-3.5" />
            {person.company}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {person.location}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {person.skills.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Mutual */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {person.mutual} mutual connections
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {person.isConnected ? (
            <>
              <button
                onClick={() => onMessage(person)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <UserCheck className="w-5 h-5 text-green-600" />
              </button>
            </>
          ) : person.isPending ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-medium text-sm cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4" />
              Pending
            </button>
          ) : (
            <button
              onClick={() => onConnect(person)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-900 text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-900 hover:text-white transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Connect
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Connection Request Card
const RequestCard = ({ request, onAccept, onIgnore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
        {request.initials}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900">{request.name}</h4>
        <p className="text-sm text-gray-600">{request.title} at {request.company}</p>
        <p className="text-xs text-gray-400 mt-1">{request.mutual} mutual connections</p>
        {request.message && (
          <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2 italic">
            "{request.message}"
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onAccept(request)}
            className="px-5 h-9 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => onIgnore(request)}
            className="text-sm text-gray-500 font-medium hover:underline hover:text-gray-700 transition-colors"
          >
            Ignore
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card - Apple-style with subtle hierarchy
const StatsCard = ({ icon: Icon, label, value, trend, color, isPrimary }) => {
  const cardClasses = isPrimary
    ? "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
    : "bg-gray-50 rounded-2xl border border-gray-100 p-5";

  const iconSize = isPrimary ? "w-12 h-12" : "w-10 h-10";
  const iconClasses = isPrimary ? "w-6 h-6" : "w-5 h-5";

  return (
    <motion.div
      className={cardClasses}
      initial={isPrimary ? { opacity: 0, y: 6 } : {}}
      animate={isPrimary ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconSize} rounded-xl ${color} flex items-center justify-center`}>
          <Icon className={`${iconClasses} text-white`} />
        </div>
        {trend && (
          <motion.span
            className="text-xs text-green-600 font-medium flex items-center gap-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.22 }}
          >
            <TrendingUp className="w-3 h-3" />
            {trend}
          </motion.span>
        )}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </motion.div>
  );
};

// Main Network Page
const NetworkPage = ({ userData, userRole, onNavigate, onLogout, onOpenMessages }) => {
  const { showSuccess, showInfo } = useToast();
  const [people, setPeople] = useState(allPeople);
  const [requests, setRequests] = useState(connectionRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [connectionFilter, setConnectionFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const industries = ['all', 'Technology', 'Design', 'Architecture', 'Business', 'Construction', 'Real Estate', 'Production'];

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      // Search
      const matchesSearch = searchQuery === '' ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Industry
      const matchesIndustry = industryFilter === 'all' || person.industry === industryFilter;

      // Connection status
      const matchesConnection = connectionFilter === 'all' ||
        (connectionFilter === 'connected' && person.isConnected) ||
        (connectionFilter === 'not-connected' && !person.isConnected);

      return matchesSearch && matchesIndustry && matchesConnection;
    });
  }, [people, searchQuery, industryFilter, connectionFilter]);

  const handleConnect = (person) => {
    setPeople(prev => prev.map(p =>
      p.id === person.id ? { ...p, isPending: true } : p
    ));
    showSuccess(`Connection request sent to ${person.name}!`);
  };

  const handleAcceptRequest = (request) => {
    setRequests(prev => prev.filter(r => r.id !== request.id));
    // Add to connections...
  };

  const handleIgnoreRequest = (request) => {
    setRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const connectedCount = people.filter(p => p.isConnected).length;
  const pendingCount = people.filter(p => p.isPending).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="network"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Network</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Grow your professional network in Myanmar</p>
        </div>

        {/* Stats - Apple-style hierarchy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Eye}
            label="Profile Views"
            value="127"
            trend="+12%"
            color="bg-green-500"
            isPrimary={true}
          />
          <StatsCard
            icon={Users}
            label="Connections"
            value={connectedCount}
            color="bg-gray-600"
          />
          <StatsCard
            icon={UserPlus}
            label="Pending"
            value={requests.length}
            color="bg-gray-600"
          />
          <StatsCard
            icon={Mail}
            label="Invitations Sent"
            value={pendingCount}
            color="bg-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <section className="lg:col-span-8">
            {/* Connection Requests */}
            {requests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-gray-400" />
                  Connection Requests
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    {requests.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {requests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onAccept={handleAcceptRequest}
                        onIgnore={handleIgnoreRequest}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Search & Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, title, company, or skills..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-medium text-sm transition-colors ${
                    showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Industry Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                          <div className="flex flex-wrap gap-2">
                            {industries.map(industry => (
                              <button
                                key={industry}
                                onClick={() => setIndustryFilter(industry)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  industryFilter === industry
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {industry === 'all' ? 'All Industries' : industry}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Connection Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Connection Status</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'all', label: 'All' },
                              { id: 'connected', label: 'Connected' },
                              { id: 'not-connected', label: 'Not Connected' },
                            ].map(option => (
                              <button
                                key={option.id}
                                onClick={() => setConnectionFilter(option.id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  connectionFilter === option.id
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* People Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                People You May Know
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredPeople.length} results)
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPeople.map(person => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onConnect={handleConnect}
                    onMessage={() => onOpenMessages()}
                    onViewProfile={() => {}}
                  />
                ))}
              </div>

              {filteredPeople.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Grow Your Network */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Grow Your Network</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Add your education</p>
                      <p className="text-gray-500">Connect with alumni</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Add work experience</p>
                      <p className="text-gray-500">Find former colleagues</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Add your skills</p>
                      <p className="text-gray-500">Get endorsed by others</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Industries to Explore */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Explore Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {industries.slice(1).map(industry => (
                    <button
                      key={industry}
                      onClick={() => setIndustryFilter(industry)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              {/* My Groups */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  My Groups
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Technology', members: 250, icon: '💻' },
                    { name: 'Design', members: 150, icon: '🎨' },
                  ].map((group) => (
                    <div
                      key={group.name}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-lg">{group.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{group.name}</div>
                        <div className="text-xs text-gray-500">{group.members} members</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Discover Groups
                </button>
              </div>

              {/* Premium Promo */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-900">JobX Premium</span>
                </div>
                <p className="text-sm text-amber-800 mb-4">
                  See who viewed your profile and send InMail to anyone
                </p>
                <button
                  onClick={() => onNavigate('premium')}
                  className="w-full py-2.5 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors"
                >
                  Try Premium Free
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NetworkPage;
