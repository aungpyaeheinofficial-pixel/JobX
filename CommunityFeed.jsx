import React, { useMemo, useRef, useState } from 'react';
import {
  Heart,
  Share2,
  Send,
  Image,
  Video,
  FileText,
  TrendingUp,
  Users,
  Search,
  CheckCircle2,
  Info,
  MoreHorizontal,
  X,
  MessageSquare
} from 'lucide-react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';

function nowLabel() {
  const d = new Date();
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

const CommunityFeed = ({ userData, userRole, onNavigate, onOpenMessages, onLogout }) => {
  const [selectedCommunity, setSelectedCommunity] = useState('all'); // id
  const [sortMode, setSortMode] = useState('latest'); // latest | top | trending
  const [postSearch, setPostSearch] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); // feed | about
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newPostImage, setNewPostImage] = useState(null); // { dataUrl, name, type }
  const [newPostImageError, setNewPostImageError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const postImageInputRef = useRef(null);

  // Mock data
  const communities = [
    {
      id: 'all',
      name: 'All Communities',
      color: '#000000',
      members: 795,
      description: 'A unified feed across all communities.',
      rules: ['Be kind', 'Share progress', 'No spam'],
    },
    {
      id: 'tech',
      name: 'Technology',
      color: '#8b5cf6',
      members: 250,
      description: 'Builders, engineers, and makers. Ship, learn, iterate.',
      rules: ['Show your work', 'Ask good questions', 'Give actionable feedback'],
      moderators: ['Admin', 'Aung Ko Ko'],
    },
    {
      id: 'business',
      name: 'Business',
      color: '#06b6d4',
      members: 180,
      description: 'Growth, sales, ops, and startups in Myanmar.',
      rules: ['No pyramid schemes', 'Share real numbers when possible', 'Respect privacy'],
      moderators: ['Admin'],
    },
    {
      id: 'design',
      name: 'Design',
      color: '#f59e0b',
      members: 150,
      description: 'UI, UX, product, and visual craft. Calm, confident work.',
      rules: ['Critique the work, not the person', 'Use screenshots', 'Keep it practical'],
      moderators: ['Admin', 'Aye Aye Mon'],
    },
    {
      id: 'construction',
      name: 'Construction',
      color: '#10b981',
      members: 120,
      description: 'Projects, planning, and on-site operations.',
      rules: ['Safety-first', 'No client doxxing', 'Share templates/tools'],
      moderators: ['Admin', 'Thu Ya'],
    },
  ];

  const [joined, setJoined] = useState(() => new Set(['tech', 'design'])); // demo: joined 2 communities

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Aung Ko Ko',
        avatar: 'A',
        title: 'Full Stack Developer',
        location: 'Yangon',
        verified: true,
      },
      communityId: 'tech',
      timestamp: '2 hours ago',
      content: 'Just launched my first SaaS product! Built with React and Node.js. Looking for feedback from the community. Anyone interested in beta testing?',
      likes: 24,
      shares: 3,
      isLiked: false,
      comments: [
        {
          id: 'c1',
          author: 'Su Su',
          avatar: 'S',
          text: 'Congrats! Share the link?',
          time: '2h',
          replies: [
            { id: 'r1', author: 'Aung Ko Ko', avatar: 'A', text: 'Will DM you the beta link.', time: '2h' },
          ],
        },
        { id: 'c2', author: 'Min Min', avatar: 'M', text: 'Nice. What stack for auth?', time: '1h', replies: [] },
      ],
    },
    {
      id: 2,
      author: {
        name: 'Aye Aye Mon',
        avatar: 'A',
        title: 'UI/UX Designer',
        location: 'Mandalay',
        verified: true,
      },
      communityId: 'design',
      timestamp: '5 hours ago',
      content: 'Working on a new design system for Myanmar startups. Here are some components I designed. What do you think? Open to collaborate!',
      image: true,
      likes: 45,
      shares: 7,
      isLiked: true,
      comments: [
        {
          id: 'c1',
          author: 'Aung Ko Ko',
          avatar: 'A',
          text: 'Love the spacing + type scale.',
          time: '5h',
          replies: [{ id: 'r1', author: 'Aye Aye Mon', avatar: 'A', text: 'Thanks! I’ll share tokens soon.', time: '5h' }],
        },
      ],
    },
    {
      id: 3,
      author: {
        name: 'Zaw Lin',
        avatar: 'Z',
        title: 'Business Analyst',
        location: 'Yangon',
        verified: false,
      },
      communityId: 'business',
      timestamp: '1 day ago',
      content: 'Looking for a co-founder with technical background for my e-commerce startup. We have traction and early customers. DM me if interested!',
      likes: 18,
      shares: 5,
      isLiked: false,
      comments: [],
    },
    {
      id: 4,
      author: {
        name: 'Thu Ya',
        avatar: 'T',
        title: 'Project Manager',
        location: 'Yangon',
        verified: false,
      },
      communityId: 'construction',
      timestamp: '2 days ago',
      content: 'Completed a major construction project management system. Reduced project delays by 40%. Happy to share lessons learned with anyone building in this space.',
      likes: 32,
      shares: 4,
      isLiked: false,
      comments: [
        { id: 'c1', author: 'Nyein Nyein', avatar: 'N', text: 'Can you share a checklist?', time: '2d', replies: [] },
      ],
    }
  ]);

  const selectedCommunityObj = useMemo(
    () => communities.find((c) => c.id === selectedCommunity) ?? communities[0],
    [communities, selectedCommunity],
  );

  const pinnedPostByCommunity = useMemo(() => {
    // demo pinned posts
    return {
      tech: 1,
      design: 2,
      construction: 4,
    };
  }, []);

  const pinnedPost = useMemo(() => {
    if (selectedCommunity === 'all') return null;
    const pid = pinnedPostByCommunity[selectedCommunity];
    if (!pid) return null;
    return posts.find((p) => p.id === pid) ?? null;
  }, [selectedCommunity, pinnedPostByCommunity, posts]);

  const isJoined = selectedCommunity !== 'all' && joined.has(selectedCommunity);

  const visiblePosts = useMemo(() => {
    const q = postSearch.trim().toLowerCase();
    let list = posts;
    if (selectedCommunity !== 'all') list = list.filter((p) => p.communityId === selectedCommunity);
    if (q) {
      list = list.filter((p) => {
        const hay = `${p.author.name} ${p.content}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const scoreTrending = (p) => p.likes * 2 + (p.comments?.length ?? 0) * 3 + p.shares;
    const toTimeBucket = (label) => {
      // very rough ordering for demo timestamps
      if (label.includes('hour')) return 1;
      if (label.includes('day')) return 2;
      return 3;
    };

    if (sortMode === 'top') {
      return [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }
    if (sortMode === 'trending') {
      return [...list].sort((a, b) => scoreTrending(b) - scoreTrending(a));
    }
    return [...list].sort((a, b) => toTimeBucket(a.timestamp) - toTimeBucket(b.timestamp));
  }, [posts, selectedCommunity, postSearch, sortMode]);

  const toggleJoin = () => {
    if (selectedCommunity === 'all') return;
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(selectedCommunity)) next.delete(selectedCommunity);
      else next.add(selectedCommunity);
      return next;
    });
  };

  const addPost = () => {
    const text = newPostContent.trim();
    if (!text) return;
    if (selectedCommunity !== 'all' && !isJoined) return;
    const communityId = selectedCommunity === 'all' ? 'tech' : selectedCommunity; // demo fallback
    const next = {
      id: Date.now(),
      author: {
        name: userData?.name || 'You',
        avatar: (userData?.name?.charAt(0) || 'Y').toUpperCase(),
        title: 'Builder',
        location: userData?.location || 'Myanmar',
      },
      communityId,
      timestamp: nowLabel(),
      content: text,
      imageUrl: newPostImage?.dataUrl || null,
      image: Boolean(newPostImage?.dataUrl),
      likes: 0,
      shares: 0,
      isLiked: false,
      comments: [],
    };
    setPosts((prev) => [next, ...prev]);
    setNewPostContent('');
    setNewPostImage(null);
    setNewPostImageError('');
  };

  const handleSelectPostImage = async (file) => {
    if (!file) return;
    setNewPostImageError('');
    if (!file.type?.startsWith('image/')) {
      setNewPostImageError('Please choose an image file.');
      return;
    }
    const maxBytes = 6 * 1024 * 1024; // 6MB
    if (file.size > maxBytes) {
      setNewPostImageError('Image is too large. Please use a file under 6MB.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setNewPostImage({ dataUrl, name: file.name, type: file.type });
      setIsComposerOpen(true);
    } catch {
      setNewPostImageError('Could not load that image. Please try another file.');
    }
  };

  const clearComposer = () => {
    setIsComposerOpen(false);
    setNewPostContent('');
    setNewPostImage(null);
    setNewPostImageError('');
    setIsDragOver(false);
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.isLiked;
        return { ...p, isLiked: nextLiked, likes: (p.likes ?? 0) + (nextLiked ? 1 : -1) };
      }),
    );
  };

  const addComment = (postId, text) => {
    const t = text.trim();
    if (!t) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const c = {
          id: `c-${Date.now()}`,
          author: userData?.name || 'You',
          avatar: (userData?.name?.charAt(0) || 'Y').toUpperCase(),
          text: t,
          time: 'now',
          replies: [],
        };
        return { ...p, comments: [...(p.comments ?? []), c] };
      }),
    );
  };

  const addReply = (postId, commentId, text) => {
    const t = text.trim();
    if (!t) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextComments = (p.comments ?? []).map((c) => {
          if (c.id !== commentId) return c;
          const r = {
            id: `r-${Date.now()}`,
            author: userData?.name || 'You',
            avatar: (userData?.name?.charAt(0) || 'Y').toUpperCase(),
            text: t,
            time: 'now',
          };
          return { ...c, replies: [...(c.replies ?? []), r] };
        });
        return { ...p, comments: nextComments };
      }),
    );
  };

  const PostCard = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [draftComment, setDraftComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null); // commentId | null
    const [draftReply, setDraftReply] = useState('');

    const communityName = communities.find((c) => c.id === post.communityId)?.name ?? 'Community';
    const commentCount = post.comments?.length ?? 0;
    const likeCount = post.likes ?? 0;
    const shareCount = post.shares ?? 0;
    const imageUrl = post.imageUrl || null;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 micro-card overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author.avatar}
          </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{post.author.name}</h3>
                    {post.author.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {post.author.title} • {post.author.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.timestamp}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {communityName}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors micro-icon"
                  aria-label="More"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-gray-900 leading-relaxed text-[15px]">{post.content}</p>
        </div>

        {/* Post Image (if exists) */}
        {imageUrl ? (
          <div className="px-6 pb-4">
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={imageUrl}
                alt="Post media"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : post.image ? (
          <div className="px-6 pb-4">
            <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-400 border border-gray-200">
            <div className="text-center">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Image placeholder</p>
            </div>
          </div>
          </div>
        ) : null}

        {/* Counts */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${likeCount > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="font-medium text-gray-700">{likeCount}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowComments(true)}
              className="hover:text-gray-900 transition-colors"
            >
              {commentCount} comment{commentCount === 1 ? '' : 's'}
            </button>
            <span>{shareCount} share{shareCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 border-t border-gray-100">
          <button
            onClick={() => toggleLike(post.id)}
            className={`py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${
              post.isLiked ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            Like
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <MessageSquare className="w-5 h-5" />
            Comment
          </button>
          <button className="py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/40">
            {/* existing comments */}
            {(post.comments?.length ?? 0) > 0 ? (
              <div className="space-y-3 mb-4">
                {post.comments.map((c) => (
                  <div key={c.id} className="space-y-2">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 text-sm font-semibold flex-shrink-0">
                        {c.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900">{c.author}</div>
                          <div className="text-xs text-gray-400">{c.time}</div>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">{c.text}</div>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedCommunity !== 'all' && !isJoined) return;
                              setReplyingTo((prev) => (prev === c.id ? null : c.id));
                              setDraftReply('');
                            }}
                            className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Reply
                          </button>
                          {(c.replies?.length ?? 0) > 0 && (
                            <div className="text-xs text-gray-400">{c.replies.length} repl{c.replies.length === 1 ? 'y' : 'ies'}</div>
                          )}
                        </div>

                        {replyingTo === c.id && (
                          <div className="mt-3 flex gap-2">
                            <input
                              value={draftReply}
                              onChange={(e) => setDraftReply(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addReply(post.id, c.id, draftReply);
                                  setDraftReply('');
                                  setReplyingTo(null);
                                }
                              }}
                              placeholder="Write a reply…"
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                addReply(post.id, c.id, draftReply);
                                setDraftReply('');
                                setReplyingTo(null);
                              }}
                              disabled={!draftReply.trim()}
                              className="px-3 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-beam"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {(c.replies?.length ?? 0) > 0 && (
                          <div className="mt-3 space-y-2 border-l border-gray-200 pl-4">
                            {c.replies.map((r) => (
                              <div key={r.id} className="flex gap-3">
                                <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0">
                                  {r.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-gray-900">{r.author}</div>
                                    <div className="text-xs text-gray-400">{r.time}</div>
                                  </div>
                                  <div className="text-sm text-gray-700 leading-relaxed">{r.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mb-4">Be the first to comment.</div>
            )}

            {/* new comment */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {(userData?.name?.charAt(0) || 'Y').toUpperCase()}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (selectedCommunity !== 'all' && !isJoined) return;
                      addComment(post.id, draftComment);
                      setDraftComment('');
                    }
                  }}
                  placeholder="Write a comment…"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                  disabled={selectedCommunity !== 'all' && !isJoined}
                />
              </div>
              <button
                onClick={() => {
                  if (selectedCommunity !== 'all' && !isJoined) return;
                  addComment(post.id, draftComment);
                  setDraftComment('');
                }}
                disabled={!draftComment.trim() || (selectedCommunity !== 'all' && !isJoined)}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-beam"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="community"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
        showPostButton={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Communities */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Communities</h2>
              <div className="space-y-2">
                {communities.map(community => (
                  <button
                    key={community.id}
                    onClick={() => setSelectedCommunity(community.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      selectedCommunity === community.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: community.color }}
                    />
                    <span className="font-medium flex-1">{community.name}</span>
                    {community.id !== 'all' && joined.has(community.id) && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        selectedCommunity === community.id ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        Joined
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">TRENDING</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-gray-700">#BuildInPublic</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-gray-700">#MyanmarTech</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-gray-700">#Startups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start a post (LinkedIn-inspired) */}
            <div className="bg-white border border-gray-200 rounded-2xl micro-card overflow-hidden">
              <div className="p-5">
                <input
                  ref={postImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    // allow selecting same file twice
                    e.target.value = '';
                    handleSelectPostImage(f);
                  }}
                />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                    {(userData?.name?.charAt(0) || 'Y').toUpperCase()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(true)}
                    disabled={selectedCommunity !== 'all' && !isJoined}
                    className={`flex-1 text-left px-6 py-3 rounded-full border transition-colors font-semibold ${
                      selectedCommunity !== 'all' && !isJoined
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Start a post
                  </button>
                </div>

                {isComposerOpen && (
                  <div className="mt-4">
                    <div
                      onDragOver={(e) => {
                        if (selectedCommunity !== 'all' && !isJoined) return;
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        if (selectedCommunity !== 'all' && !isJoined) return;
                        e.preventDefault();
                        setIsDragOver(false);
                        const f = e.dataTransfer?.files?.[0];
                        handleSelectPostImage(f);
                      }}
                      className={`rounded-2xl transition-colors ${isDragOver ? 'ring-2 ring-violet-400' : ''}`}
                    >
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Write a post…"
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-violet-500 transition-colors resize-none text-[15px]"
                        disabled={selectedCommunity !== 'all' && !isJoined}
                      />
                    </div>

                    {newPostImageError && (
                      <div className="mt-3 text-sm text-red-600">{newPostImageError}</div>
                    )}

                    {newPostImage?.dataUrl && (
                      <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="p-4 bg-gray-50 flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {newPostImage.name || 'Selected image'}
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewPostImage(null)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors micro-icon"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <img
                          src={newPostImage.dataUrl}
                          alt="Selected upload preview"
                          className="w-full max-h-96 object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {selectedCommunity !== 'all' ? (
                          <>
                            Posting to <span className="font-semibold text-gray-900">{selectedCommunityObj?.name}</span>
                          </>
                        ) : (
                          <>
                            Posting to <span className="font-semibold text-gray-900">All Communities</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            clearComposer();
                          }}
                          className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                    <button
                          disabled={
                            (!newPostContent.trim() && !newPostImage?.dataUrl) ||
                            (selectedCommunity !== 'all' && !isJoined)
                          }
                          onClick={() => {
                            addPost();
                            setIsComposerOpen(false);
                          }}
                          className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold btn-beam"
                    >
                      Post
                    </button>
                  </div>
                </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 px-5 py-3 grid grid-cols-3">
                <button
                  type="button"
                  disabled={selectedCommunity !== 'all' && !isJoined}
                  className="flex items-center justify-center gap-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Video className="w-5 h-5 text-green-600" />
                  Video
                </button>
                <button
                  type="button"
                  disabled={selectedCommunity !== 'all' && !isJoined}
                  onClick={() => {
                    setIsComposerOpen(true);
                    setTimeout(() => postImageInputRef.current?.click(), 0);
                  }}
                  className="flex items-center justify-center gap-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Image className="w-5 h-5 text-blue-600" />
                  Photo
                </button>
                <button
                  type="button"
                  disabled={selectedCommunity !== 'all' && !isJoined}
                  className="flex items-center justify-center gap-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5 text-orange-600" />
                  Write article
                </button>
              </div>

              {selectedCommunity !== 'all' && !isJoined && (
                <div className="px-5 pb-5">
                  <div className="mt-4 flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      Join <span className="font-semibold text-gray-900">{selectedCommunityObj?.name}</span> to post and comment.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort row (LinkedIn-like) */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-white outline-none focus:border-black transition-colors text-sm font-semibold text-gray-900"
                >
                  <option value="top">Top</option>
                  <option value="latest">Latest</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Pinned post */}
            {activeTab === 'feed' && pinnedPost && selectedCommunity !== 'all' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 micro-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-gray-500">PINNED</div>
                  <div className="text-xs text-gray-400">Shown to everyone in this community</div>
                </div>
                <PostCard post={pinnedPost} />
              </div>
            )}

            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {activeTab === 'about' ? 'About' : (selectedCommunity === 'all' ? 'All Posts' : selectedCommunityObj?.name)}
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    placeholder="Search posts"
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-white outline-none focus:border-black transition-colors text-sm w-56"
                  />
                </div>
              </div>
            </div>

            {/* Posts */}
            {activeTab === 'about' ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 micro-card">
                <div className="text-lg font-semibold mb-2">About</div>
                <div className="text-gray-600 leading-relaxed mb-6">
                  {selectedCommunityObj?.description}
                </div>

                <div className="text-lg font-semibold mb-3">Rules</div>
                <div className="space-y-2">
                  {(selectedCommunityObj?.rules ?? []).map((r) => (
                    <div key={r} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {Array.isArray(selectedCommunityObj?.moderators) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-lg font-semibold mb-3">Moderators</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCommunityObj.moderators.map((m) => (
                        <span key={m} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
            <div className="space-y-6">
                {visiblePosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
                {visiblePosts.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center micro-card">
                    <div className="text-2xl font-semibold mb-3">No posts found</div>
                    <div className="text-gray-500">Try a different search or sort.</div>
                  </div>
                )}
            </div>
            )}
          </div>

          {/* Right Sidebar - Community Detail / Suggested */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden sticky top-24 micro-card">
              {selectedCommunity !== 'all' ? (
                <>
                  {/* BIG Community Badge Header */}
                  <div 
                    className="p-6 text-white relative overflow-hidden"
                    style={{ backgroundColor: selectedCommunityObj?.color || '#000000' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-1">{selectedCommunityObj?.name}</h2>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span>{selectedCommunityObj?.members?.toLocaleString?.()} members</span>
                        {isJoined && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Joined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedCommunityObj?.description}
                    </p>

                    {/* Join/Leave Button */}
                    <button
                      onClick={toggleJoin}
                      className={`w-full px-5 py-3 rounded-xl font-semibold transition-all btn-beam ${
                        isJoined
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isJoined ? 'Leave Community' : 'Join Community'}
                    </button>

                    {/* Moderators */}
                    {selectedCommunityObj?.moderators && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">MODERATORS</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCommunityObj.moderators.map((mod) => (
                            <span key={mod} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rules */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 mb-3">COMMUNITY RULES</h3>
                      <div className="space-y-3">
                        {(selectedCommunityObj?.rules ?? []).map((r, idx) => (
                          <div key={r} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Posting reminder */}
                    {!isJoined && (
                      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">
                          <strong>Join to participate</strong> — You must be a member to post and comment in this community.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Suggested Connections</h2>
              <div className="space-y-4">
                {[
                  { name: 'Kyaw Kyaw', title: 'Frontend Dev', mutual: 3 },
                  { name: 'Su Su', title: 'Product Designer', mutual: 7 },
                  { name: 'Min Min', title: 'Entrepreneur', mutual: 2 }
                ].map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-500">{person.title}</p>
                      <p className="text-xs text-gray-400">{person.mutual} mutual</p>
                    </div>
                        <button className="px-3 py-1 bg-black text-white text-xs rounded-full hover:bg-gray-800 transition-colors btn-beam">
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-3">Active Now</h3>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    >
                      {i}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-semibold">
                    +15
                  </div>
                </div>
              </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
