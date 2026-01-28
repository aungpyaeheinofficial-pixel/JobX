import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from './src/services/api.js';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  TrendingUp,
  Lock,
  Building2,
  Users,
  BarChart3,
  Crown
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import { useToast } from './ToastContext.jsx';
import { PremiumCard, PremiumButton, PremiumBadge, IconButton, ScaleOnHover } from './PremiumComponents.jsx';

// Application Modal Component
const ApplicationModal = ({ job, isOpen, onClose, onSubmit, existingApplication }) => {
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen || !job) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setError('');
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setCvFile(file);
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      setError('Please upload your CV/Resume');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      cvFileName: cvFile.name,
      cvFileSize: cvFile.size,
      coverLetter,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    });
    
    setIsSubmitting(false);
    setCvFile(null);
    setCoverLetter('');
    onClose();
  };

  // If already applied, show status
  if (existingApplication) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Already Applied</h2>
            <p className="text-gray-600 mb-6">
              You applied to <strong>{job.title}</strong> at <strong>{job.company}</strong>
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  existingApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  existingApplication.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                  existingApplication.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                  existingApplication.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {existingApplication.status.charAt(0).toUpperCase() + existingApplication.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Applied</span>
                <span className="text-sm text-gray-900">
                  {new Date(existingApplication.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Apply for this position</h2>
          <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-8">
          {/* CV Upload */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              CV / Resume <span className="text-red-500">*</span>
            </label>
            
            {cvFile ? (
              <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{cvFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCvFile(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-medium mb-1">
                  Drop your CV here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
          
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Cover Letter <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this role..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none outline-none focus:border-black transition-colors"
            />
          </div>
          
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Position Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Location</span>
                <p className="font-medium">{job.location}</p>
              </div>
              <div>
                <span className="text-gray-500">Type</span>
                <p className="font-medium">{job.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Salary</span>
                <p className="font-medium">{job.salary}</p>
              </div>
              <div>
                <span className="text-gray-500">Work Mode</span>
                <p className="font-medium">{job.workMode}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 rounded-b-3xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Market Insights Panel (Premium Feature for Employers)
const MarketInsightsPanel = ({ jobs, userRole, onNavigate }) => {
  const isEmployer = userRole === 'hirer' || userRole === 'both';
  const isPremium = false; // This would come from user data
  
  if (!isEmployer) return null;
  
  const avgSalary = jobs.length > 0 ? 
    Math.round(jobs.reduce((sum, job) => {
      const match = job.salary?.match(/(\d+)K/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0) / jobs.length) : 0;
  
  const techJobs = jobs.filter(j => j.classification === 'Technology').length;
  const remoteJobs = jobs.filter(j => j.workMode === 'Remote').length;
  
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">Market Intelligence</h3>
        </div>
        {!isPremium && (
          <button
            onClick={() => onNavigate('premium')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-full text-xs font-semibold text-black transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            Unlock Full Insights
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Active Listings</div>
          <div className="text-2xl font-bold">{jobs.length}</div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 relative">
          <div className="text-xs text-slate-400 mb-1">Avg Salary Range</div>
          {isPremium ? (
            <div className="text-2xl font-bold">{avgSalary}K MMK</div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">Premium</span>
            </div>
          )}
        </div>
        
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Remote Positions</div>
          <div className="text-2xl font-bold">{Math.round((remoteJobs/jobs.length)*100) || 0}%</div>
        </div>
      </div>
      
      {!isPremium && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <span className="font-medium text-white">Unlock premium insights:</span> Competitor hiring trends, salary benchmarks, talent demand forecasts, and more.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const JobsPage = ({ userData, userRole, onNavigate, onOpenMessages, onLogout, applications = [], onApply }) => {
  const { showSuccess, showInfo } = useToast();
  const [whatQuery, setWhatQuery] = useState('');
  const [whereQuery, setWhereQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [listedWithin, setListedWithin] = useState('Any');
  const [classificationFilter, setClassificationFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('All');
  const [skillFilterQuery, setSkillFilterQuery] = useState('');
  const [requiredSkillFilters, setRequiredSkillFilters] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const filtersRef = useRef(null);
  
  // Role-based flags
  const isEmployer = userRole === 'hirer' || userRole === 'both';
  const isJobSeeker = userRole === 'seeker' || userRole === 'both';
  const canApply = isJobSeeker; // Only job seekers can apply

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs on mount
  useEffect(() => {
    loadJobs();
    loadSavedJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (whatQuery) filters.search = whatQuery;
      if (whereQuery) filters.location = whereQuery;
      if (typeFilter !== 'All') filters.job_type = typeFilter.toLowerCase().replace('-', '_');
      if (workModeFilter !== 'All') filters.work_mode = workModeFilter.toLowerCase().replace(' ', '_');
      
      const response = await api.jobs.getAll(filters);
      
      // Transform API response to match component format
      const transformedJobs = (response.jobs || []).map(job => ({
        id: job.id,
        title: job.title || '',
        company: job.company_name || '',
        location: job.location || '',
        type: job.job_type || 'Full-time',
        workMode: job.work_mode || 'On-site',
        classification: job.classification || job.company_industry || '',
        salary: job.salary_range || job.salary || '',
        posted: formatTimestamp(job.created_at),
        postedDays: getDaysAgo(job.created_at),
        description: job.description || '',
        requiredSkills: Array.isArray(job.required_skills) ? job.required_skills : [],
        requirements: job.requirements || '',
        verified: job.verified || false,
        image: job.company_logo || false,
        hasApplied: job.has_applied || false,
        isSaved: job.is_saved || false,
        companyLogo: job.company_logo
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await api.jobs.getSaved();
      const savedIds = (response.jobs || []).map(j => j.job_id || j.id);
      setSavedJobs(savedIds);
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now - date) / 86400000);
  };

  // Reload jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [whatQuery, whereQuery, typeFilter, workModeFilter]);

  const toggleSaveJob = async (jobId) => {
    const isCurrentlySaved = savedJobs.includes(jobId);
    
    // Optimistic update
    if (isCurrentlySaved) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      showInfo('Job removed from saved');
    } else {
      setSavedJobs([...savedJobs, jobId]);
      showSuccess('Job saved successfully!');
    }

    try {
      if (isCurrentlySaved) {
        await api.jobs.unsaveJob(jobId);
      } else {
        await api.jobs.saveJob(jobId);
      }
      
      // Update job's isSaved status
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, isSaved: !isCurrentlySaved } : job
      ));
    } catch (error) {
      console.error('Failed to toggle save job:', error);
      // Revert on error
      if (isCurrentlySaved) {
        setSavedJobs([...savedJobs, jobId]);
      } else {
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      }
    }
  };

  const typeOptions = useMemo(() => (['All', 'Full-time', 'Freelance', 'Internship']), []);
  const workModeOptions = useMemo(() => (['All', 'On-site', 'Hybrid', 'Remote']), []);
  const classificationOptions = useMemo(() => (['All', 'Technology', 'Design', 'Business', 'Construction']), []);

  const locationOptions = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [jobs]);

  const allSkills = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => (j.requiredSkills || []).forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [jobs]);

  const visibleSkills = useMemo(() => {
    const q = skillFilterQuery.trim().toLowerCase();
    if (!q) return allSkills;
    return allSkills.filter((s) => s.toLowerCase().includes(q));
  }, [allSkills, skillFilterQuery]);

  const filteredJobs = useMemo(() => {
    const q = whatQuery.trim().toLowerCase();
    const w = whereQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesType = typeFilter === 'All' ? true : job.type === typeFilter;
      const matchesVerified = verifiedOnly ? Boolean(job.verified) : true;
      const matchesLocation = locationFilter === 'All' ? true : job.location === locationFilter;
      const matchesWhere = !w ? true : (job.location || '').toLowerCase().includes(w);
      const matchesWorkMode = workModeFilter === 'All' ? true : job.workMode === workModeFilter;
      const matchesClassification = classificationFilter === 'All' ? true : job.classification === classificationFilter;
      const matchesListedWithin =
        listedWithin === 'Any'
          ? true
          : typeof job.postedDays === 'number'
            ? job.postedDays <= Number(listedWithin)
            : true;
      const matchesSkills =
        requiredSkillFilters.length === 0
          ? true
          : requiredSkillFilters.every((s) => (job.requiredSkills || []).includes(s));
      const matchesQuery = !q
        ? true
        : `${job.title} ${job.company} ${job.location} ${(job.requiredSkills || []).join(' ')}`
          .toLowerCase()
          .includes(q);
      return (
        matchesType &&
        matchesWorkMode &&
        matchesClassification &&
        matchesListedWithin &&
        matchesVerified &&
        matchesLocation &&
        matchesWhere &&
        matchesSkills &&
        matchesQuery
      );
    });
  }, [
    jobs,
    whatQuery,
    whereQuery,
    typeFilter,
    workModeFilter,
    classificationFilter,
    listedWithin,
    verifiedOnly,
    locationFilter,
    requiredSkillFilters,
  ]);

  const getApplicationForJob = (jobId) => {
    return applications.find(app => app.jobId === jobId);
  };

  const ensureSelectedJob = (job) => {
    setSelectedJob(job);
  };

  useEffect(() => {
    if (!filteredJobs.length) {
      setSelectedJob(null);
      return;
    }
    if (!selectedJob) {
      setSelectedJob(filteredJobs[0]);
      return;
    }
    const stillVisible = filteredJobs.some((j) => j.id === selectedJob.id);
    if (!stillVisible) setSelectedJob(filteredJobs[0]);
  }, [filteredJobs, selectedJob]);

  useEffect(() => {
    if (!showFilters) return;
    const onDown = (e) => {
      if (!filtersRef.current) return;
      if (!filtersRef.current.contains(e.target)) setShowFilters(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setShowFilters(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [showFilters]);

  const clearFilters = () => {
    setTypeFilter('All');
    setWorkModeFilter('All');
    setListedWithin('Any');
    setClassificationFilter('All');
    setVerifiedOnly(false);
    setLocationFilter('All');
    setRequiredSkillFilters([]);
    setSkillFilterQuery('');
  };

  const toggleSkill = (skill) => {
    setRequiredSkillFilters((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleApplyClick = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    if (onApply) {
      onApply(applicationData);
      showSuccess('Application submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="opportunities"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
        showPostButton={true}
      />
      

      {/* Search Section */}
      <section className="bg-white border-b border-gray-100 sticky top-[73px] z-10">
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2">What</div>
              <input
                value={whatQuery}
                onChange={(e) => setWhatQuery(e.target.value)}
                placeholder="Enter keywords"
                className="w-full px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2">Classification</div>
              <div className="relative">
                <select
                  value={classificationFilter}
                  onChange={(e) => setClassificationFilter(e.target.value)}
                  className="w-full appearance-none px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors pr-12"
                >
                  {classificationOptions.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'Any classification' : c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2">Where</div>
              <input
                value={whereQuery}
                onChange={(e) => setWhereQuery(e.target.value)}
                placeholder="Enter city or region"
                className="w-full px-5 py-4 text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="button"
              className="px-10 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all text-lg font-semibold btn-beam"
            >
              Seek
            </button>
          </div>

          {/* Quick filters row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-900 font-medium pr-10 hover:border-gray-300 transition-colors"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All work types' : t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
                className="appearance-none px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-900 font-medium pr-10 hover:border-gray-300 transition-colors"
              >
                {workModeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All remote options' : t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={listedWithin}
                onChange={(e) => setListedWithin(e.target.value)}
                className="appearance-none px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-900 font-medium pr-10 hover:border-gray-300 transition-colors"
              >
                <option value="Any">Listed any time</option>
                <option value="1">Listed last 24 hours</option>
                <option value="3">Listed last 3 days</option>
                <option value="7">Listed last 7 days</option>
                <option value="30">Listed last 30 days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative" ref={filtersRef}>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white hover:border-gray-300 transition-colors micro-icon"
                aria-haspopup="dialog"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">More</span>
              </button>

              {showFilters && (
                <div
                  role="dialog"
                  aria-label="More filters"
                  className="absolute left-0 mt-3 w-[380px] bg-white border border-gray-200 rounded-2xl shadow-xl p-5 z-20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">More filters</div>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-5">
                    <label className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Verified companies only</div>
                        <div className="text-xs text-gray-500">Hide unverified postings</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-5 h-5 accent-black"
                      />
                    </label>

                    <div>
                      <div className="text-sm font-semibold mb-2">Location (exact)</div>
                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-black transition-colors"
                      >
                        {locationOptions.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2">Required skills</div>
                      <input
                        value={skillFilterQuery}
                        onChange={(e) => setSkillFilterQuery(e.target.value)}
                        placeholder="Search skills (e.g. React)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-colors"
                      />

                      {requiredSkillFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {requiredSkillFilters.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSkill(s)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                              title="Remove"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 max-h-40 overflow-auto pr-1">
                        <div className="flex flex-wrap gap-2">
                          {visibleSkills.slice(0, 24).map((s) => {
                            const active = requiredSkillFilters.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleSkill(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all micro-card ${
                                  active
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                          {visibleSkills.length === 0 && (
                            <div className="text-sm text-gray-500 py-2">No matching skills.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* My Applications Link - Only for Job Seekers */}
            {canApply && (
              <button
                onClick={() => onNavigate('applications')}
                className="ml-auto flex items-center gap-2 px-5 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-gray-900"
              >
                <FileText className="w-4 h-4" />
                My Applications
                {applications.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                    {applications.length}
                  </span>
                )}
              </button>
            )}
            
            {/* Employer Dashboard Link - Only for Employers */}
            {isEmployer && (
              <button
                onClick={() => onNavigate('employer')}
                className="ml-auto flex items-center gap-2 px-5 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-gray-900"
              >
                <Users className="w-4 h-4" />
                My Posted Jobs
              </button>
            )}

            <div className="text-sm text-gray-500">
              {filteredJobs.length} result{filteredJobs.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </section>

      {/* Split Panel Layout */}
      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">
        {/* Left Panel - Job List */}
        <div className="w-[520px] border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-base text-gray-500 mt-1">
              {isEmployer 
                ? 'Research market trends and competitor insights'
                : 'Find opportunities and apply directly'
              }
            </p>
          </div>
          
          {/* Market Insights for Employers */}
          {isEmployer && (
            <div className="p-6 border-b border-gray-100">
              <MarketInsightsPanel 
                jobs={filteredJobs} 
                userRole={userRole}
                onNavigate={onNavigate}
              />
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {filteredJobs.map((job) => {
              const application = getApplicationForJob(job.id);
              return (
              <button
                key={job.id}
                onClick={() => ensureSelectedJob(job)}
                className={`w-full text-left p-6 hover:bg-gray-50 transition-all micro-card ${
                  selectedJob?.id === job.id ? 'bg-gray-50 border-l-4 border-black' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                  <h3 className="text-xl font-semibold leading-tight">
                    {job.title}
                  </h3>
                      {application && (
                        <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          application.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                          application.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <CheckCircle className="w-3 h-3" />
                          Applied
                        </span>
                      )}
                    </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job.id);
                    }}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors flex-shrink-0 micro-icon"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedJobs.includes(job.id) ? 'fill-black text-black' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-base font-medium text-gray-900 mb-2">{job.company}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-800">
                    {job.type}
                  </span>
                </div>

                {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-500 mb-2">REQUIRED</div>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100"
                        >
                          {s}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{job.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="font-medium text-gray-900">{job.salary}</span>
                  <span className="text-gray-500">{job.posted}</span>
                </div>

                {/* Quick Apply Button - Only for Job Seekers */}
                {canApply && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {application ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick();
                        }}
                        className="w-full py-2.5 px-4 bg-green-50 border border-green-200 text-green-700 rounded-full hover:bg-green-100 transition-all text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          handleApplyClick();
                        }}
                        className="w-full py-2.5 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-sm font-medium flex items-center justify-center gap-2 group"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                )}
              </button>
              );
            })}
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-500">Loading jobs...</div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-2xl font-semibold mb-3">No matches</div>
                <div className="text-gray-500">
                  Try changing filters or searching for a different skill.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Job Details */}
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedJob ? (
            <div className="max-w-4xl mx-auto px-16 py-16">
              {selectedJob.image && (
                <div className="mb-16 -mx-16">
                  <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-none overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 text-lg">Company Image</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-16">
                <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
                  {selectedJob.title}
                </h1>
                <p className="text-3xl text-gray-600 mb-6">{selectedJob.company}</p>

                {/* Salary - Prominent Display */}
                <div className="mb-8">
                  <span className="text-2xl font-semibold text-gray-900">{selectedJob.salary}</span>
                </div>

                {/* Primary CTA - Apply Now (LinkedIn/Indeed Style) */}
                {canApply && (
                  <div className="mb-12">
                    {getApplicationForJob(selectedJob.id) ? (
                      <PremiumButton
                        variant="secondary"
                        onClick={handleApplyClick}
                        className="text-xl px-12 py-5 bg-green-50 border-2 border-green-600 text-green-700 hover:bg-green-100"
                      >
                        <CheckCircle className="w-6 h-6" />
                        Applied - View Status
                      </PremiumButton>
                    ) : (
                      <PremiumButton
                        variant="primary"
                        onClick={handleApplyClick}
                        className="text-xl px-12 py-5"
                      >
                        <ArrowRight className="w-6 h-6" />
                        Apply Now
                      </PremiumButton>
                    )}

                    {/* Save Job - Secondary Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(selectedJob.id);
                      }}
                      className="ml-4 px-8 py-5 border-2 border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-lg font-medium inline-flex items-center gap-2"
                    >
                      <Bookmark className={`w-5 h-5 ${savedJobs.includes(selectedJob.id) ? 'fill-black' : ''}`} />
                      {savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save Job'}
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-4 text-gray-600 mb-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span className="text-xl">{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-xl">{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <span className="text-xl">Posted {selectedJob.posted}</span>
                  </div>
                </div>

                {/* Old CTA section removed - now above job details */}
                <div className="hidden">
                  {canApply ? (
                    // Job Seeker View: Apply Button
                    getApplicationForJob(selectedJob.id) ? (
                      <button
                        onClick={handleApplyClick}
                        className="px-10 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-lg font-medium flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Applied - View Status
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyClick}
                        className="px-10 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-lg font-medium btn-beam"
                      >
                    Apply now
                  </button>
                    )
                  ) : null}
                  {canApply && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(selectedJob.id);
                    }}
                    className="px-10 py-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-all text-lg font-medium"
                  >
                    {savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save'}
                  </button>
                  )}
                </div>
                
                {/* Employer Context Note */}
                {isEmployer && !canApply && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <span className="font-medium">Employer Research Mode</span>
                        <p className="mt-1 text-amber-700">
                          You're viewing jobs posted by other companies. Use this to research market trends, salary ranges, and competitor hiring activity.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {Array.isArray(selectedJob.requiredSkills) && selectedJob.requiredSkills.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-3xl font-semibold mb-6">Required skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {selectedJob.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 font-medium hover:shadow-sm transition-all micro-card"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-16">
                <h2 className="text-3xl font-semibold mb-6">About this role</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requirements && (
                <div className="mb-16">
                  <h2 className="text-3xl font-semibold mb-6">Requirements</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}

              <div className="mb-16">
                <h2 className="text-3xl font-semibold mb-6">Compensation</h2>
                <p className="text-xl text-gray-600">{selectedJob.salary} per month</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-3xl font-semibold mb-4">Select a job</h2>
                <p className="text-xl text-gray-500">
                  Choose a position from the list to view details and apply.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJob}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
        existingApplication={selectedJob ? getApplicationForJob(selectedJob.id) : null}
      />
    </div>
  );
};

export default JobsPage;
