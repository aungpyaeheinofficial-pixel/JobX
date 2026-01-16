import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  ArrowRight,
  Search,
  ChevronDown,
  Eye,
  MessageSquare,
  Download,
  User,
  Mail,
  Phone,
  Star,
  MoreHorizontal,
  Filter,
  Users,
  TrendingUp,
  AlertCircle,
  X,
  Check,
  Plus
} from 'lucide-react';
import { HiringModeHeader } from './EnhancedLiquidNav.jsx';
import { useToast } from './ToastContext.jsx';
import { PremiumButton, PremiumCard, PremiumBadge } from './PremiumComponents.jsx';

// Demo data for employer's job postings
const demoJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    location: 'Yangon',
    type: 'Full-time',
    postedAt: '2025-01-10',
    status: 'active',
    applicants: 12
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    location: 'Yangon',
    type: 'Full-time',
    postedAt: '2025-01-08',
    status: 'active',
    applicants: 8
  },
  {
    id: 3,
    title: 'Backend Developer',
    location: 'Remote',
    type: 'Freelance',
    postedAt: '2025-01-05',
    status: 'closed',
    applicants: 15
  }
];

// Demo applicants
const demoApplicants = [
  {
    id: 1,
    jobId: 1,
    name: 'Aung Kyaw',
    email: 'aungkyaw@email.com',
    phone: '+95 9 123 456 789',
    cvFileName: 'AungKyaw_Resume.pdf',
    coverLetter: 'I am excited to apply for the Frontend Developer position. With 3 years of experience in React and TypeScript...',
    appliedAt: '2025-01-12T10:30:00Z',
    status: 'pending',
    skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
    experience: '3 years',
    rating: null
  },
  {
    id: 2,
    jobId: 1,
    name: 'Thiri Win',
    email: 'thiriwin@email.com',
    phone: '+95 9 987 654 321',
    cvFileName: 'ThiriWin_CV.pdf',
    coverLetter: 'As a passionate frontend developer with expertise in modern JavaScript frameworks...',
    appliedAt: '2025-01-11T14:20:00Z',
    status: 'reviewed',
    skills: ['React', 'Vue.js', 'JavaScript', 'Tailwind CSS'],
    experience: '2 years',
    rating: 4
  },
  {
    id: 3,
    jobId: 1,
    name: 'Min Thu',
    email: 'minthu@email.com',
    phone: '+95 9 555 666 777',
    cvFileName: 'MinThu_Resume.pdf',
    coverLetter: 'I believe my strong foundation in web development and problem-solving skills...',
    appliedAt: '2025-01-10T09:15:00Z',
    status: 'interview',
    skills: ['React', 'Angular', 'TypeScript', 'GraphQL'],
    experience: '4 years',
    rating: 5
  },
  {
    id: 4,
    jobId: 2,
    name: 'Phyu Phyu',
    email: 'phyuphyu@email.com',
    phone: '+95 9 111 222 333',
    cvFileName: 'PhyuPhyu_Portfolio.pdf',
    coverLetter: 'With a keen eye for design and user experience, I am eager to contribute...',
    appliedAt: '2025-01-09T16:45:00Z',
    status: 'pending',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
    experience: '2 years',
    rating: null
  },
  {
    id: 5,
    jobId: 2,
    name: 'Zaw Lin',
    email: 'zawlin@email.com',
    phone: '+95 9 444 555 666',
    cvFileName: 'ZawLin_Design_CV.pdf',
    coverLetter: 'I am a creative designer with experience in both web and mobile UI/UX...',
    appliedAt: '2025-01-09T11:30:00Z',
    status: 'accepted',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'Motion Design'],
    experience: '5 years',
    rating: 5
  }
];

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'New' },
    reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Reviewed' },
    interview: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Interview' },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
  };
  const c = config[status] || config.pending;
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

