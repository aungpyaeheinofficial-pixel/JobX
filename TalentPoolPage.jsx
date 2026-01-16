import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Download,
  Heart,
  ArrowLeft,
  X,
  Check,
  Users,
  Code,
  Sparkles
} from 'lucide-react';
import { HiringModeHeader } from './EnhancedLiquidNav.jsx';

/**
 * Talent Pool Page - Apple Editorial Style
 * Browse and save talented candidates
 */
const TalentPoolPage = ({ userData, onNavigate, onOpenMessages, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [savedCandidates, setSavedCandidates] = useState([]);

  // Demo talent data
  const talents = [
    {
      id: 1,
      name: 'Aung Kyaw',
      title: 'Senior Frontend Developer',
      location: 'Yangon',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      availability: 'Available',
      email: 'aungkyaw@email.com',
      phone: '+95 9 123 456 789',
      summary: 'Passionate frontend developer with expertise in building scalable React applications. Love creating beautiful, performant user interfaces.'
    },
    {
      id: 2,
      name: 'Thiri Win',
      title: 'Full Stack Developer',
      location: 'Mandalay',
      experience: '3 years',
      skills: ['Vue.js', 'Node.js', 'PostgreSQL', 'AWS'],
      availability: 'Available in 2 weeks',
      email: 'thiriwin@email.com',
      phone: '+95 9 987 654 321',
      summary: 'Full-stack developer experienced in building end-to-end web applications. Strong focus on clean code and best practices.'
    },
    {
      id: 3,
      name: 'Zaw Min',
      title: 'UI/UX Designer',
      location: 'Yangon',
      experience: '4 years',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      availability: 'Available',
      email: 'zawmin@email.com',
      phone: '+95 9 456 789 123',
      summary: 'Creative designer focused on creating intuitive user experiences. Expertise in design systems and user-centered design.'
    }
  ];

  const allSkills = ['all', 'React', 'TypeScript', 'Vue.js', 'Node.js', 'Figma', 'AWS'];

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === 'all' || talent.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const toggleSave = (candidateId) => {
    setSavedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <HiringModeHeader
        userData={userData}
        userRole="employer"
        activeTab="employer"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <div className="max-w-7xl mx-auto px-8 py-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate('employer')}
          className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Hero Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-6xl font-bold tracking-tight">
              Talent Pool
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 leading-relaxed max-w-3xl"
          >
            Discover talented developers and designers actively looking for opportunities
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="mb-16 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or title..."
              className="w-full pl-16 pr-6 py-5 text-xl border-2 border-gray-200 rounded-3xl outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Skill Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedSkill === skill
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill === 'all' ? 'All Skills' : skill}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-xl text-gray-600">
            <span className="font-bold text-black">{filteredTalents.length}</span> talented professionals found
          </p>
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTalents.map((talent, index) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-black transition-all cursor-pointer group"
              onClick={() => setSelectedCandidate(talent)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {talent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                      {talent.name}
                    </h3>
                    <p className="text-gray-600">{talent.title}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(talent.id);
                  }}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      savedCandidates.includes(talent.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{talent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{talent.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">{talent.availability}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {talent.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <p className="text-gray-600 line-clamp-2 mb-6">
                {talent.summary}
              </p>

              {/* Action */}
              <div className="pt-6 border-t border-gray-200">
                <span className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  View Full Profile
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTalents.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">No talents found</h3>
            <p className="text-xl text-gray-600 mb-8">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('all');
              }}
              className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-32" />
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Candidate Profile</h2>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Profile Header */}
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold mb-2">{selectedCandidate.name}</h3>
                      <p className="text-2xl text-gray-600 mb-4">{selectedCandidate.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                          {selectedCandidate.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Location</div>
                      <div className="flex items-center gap-2 text-xl">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {selectedCandidate.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Experience</div>
                      <div className="flex items-center gap-2 text-xl">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        {selectedCandidate.experience}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Skills</div>
                    <div className="flex flex-wrap gap-3">
                      {selectedCandidate.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">About</div>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {selectedCandidate.summary}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Contact Information</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${selectedCandidate.email}`} className="text-xl text-blue-600 hover:text-blue-700">
                          {selectedCandidate.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${selectedCandidate.phone}`} className="text-xl text-gray-700">
                          {selectedCandidate.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-8">
                    <button className="flex-1 px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Candidate
                    </button>
                    <button
                      onClick={() => toggleSave(selectedCandidate.id)}
                      className={`px-8 py-4 rounded-full text-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        savedCandidates.includes(selectedCandidate.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={savedCandidates.includes(selectedCandidate.id) ? 'fill-current' : ''} />
                      {savedCandidates.includes(selectedCandidate.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TalentPoolPage;
