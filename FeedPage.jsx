import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from './src/services/api.js';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  Calendar,
  TrendingUp,
  Sparkles,
  Send,
  X,
  ChevronDown,
  MapPin,
  Briefcase,
  Link2,
  Users,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

// Sample feed data - cross-industry, people-focused
const initialPosts = [
  {
    id: 1,
    author: {
      name: 'Aung Kyaw',
      title: 'Full Stack Developer',
      avatar: null,
      initials: 'AK',
      location: 'Yangon',
      isVerified: true,
    },
    content: "Just shipped the new payment integration for our e-commerce platform! 🚀 After 3 weeks of work, we finally have Stripe + local payment methods working seamlessly. The user feedback has been incredible.",
    image: null,
    timestamp: '2 hours ago',
    type: 'progress',
    likes: 47,
    comments: 12,
    shares: 5,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 2,
    author: {
      name: 'May Thu',
      title: 'UI/UX Designer at TechCorp',
      avatar: null,
      initials: 'MT',
      location: 'Mandalay',
      isVerified: false,
    },
    content: "Hot take: Most \"user-centered design\" is actually just designer-centered design with extra steps. We need to get out of our Figma files and actually talk to users more often. 💭",
    image: null,
    timestamp: '4 hours ago',
    type: 'thought',
    likes: 128,
    comments: 34,
    shares: 21,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 3,
    author: {
      name: 'Zaw Win',
      title: 'Architect | Building Designer',
      avatar: null,
      initials: 'ZW',
      location: 'Yangon',
      isVerified: true,
    },
    content: "Excited to announce our team just won the bid for the new Yangon Innovation Center! 🏗️ This 50,000 sqft space will house 100+ startups and become a hub for Myanmar's tech ecosystem. Construction starts Q2 2026.",
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    timestamp: '5 hours ago',
    type: 'announcement',
    likes: 234,
    comments: 45,
    shares: 67,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 4,
    author: {
      name: 'Lin Htet',
      title: 'Marketing Manager',
      avatar: null,
      initials: 'LH',
      location: 'Yangon',
      isVerified: false,
    },
    content: "Looking for a React developer to join our team! 🔍\n\nWe're building Myanmar's first AI-powered recruitment platform. Remote-friendly, competitive salary, equity options.\n\nDM me if interested or tag someone who might be a good fit!",
    image: null,
    timestamp: '6 hours ago',
    type: 'opportunity',
    likes: 89,
    comments: 23,
    shares: 45,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 5,
    author: {
      name: 'Thazin Oo',
      title: 'Data Scientist',
      avatar: null,
      initials: 'TO',
      location: 'Singapore (from Myanmar)',
      isVerified: true,
    },
    content: "Week 4 of my 100 Days of ML challenge! 📊\n\nToday I built a sentiment analysis model for Burmese text. Accuracy is around 82% which is pretty good considering the limited training data available for our language.\n\nHappy to share the dataset and code with anyone interested in NLP for Myanmar languages.",
    image: null,
    timestamp: '8 hours ago',
    type: 'progress',
    likes: 156,
    comments: 28,
    shares: 34,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 6,
    author: {
      name: 'Ko Phyo',
      title: 'Construction Project Manager',
      avatar: null,
      initials: 'KP',
      location: 'Mandalay',
      isVerified: false,
    },
    content: "Just completed the foundation work for our 12-story residential project. The team worked through monsoon season and we're still on schedule! 💪 Proud of everyone involved.",
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    timestamp: '10 hours ago',
    type: 'progress',
    likes: 78,
    comments: 15,
    shares: 8,
    isLiked: false,
    isBookmarked: false,
  },
];

// Post type badges
const postTypeBadges = {
  progress: { label: 'Progress', color: 'bg-green-100 text-green-700', icon: TrendingUp },
  thought: { label: 'Thought', color: 'bg-purple-100 text-purple-700', icon: Sparkles },
  announcement: { label: 'Announcement', color: 'bg-blue-100 text-blue-700', icon: FileText },
  opportunity: { label: 'Opportunity', color: 'bg-amber-100 text-amber-700', icon: Briefcase },
  story: { label: 'Story', color: 'bg-pink-100 text-pink-700', icon: Heart },
};

