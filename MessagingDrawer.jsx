import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Expand, MoreHorizontal, Pencil, Search, Send, X } from 'lucide-react';
import api from './src/services/api.js';

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const seedThreads = [
  {
    id: 't1',
    type: 'dm', // dm | group | community
    name: 'The Droid',
    subtitle: 'Android • Robotics',
    avatarText: 'D',
    unread: 1,
    messages: [
      { id: 'm1', from: 'me', text: 'hi', time: '1m' },
    ],
  },
  {
    id: 't2',
    type: 'community',
    name: 'Design Community',
    subtitle: 'UI/UX • Tokens',
    avatarText: 'D',
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Want feedback on your typography?', time: 'Yesterday' },
      { id: 'm2', from: 'me', text: 'Yes please — especially spacing + hierarchy.', time: 'Yesterday' },
    ],
  },
  {
    id: 't3',
    type: 'group',
    name: 'Builders Group',
    subtitle: 'Tech • Yangon',
    avatarText: 'B',
    unread: 0,
    messages: [{ id: 'm1', from: 'them', text: 'Standup at 10am.', time: 'Mon' }],
  },
];

export default function MessagingDrawer({ open, onClose, currentUser }) {
  const [tab, setTab] = useState('all'); // all | unread | groups | communities
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null); // null => list view
  const [draft, setDraft] = useState('');
  const [activeUserId, setActiveUserId] = useState(null); // Store user ID for active conversation

  const listSearchRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? null, [threads, activeId]);

  const filtered = useMemo(() => {
    const byTab = threads.filter((t) => {
      if (tab === 'unread') return (t.unread ?? 0) > 0;
      if (tab === 'groups') return t.type === 'group';
      if (tab === 'communities') return t.type === 'community';
      return true;
    });
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((t) => `${t.name} ${t.subtitle}`.toLowerCase().includes(q));
  }, [threads, tab, query]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'groups', label: 'Group' },
    { id: 'communities', label: 'Community Chats' },
  ];

  const handleClose = () => {
    onClose?.();
  };

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Focus management (Messenger feel)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (activeId) inputRef.current?.focus();
      else listSearchRef.current?.focus();
    }, 120);
    return () => clearTimeout(t);
  }, [open, activeId]);

  // Load conversations when drawer opens
  useEffect(() => {
    if (open && currentUser) {
      loadConversations();
    }
  }, [open, currentUser]);

  // Load messages when active thread changes
  useEffect(() => {
    if (activeUserId) {
      loadMessages(activeUserId);
    }
  }, [activeUserId]);

  useEffect(() => {
    if (!open || !activeId) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [open, activeId, active?.messages?.length]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await api.messages.getConversations();
      
      // Transform API response to match component format
      const transformedThreads = (response.conversations || []).map(conv => ({
        id: conv.user_id || conv.id,
        type: 'dm',
        name: conv.name || conv.user_name || 'User',
        subtitle: conv.title || '',
        avatarText: (conv.name || conv.user_name || 'U').charAt(0).toUpperCase(),
        unread: conv.unread_count || 0,
        lastMessage: conv.last_message || '',
        lastMessageTime: conv.last_message_time || '',
        messages: [] // Will be loaded when thread is opened
      }));
      
      setThreads(transformedThreads);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await api.messages.getMessages(userId);
      
      // Transform messages to component format
      const transformedMessages = (response.messages || []).map(msg => ({
        id: msg.id,
        from: msg.sender_id === currentUser?.id ? 'me' : 'them',
        text: msg.content || '',
        time: formatMessageTime(msg.created_at)
      }));

      // Update the active thread with messages
      setThreads(prev => prev.map(t => 
        t.id === userId 
          ? { ...t, messages: transformedMessages, unread: 0 }
          : t
      ));

      // Mark messages as read
      if (userId !== currentUser?.id) {
        await api.messages.markAsRead(userId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const formatMessageTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const openThread = (id) => {
    setActiveId(id);
    setActiveUserId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !active || !activeUserId) return;
    
    try {
      await api.messages.sendMessage(activeUserId, text);
      setDraft('');
      
      // Reload messages to get the new one
      await loadMessages(activeUserId);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay - Apple-style with stronger backdrop */}
      <button
        type="button"
        aria-label="Close chats"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Sheet - Enhanced elevation and constrained width */}
      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-[420px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-white/10 shadow-2xl animate-slideIn rounded-l-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Chats</div>
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors micro-icon" aria-label="Menu">
                <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button type="button" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors micro-icon" aria-label="Expand">
                <Expand className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button type="button" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors micro-icon" aria-label="New chat">
                <Pencil className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button type="button" onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors micro-icon" aria-label="Close">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={listSearchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Messenger"
              className="w-full pl-12 pr-4 py-3 bg-gray-100/70 border border-gray-200 rounded-full outline-none focus:border-black transition-colors text-lg"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            {tabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-full text-base font-semibold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-sm text-gray-500">
            {currentUser?.name ? `Signed in as ${currentUser.name}` : 'Demo inbox'}
          </div>
        </div>

        {/* Body */}
        <div className="h-[calc(100%-196px)] flex flex-col">
          {/* List */}
          {!activeId && (
            <>
              <div className="flex-1 overflow-auto px-2 pb-2">
                {filtered.map((t) => {
                  const last = t.messages?.[t.messages.length - 1];
                  const preview = last?.text ?? 'Say hi';
                  const time = last?.time ?? '';
                  const unreadDot = (t.unread ?? 0) > 0;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => openThread(t.id)}
                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors micro-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                            {t.avatarText}
                          </div>
                          {unreadDot && (
                            <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xl font-semibold text-gray-900 truncate">{t.name}</div>
                          <div className="text-base text-gray-500 truncate">
                            <span className="text-gray-500">You: </span>
                            {preview}
                            {time ? ` · ${time}` : ''}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {loading ? (
                  <div className="px-6 py-10 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
                    Loading conversations...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="px-6 py-10 text-center text-gray-500">No chats found.</div>
                ) : null}
              </div>
            </>
          )}

          {/* Chat */}
          {activeId && active && (
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors micro-icon"
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                    {active.avatarText}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-gray-900 truncate">{active.name}</div>
                    <div className="text-sm text-gray-500 truncate">{active.subtitle}</div>
                  </div>
                </div>
                <button type="button" className="p-2 rounded-xl hover:bg-gray-100 transition-colors micro-icon" aria-label="More">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-auto px-4 py-4 space-y-3 bg-white dark:bg-black">
                {loading && active.messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Loading messages...</div>
                ) : active.messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No messages yet. Start the conversation!</div>
                ) : (
                  active.messages.map((m) => {
                  const mine = m.from === 'me';
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                          mine ? 'bg-brand text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.text}</div>
                      </div>
                    </div>
                  );
                  })
                )}
                <div ref={endRef} />
              </div>

              <div
                className="px-4 pt-3 pb-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950"
                style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={1}
                    placeholder="Aa"
                    className="flex-1 px-4 py-3 bg-gray-100/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full outline-none focus:border-brand transition-colors resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                    className="p-3 rounded-full bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

