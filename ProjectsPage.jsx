import React, { useState, useEffect } from 'react';
import api from './src/services/api.js';
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
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    teamSize: 1,
    duration: ''
  });

  const [projects, setProjects] = useState([]);

  // Fetch projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.projects.getAll();
      
      // Transform API response to match component format
      const transformedProjects = (response.projects || []).map(project => ({
        id: project.id,
        title: project.title || project.name || '',
        description: project.description || '',
        category: project.category || 'Technology',
        owner: {
          name: project.owner_name || project.owner?.name || 'User',
          avatar: (project.owner_name || project.owner?.name || 'U').charAt(0).toUpperCase()
        },
        team: project.team_members || [],
        teamSize: project.team_size || project.max_team_size || 1,
        currentMembers: project.current_members || 1,
        skills: Array.isArray(project.skills) ? project.skills : [],
        status: project.status || 'In Progress',
        progress: project.progress || 0,
        likes: project.likes_count || 0,
        createdAt: formatTimestamp(project.created_at)
      }));
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
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

  const categories = [
    { id: 'all', name: 'All Projects', icon: GitBranch },
    { id: 'tech', name: 'Technology', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'construction', name: 'Construction', icon: Hammer },
    { id: 'business', name: 'Business', icon: TrendingUp }
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
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
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Collaborate on real projects and build your portfolio
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full hover:bg-brand-dark transition-all font-medium"
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
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter(project => {
                // Filter by category
                if (selectedFilter !== 'all') {
                  const categoryMap = {
                    'tech': 'Technology',
                    'design': 'Design',
                    'construction': 'Construction',
                    'business': 'Business'
                  };
                  if (project.category !== categoryMap[selectedFilter]) {
                    return false;
                  }
                }
                // Filter by search query
                if (searchQuery.trim()) {
                  const query = searchQuery.toLowerCase();
                  return (
                    project.title.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query) ||
                    project.skills.some(skill => skill.toLowerCase().includes(query))
                  );
                }
                return true;
              })
              .map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No projects found. Be the first to create one!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && <CreateProjectModal />}
    </div>
  );
};

export default ProjectsPage;