// Post Card Component
const PostCard = ({ post, onLike, onComment, onShare, onBookmark }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const badge = postTypeBadges[post.type];
  const BadgeIcon = badge?.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden micro-card"
    >
      {/* Author Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {post.author.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{post.author.name}</span>
                {post.author.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.author.title}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.author.location}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{post.timestamp}</span>
                {badge && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-5 pb-4">
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-xl object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {post.likes}
          </span>
          <span>{post.comments} comments</span>
        </div>
        <span>{post.shares} shares</span>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            post.isLiked
              ? 'text-red-500 bg-red-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        <button
          onClick={() => onShare(post.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            post.isBookmarked
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

// Post Composer Component
const PostComposer = ({ userData, onPost }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('progress');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    onPost({ content, type: postType, image: postImage });
    setContent('');
    setPostImage(null);
    setPostType('progress');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPostImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPostImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const currentBadge = postTypeBadges[postType];
  const CurrentBadgeIcon = currentBadge?.icon;

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-colors ${
        isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
            {userData?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{userData?.name || 'User'}</div>
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${currentBadge?.color}`}
              >
                <CurrentBadgeIcon className="w-3 h-3" />
                {currentBadge?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {showTypeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-1 min-w-[140px]"
                  >
                    {Object.entries(postTypeBadges).map(([type, badge]) => {
                      const Icon = badge.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => { setPostType(type); setShowTypeDropdown(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                            type === postType ? 'bg-gray-50' : ''
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {badge.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you building?"
          rows={3}
          className="w-full resize-none text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none text-lg"
        />

        {/* Image Preview */}
        {postImage && (
          <div className="mt-3 relative">
            <img src={postImage} alt="Upload" className="w-full max-h-64 object-cover rounded-xl" />
            <button
              onClick={() => setPostImage(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag hint */}
        {isDragging && (
          <div className="mt-3 p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 text-center">
            <Image className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">Drop your image here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="p-2.5 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <Image className="w-5 h-5 text-gray-500" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <Calendar className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <Link2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <button
          onClick={handlePost}
          disabled={!content.trim()}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
            content.trim()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

// Trending Topics Component
const TrendingTopics = () => {
  const topics = [
    { tag: '#MyanmarTech', posts: 234 },
    { tag: '#RemoteWork', posts: 189 },
    { tag: '#StartupLife', posts: 156 },
    { tag: '#UIUXDesign', posts: 134 },
    { tag: '#ConstructionYangon', posts: 98 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gray-400" />
        Trending in Myanmar
      </h3>
      <div className="space-y-3">
        {topics.map((topic, idx) => (
          <button
            key={topic.tag}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <div>
              <div className="font-medium text-gray-900">{topic.tag}</div>
              <div className="text-sm text-gray-500">{topic.posts} posts</div>
            </div>
            <span className="text-xs text-gray-400">#{idx + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Suggested Connections Component
const SuggestedConnections = ({ onNavigate }) => {
  const suggestions = [
    { name: 'Su Su Win', title: 'Product Designer', initials: 'SW', mutual: 5 },
    { name: 'Kyaw Zin', title: 'Backend Developer', initials: 'KZ', mutual: 3 },
    { name: 'Ei Phyu', title: 'Project Manager', initials: 'EP', mutual: 8 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          People to Follow
        </h3>
        <button
          onClick={() => onNavigate('network')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          See all
        </button>
      </div>
      <div className="space-y-3">
        {suggestions.map((person) => (
          <div
            key={person.name}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-sm font-medium">
                {person.initials}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{person.name}</div>
                <div className="text-xs text-gray-500">{person.title}</div>
                <div className="text-xs text-gray-400">{person.mutual} mutual</div>
              </div>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Explore Communities Component
const ExploreCommunities = ({ selectedCommunity, onSelectCommunity }) => {
  const communities = [
    { id: 'all', name: 'All Topics', color: '#000000', members: 795, icon: '🌐' },
    { id: 'tech', name: 'Technology', color: '#8b5cf6', members: 250, icon: '💻' },
    { id: 'business', name: 'Business', color: '#06b6d4', members: 180, icon: '📈' },
    { id: 'design', name: 'Design', color: '#f59e0b', members: 150, icon: '🎨' },
    { id: 'construction', name: 'Construction', color: '#10b981', members: 120, icon: '🏗️' },
    { id: 'realestate', name: 'Real Estate', color: '#ef4444', members: 95, icon: '🏠' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        Explore Communities
      </h3>
      <div className="space-y-2">
        {communities.map((community) => (
          <button
            key={community.id}
            onClick={() => onSelectCommunity(community.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
              selectedCommunity === community.id
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-lg">{community.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${selectedCommunity === community.id ? 'text-white' : 'text-gray-900'}`}>
                {community.name}
              </div>
              <div className={`text-xs ${selectedCommunity === community.id ? 'text-gray-300' : 'text-gray-500'}`}>
                {community.members} members
              </div>
            </div>
            {selectedCommunity === community.id && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ userData, onNavigate }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Cover */}
      <div className="h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900" />
      
      {/* Content */}
      <div className="px-5 pb-5">
        <div className="-mt-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
            {userData?.name?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-gray-900">{userData?.name || 'User'}</h3>
          <p className="text-sm text-gray-500">{userData?.title || 'Builder'}</p>
        </div>
        
        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">127</div>
            <div className="text-xs text-gray-500">Connections</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">45</div>
            <div className="text-xs text-gray-500">Profile views</div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

// Main Feed Page
const FeedPage = ({ userData, userRole, onNavigate, onLogout, onOpenMessages }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState('all');

  // Fetch posts from API on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await api.feed.getPosts();
      
      // Transform API response to match component format
      const transformedPosts = (response.posts || []).map(post => ({
        id: post.id,
        author: {
          name: post.author_name || 'User',
          title: post.author_title || '',
          avatar: post.author_avatar,
          initials: (post.author_name || 'U').charAt(0).toUpperCase(),
          location: post.author_location || '',
          isVerified: false,
        },
        content: post.content || '',
        image: post.image_url || null,
        timestamp: formatTimestamp(post.created_at),
        type: post.post_type || 'progress',
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        shares: post.shares_count || 0,
        isLiked: post.is_liked || false,
        isBookmarked: post.is_bookmarked || false,
        isShared: post.is_shared || false,
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to empty array on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredPosts = useMemo(() => {
    let result = posts;
    
    // Filter by community/topic
    if (selectedCommunity !== 'all') {
      const communityMap = {
        'tech': ['progress', 'thought'],
        'business': ['opportunity', 'announcement'],
        'design': ['progress', 'thought'],
        'construction': ['progress', 'announcement'],
        'realestate': ['opportunity', 'announcement'],
      };
      const allowedTypes = communityMap[selectedCommunity] || [];
      result = result.filter(post => allowedTypes.includes(post.type));
    }
    
    // Filter by post type
    if (filter !== 'all') {
      result = result.filter(post => post.type === filter);
    }
    
    return result;
  }, [posts, filter, selectedCommunity]);

  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const wasLiked = post?.isLiked;
    
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));

    try {
      if (wasLiked) {
        await api.feed.unlikePost(postId);
      } else {
        await api.feed.likePost(postId);
      }
      // Reload to get accurate counts
      await loadPosts();
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert on error
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, isLiked: wasLiked, likes: wasLiked ? p.likes + 1 : p.likes - 1 }
          : p
      ));
    }
  };

  const handleBookmark = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const wasBookmarked = post?.isBookmarked;
    
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));

    try {
      if (wasBookmarked) {
        await api.feed.unbookmarkPost(postId);
      } else {
        await api.feed.bookmarkPost(postId);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      // Revert on error
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, isBookmarked: wasBookmarked } : p
      ));
    }
  };

  const handleShare = async (postId) => {
    try {
      await api.feed.sharePost(postId);
      // Reload to get updated share count
      await loadPosts();
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const handleView = async (postId) => {
    try {
      await api.feed.viewPost(postId);
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  const handleNewPost = async ({ content, type, image }) => {
    try {
      // Validate content length (backend requires min 10 chars)
      if (!content || content.trim().length < 10) {
        alert('Post content must be at least 10 characters long.');
        return;
      }

      const postData = {
        content: content.trim(),
        post_type: type,
        image_url: image || null,
      };
      
      const response = await api.feed.createPost(postData);
      
      // Reload posts to get the new one from server
      await loadPosts();
      
      // Show success feedback
      console.log('Post created successfully:', response);
    } catch (error) {
      console.error('Failed to create post:', error);
      const errorMsg = error.message || error.data?.errors?.[0]?.msg || 'Failed to create post. Please try again.';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="feed"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Profile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <ProfileCard userData={userData} onNavigate={onNavigate} />
            </div>
          </aside>

          {/* Main Feed */}
          <section className="lg:col-span-6 space-y-6">
            {/* Composer */}
            <PostComposer userData={userData} onPost={handleNewPost} />

            {/* Community Topic Header */}
            {selectedCommunity !== 'all' && (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {selectedCommunity === 'tech' ? '💻' : 
                     selectedCommunity === 'business' ? '📈' :
                     selectedCommunity === 'design' ? '🎨' :
                     selectedCommunity === 'construction' ? '🏗️' : '🏠'}
                  </span>
                  <div>
                    <h2 className="font-bold text-lg">
                      #{selectedCommunity.charAt(0).toUpperCase() + selectedCommunity.slice(1)}
                    </h2>
                    <p className="text-gray-300 text-sm">Filtering posts by topic</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommunity('all')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'all', label: 'All' },
                { id: 'progress', label: '🚀 Progress' },
                { id: 'thought', label: '💭 Thoughts' },
                { id: 'opportunity', label: '💼 Opportunities' },
                { id: 'announcement', label: '📢 Announcements' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === item.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No posts found. Be the first to share something!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={() => {}}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                  />
                ))
              )}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ExploreCommunities 
                selectedCommunity={selectedCommunity} 
                onSelectCommunity={setSelectedCommunity} 
              />
              <TrendingTopics />
              <SuggestedConnections onNavigate={onNavigate} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
