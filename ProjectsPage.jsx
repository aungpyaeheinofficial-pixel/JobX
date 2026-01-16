import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Star,
  GitBranch,
  Code,
  Palette,
  Hammer,
  X
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

const ProjectsPage = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [view, setView] = useState('browse'); // 'browse' or 'create'
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    teamSize: 1,
    duration: ''
  });

  const categories = [
    { id: 'all', name: 'All Projects', icon: GitBranch },
    { id: 'tech', name: 'Technology', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'construction', name: 'Construction', icon: Hammer },
    { id: 'business', name: 'Business', icon: TrendingUp }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform for Myanmar',
      description: 'Building a modern e-commerce solution with payment integration for local businesses. Looking for backend and frontend developers.',
      category: 'Technology',
      owner: { name: 'Aung Ko Ko', avatar: 'A' },
      team: [
        { name: 'Ko Ko', avatar: 'K' },
        { name: 'Su Su', avatar: 'S' }
      ],
      teamSize: 5,
      currentMembers: 2,
      skills: ['React', 'Node.js', 'MongoDB'],
      status: 'In Progress',
      progress: 45,
      likes: 28,
      createdAt: '1 week ago'
    },
    {
      id: 2,
      title: 'Mobile App for Construction Management',
      description: 'Creating a mobile app to help construction teams track progress, manage inventory, and coordinate tasks in real-time.',
      category: 'Construction',
      owner: { name: 'Thu Ya', avatar: 'T' },
      team: [
        { name: 'Thu Ya', avatar: 'T' },
        { name: 'Zaw Min', avatar: 'Z' },
        { name: 'Aye Mon', avatar: 'A' }
      ],
      teamSize: 4,
      currentMembers: 3,
      skills: ['React Native', 'Firebase', 'UI/UX'],
      status: 'In Progress',
      progress: 70,
      likes: 45,
      createdAt: '3 days ago'
    },
    {
      id: 3,
      title: 'Design System for Myanmar Startups',
      description: 'Open-source design system with Myanmar language support. Includes components, patterns, and guidelines.',
      category: 'Design',
      owner: { name: 'Aye Aye Mon', avatar: 'A' },
      team: [
        { name: 'Aye Mon', avatar: 'A' },
        { name: 'Lin Lin', avatar: 'L' }
      ],
      teamSize: 3,
      currentMembers: 2,
      skills: ['Figma', 'React', 'Tailwind CSS'],
      status: 'In Progress',
      progress: 55,
      likes: 67,
      createdAt: '2 weeks ago'
    },
    {
      id: 4,
      title: 'Business Analytics Dashboard',
      description: 'Dashboard for small businesses to track sales, inventory, and customer data. Need data visualization expertise.',
      category: 'Business',
      owner: { name: 'Zaw Lin', avatar: 'Z' },
      team: [
        { name: 'Zaw Lin', avatar: 'Z' }
      ],
      teamSize: 4,
      currentMembers: 1,
      skills: ['Data Analysis', 'Python', 'React'],
      status: 'Looking for Team',
      progress: 20,
      likes: 34,
      createdAt: '5 days ago'
    },
    {
      id: 5,
      title: 'Food Delivery Mobile App',
      description: 'Local food delivery app connecting restaurants with customers. MVP completed, looking to expand features.',
      category: 'Technology',
      owner: { name: 'Min Khant', avatar: 'M' },
      team: [
        { name: 'Min Khant', avatar: 'M' },
        { name: 'Htet Htet', avatar: 'H' },
        { name: 'Kyaw Swar', avatar: 'K' }
      ],
      teamSize: 5,
      currentMembers: 3,
      skills: ['Flutter', 'Node.js', 'PostgreSQL'],
      status: 'In Progress',
      progress: 80,
      likes: 92,
      createdAt: '1 month ago'
    },
    {
      id: 6,
      title: 'Real Estate Listing Platform',
      description: 'Comprehensive platform for property listings, virtual tours, and agent connections across Myanmar.',
      category: 'Business',
      owner: { name: 'Nyi Nyi', avatar: 'N' },
      team: [
        { name: 'Nyi Nyi', avatar: 'N' },
        { name: 'May Thu', avatar: 'M' }
      ],
      teamSize: 6,
      currentMembers: 2,
      skills: ['Vue.js', 'Laravel', 'Maps API'],
      status: 'Looking for Team',
      progress: 30,
      likes: 41,
      createdAt: '1 week ago'
    }
  ];

  const ProjectCard = ({ project }) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                {project.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'Looking for Team'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Star
              className={`w-5 h-5 ${isLiked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-violet-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Team Members */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {member.avatar}
                  </div>
                ))}
                {project.currentMembers < project.teamSize && (
                  <div className="w-8 h-8 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center text-gray-600 text-xs font-semibold">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {project.currentMembers}/{project.teamSize}
              </span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1 text-gray-500">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{project.likes}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.createdAt}
          </div>
        </div>
      </div>
    );
  };

  const CreateProjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Create New Project</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Project Title *</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Enter your project title"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe your project, goals, and what you're building..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.filter(c => c.id !== 'all').map((category) => (
                <button
                  key={category.id}
                  onClick={() => setNewProject({ ...newProject, category: category.id })}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all ${
                    newProject.category === category.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-semibold mb-2">Team Size Needed</label>
            <input
              type="number"
              min="1"
              max="20"
              value={newProject.teamSize}
              onChange={(e) => setNewProject({ ...newProject, teamSize: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2">Estimated Duration</label>
            <select
              value={newProject.duration}
              onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">Select duration</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-semibold mb-2">Skills Required</label>
            <input
              type="text"
              placeholder="e.g., React, Node.js, UI/UX Design"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">Press Enter to add skills</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!newProject.title || !newProject.description || !newProject.category}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="projects"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
        showPostButton={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-gray-500 text-lg">
              Collaborate on real projects and build your portfolio
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedFilter(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedFilter === category.id
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && <CreateProjectModal />}
    </div>
  );
};

export default ProjectsPage;
