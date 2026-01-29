import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Users,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

const Dashboard = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real API data later
  const stats = {
    projects: 3,
    communities: 5,
    opportunities: 2,
    connections: 47
  };

  const recentProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      status: 'In Progress',
      progress: 65,
      team: 4,
      dueDate: '2026-02-15'
    },
    {
      id: 2,
      title: 'Mobile App Design',
      status: 'In Progress',
      progress: 40,
      team: 2,
      dueDate: '2026-01-30'
    },
    {
      id: 3,
      title: 'Construction Management System',
      status: 'Completed',
      progress: 100,
      team: 6,
      dueDate: '2025-12-20'
    }
  ];

  const communities = [
    { id: 1, name: 'Technology', members: 250, unread: 5 },
    { id: 2, name: 'Business', members: 180, unread: 2 },
    { id: 3, name: 'Design', members: 150, unread: 8 },
    { id: 4, name: 'Construction', members: 120, unread: 0 },
    { id: 5, name: 'Real Estate', members: 95, unread: 1 }
  ];

  const notifications = [
    { id: 1, text: 'Ko Zaw commented on your project', time: '2h ago', type: 'comment' },
    { id: 2, text: 'New opportunity in Technology community', time: '5h ago', type: 'opportunity' },
    { id: 3, text: 'Your project got 12 new views', time: '1d ago', type: 'view' }
  ];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />
      </div>
      <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{value}</div>
      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</div>
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
            project.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-brand/10 text-brand'
          }`}>
            {project.status}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>{project.team}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2">
          <div
            className="bg-brand rounded-full h-2 transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{project.dueDate}</span>
        </div>
        <button className="text-brand font-semibold hover:underline flex items-center gap-1">
          View
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const CommunityCard = ({ community }) => (
    <button
      onClick={() => onNavigate('community')}
      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-4 hover:shadow-sm transition-all duration-300 text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-base text-gray-900 dark:text-white">
          {community.name}
        </h4>
        {community.unread > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center">
            {community.unread}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        <Users className="w-4 h-4" />
        <span>{community.members} members</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Enhanced Header */}
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="dashboard"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
        showPostButton={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Welcome back, {userData?.name?.split(' ')[0] || 'Builder'}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Here's what's happening in your communities today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={Briefcase}
            label="Active Projects"
            value={stats.projects}
            color="#FC5114"
          />
          <StatCard
            icon={Users}
            label="Communities"
            value={stats.communities}
            color="#FC5114"
          />
          <StatCard
            icon={TrendingUp}
            label="Jobs"
            value={stats.opportunities}
            color="#FC5114"
          />
          <StatCard
            icon={User}
            label="Connections"
            value={stats.connections}
            color="#FC5114"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h2>
              <button
                onClick={() => onNavigate('projects')}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-full hover:bg-brand-dark transition-all font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            <div className="space-y-4">
              {recentProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="w-full py-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-semibold text-sm text-gray-900 dark:text-white"
            >
              View All Projects
            </button>
          </div>

          {/* Right Column - Communities */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Your Communities</h2>
            <div className="space-y-3">
              {communities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
