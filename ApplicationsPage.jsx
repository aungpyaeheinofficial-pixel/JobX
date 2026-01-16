import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  Eye,
  MessageSquare,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

const ApplicationsPage = ({ userData, userRole, onNavigate, onOpenMessages, onLogout, applications = [], onWithdraw }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye },
    interview: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Calendar },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
  };

  const statusLabels = {
    pending: 'Under Review',
    reviewed: 'Reviewed',
    interview: 'Interview Scheduled',
    accepted: 'Accepted',
    rejected: 'Not Selected'
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = !searchQuery.trim() || 
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length
  };

  const handleWithdraw = (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      if (onWithdraw) {
        onWithdraw(appId);
      }
      setSelectedApplication(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="opportunities"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Applications</h1>
          <p className="text-xl text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-purple-600">{stats.interview}</div>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-600">Accepted</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
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
              <option value="pending">Under Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Not Selected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <button
            onClick={() => onNavigate('opportunities')}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Browse Jobs
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              {applications.length === 0 ? "No applications yet" : "No matching applications"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {applications.length === 0 
                ? "Start exploring job opportunities and submit your first application."
                : "Try adjusting your filters or search query."
              }
            </p>
            {applications.length === 0 && (
              <button
                onClick={() => onNavigate('opportunities')}
                className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                Browse Jobs
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredApplications.map((app) => {
                const statusConfig = statusColors[app.status] || statusColors.pending;
                const StatusIcon = statusConfig.icon;
                
                return (
                  <button
                    key={app.jobId}
                    onClick={() => setSelectedApplication(app)}
                    className={`w-full text-left bg-white rounded-2xl border p-6 hover:shadow-lg transition-all ${
                      selectedApplication?.jobId === app.jobId
                        ? 'border-black shadow-lg'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{app.jobTitle}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusLabels[app.status]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {app.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <FileText className="w-4 h-4" />
                            {app.cvFileName}
                          </span>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Application Detail Panel */}
            <div className="lg:col-span-1">
              {selectedApplication ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">{selectedApplication.jobTitle}</h3>
                    <p className="text-gray-600">{selectedApplication.company}</p>
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4">Application Status</h4>
                    <div className="space-y-4">
                      {['pending', 'reviewed', 'interview', 'accepted'].map((status, index) => {
                        const config = statusColors[status];
                        const Icon = config.icon;
                        const isActive = selectedApplication.status === status;
                        const isPast = ['pending', 'reviewed', 'interview', 'accepted'].indexOf(selectedApplication.status) >= index;
                        
                        return (
                          <div key={status} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isPast ? config.bg : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${isPast ? config.text : 'text-gray-400'}`} />
                            </div>
                            <div className={`flex-1 ${isActive ? 'font-medium' : ''} ${isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                              {statusLabels[status]}
                            </div>
                            {isActive && (
                              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Current</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h4 className="font-semibold mb-4">Application Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Applied</span>
                        <span className="font-medium">
                          {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Resume</span>
                        <span className="font-medium truncate max-w-[160px]">{selectedApplication.cvFileName}</span>
                      </div>
                      {selectedApplication.coverLetter && (
                        <div className="pt-2">
                          <span className="text-gray-500">Cover Letter</span>
                          <p className="mt-2 text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                            {selectedApplication.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => onNavigate('opportunities')}
                      className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      View Job Posting
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    {selectedApplication.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(selectedApplication.jobId)}
                        className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Withdraw Application
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center sticky top-24">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Select an application</h3>
                  <p className="text-gray-500 text-sm">
                    Click on an application to view details and track its status
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