const RatingStars = ({ rating, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange && onChange(star)}
          className={`p-0.5 transition-colors ${onChange ? 'hover:text-yellow-500' : ''}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const EmployerDashboard = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [selectedJobId, setSelectedJobId] = useState(demoJobs[0]?.id || null);
  const [applicants, setApplicants] = useState(demoApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(null);

  const selectedJob = demoJobs.find(j => j.id === selectedJobId);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesJob = app.jobId === selectedJobId;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesSearch = !searchQuery.trim() ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [applicants, selectedJobId, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const jobApplicants = applicants.filter(a => a.jobId === selectedJobId);
    return {
      total: jobApplicants.length,
      new: jobApplicants.filter(a => a.status === 'pending').length,
      interview: jobApplicants.filter(a => a.status === 'interview').length,
      accepted: jobApplicants.filter(a => a.status === 'accepted').length
    };
  }, [applicants, selectedJobId]);

  const updateApplicantStatus = (applicantId, newStatus) => {
    setApplicants(prev => prev.map(app =>
      app.id === applicantId ? { ...app, status: newStatus } : app
    ));
    setShowActionMenu(null);
  };

  const updateApplicantRating = (applicantId, rating) => {
    setApplicants(prev => prev.map(app =>
      app.id === applicantId ? { ...app, rating } : app
    ));
  };

  // Get company data from userData or use defaults
  const companyData = userData?.companyData || {
    companyName: userData?.name ? `${userData.name}'s Company` : 'Your Company',
    industry: 'Technology',
    companySize: '11-50',
    location: 'Yangon, Myanmar',
    logoPreview: null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HiringModeHeader
        userData={userData}
        userRole={userRole}
        activeTab="employer"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      {/* Company Identity Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Company Logo */}
              {companyData.logoPreview ? (
                <img 
                  src={companyData.logoPreview} 
                  alt={companyData.companyName}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              )}
              
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{companyData.companyName}</h2>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Employer Account
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-gray-500">
                  <span>{companyData.industry}</span>
                  <span>•</span>
                  <span>{companyData.companySize} employees</span>
                  {companyData.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {companyData.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Dashboard Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-4">
          <button className="px-4 py-2 bg-black text-white rounded-lg font-medium">
            My Job Posts
          </button>
          <button
            onClick={() => onNavigate('company-profile')}
            className="px-4 py-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            Company Profile
          </button>
          <button
            onClick={() => onNavigate('talent-pool')}
            className="px-4 py-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            Talent Pool
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="px-4 py-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            Settings
          </button>
        </div>

        {/* Job Selector Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 mb-8 flex gap-2 overflow-x-auto">
          {demoJobs.map(job => (
            <button
              key={job.id}
              onClick={() => {
                setSelectedJobId(job.id);
                setSelectedApplicant(null);
              }}
              className={`flex-shrink-0 px-6 py-4 rounded-xl transition-all ${
                selectedJobId === job.id
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="font-semibold">{job.title}</div>
              <div className={`text-sm mt-1 ${selectedJobId === job.id ? 'text-gray-300' : 'text-gray-500'}`}>
                {job.applicants} applicants • {job.status === 'active' ? '🟢 Active' : '⚫ Closed'}
              </div>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <div className="text-gray-600">Total Applicants</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-3xl font-bold text-yellow-600">{stats.new}</span>
            </div>
            <div className="text-gray-600">New / Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">{stats.interview}</span>
            </div>
            <div className="text-gray-600">Interview Stage</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-3xl font-bold text-green-600">{stats.accepted}</span>
            </div>
            <div className="text-gray-600">Accepted</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicants..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicants List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredApplicants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No applicants found</h3>
                <p className="text-gray-500">
                  {stats.total === 0 
                    ? "No one has applied to this position yet."
                    : "Try adjusting your filters."
                  }
                </p>
              </div>
            ) : (
              filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  onClick={() => setSelectedApplicant(applicant)}
                  className={`bg-white rounded-2xl border p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedApplicant?.id === applicant.id
                      ? 'border-black shadow-lg'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold truncate">{applicant.name}</h3>
                        <StatusBadge status={applicant.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          {applicant.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {applicant.experience}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {new Date(applicant.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {applicant.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                            +{applicant.skills.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <RatingStars rating={applicant.rating} />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Download CV action
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download CV"
                          >
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenMessages && onOpenMessages();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Message"
                          >
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionMenu(showActionMenu === applicant.id ? null : applicant.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                            
                            {showActionMenu === applicant.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateApplicantStatus(applicant.id, 'reviewed');
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                                >
                                  <Eye className="w-4 h-4" /> Mark as Reviewed
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateApplicantStatus(applicant.id, 'interview');
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                                >
                                  <Calendar className="w-4 h-4" /> Schedule Interview
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateApplicantStatus(applicant.id, 'accepted');
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-green-600"
                                >
                                  <Check className="w-4 h-4" /> Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateApplicantStatus(applicant.id, 'rejected');
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                                >
                                  <X className="w-4 h-4" /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Applicant Detail Panel */}
          <div className="lg:col-span-1">
            {selectedApplicant ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{selectedApplicant.name}</h3>
                  <p className="text-gray-600">{selectedApplicant.experience} experience</p>
                  <div className="mt-3">
                    <StatusBadge status={selectedApplicant.status} />
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6 text-center">
                  <div className="text-sm text-gray-500 mb-2">Your Rating</div>
                  <div className="flex justify-center">
                    <RatingStars
                      rating={selectedApplicant.rating}
                      onChange={(r) => updateApplicantRating(selectedApplicant.id, r)}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedApplicant.email}`} className="text-blue-600 hover:underline">
                        {selectedApplicant.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplicant.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplicant.coverLetter && (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h4 className="font-semibold mb-4">Cover Letter</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <button className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                  <button
                    onClick={() => onOpenMessages && onOpenMessages()}
                    className="w-full py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                  
                  {selectedApplicant.status !== 'accepted' && selectedApplicant.status !== 'rejected' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => updateApplicantStatus(selectedApplicant.id, 'accepted')}
                        className="py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                        className="py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center sticky top-24">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-2">Select an applicant</h3>
                <p className="text-gray-500 text-sm">
                  Click on an applicant to view their profile and take action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
