import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Briefcase,
  MessageSquare,
  Heart,
  UserPlus,
  Star,
  CheckCircle,
  Eye,
  Award,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  X,
  Check,
  Settings,
  ChevronRight,
  Clock,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

// Notification types and their configurations
const notificationTypes = {
  job_application: {
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
    title: 'Application Update'
  },
  job_alert: {
    icon: Briefcase,
    color: 'bg-violet-100 text-violet-600',
    title: 'Job Alert'
  },
  message: {
    icon: MessageSquare,
    color: 'bg-green-100 text-green-600',
    title: 'New Message'
  },
  like: {
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    title: 'Like'
  },
  comment: {
    icon: MessageSquare,
    color: 'bg-amber-100 text-amber-600',
    title: 'Comment'
  },
  follow: {
    icon: UserPlus,
    color: 'bg-purple-100 text-purple-600',
    title: 'New Follower'
  },
  endorsement: {
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600',
    title: 'Skill Endorsed'
  },
  profile_view: {
    icon: Eye,
    color: 'bg-cyan-100 text-cyan-600',
    title: 'Profile View'
  },
  achievement: {
    icon: Award,
    color: 'bg-orange-100 text-orange-600',
    title: 'Achievement'
  },
  interview: {
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-600',
    title: 'Interview'
  },
  accepted: {
    icon: CheckCircle,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Accepted'
  },
  community: {
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    title: 'Community'
  }
};

// Demo notifications data
const demoNotifications = [
  {
    id: 1,
    type: 'accepted',
    title: 'Congratulations! 🎉',
    message: 'Your application for Frontend Developer at TechStart Myanmar has been accepted!',
    time: '2 minutes ago',
    timestamp: Date.now() - 2 * 60 * 1000,
    read: false,
    actionUrl: '/applications',
    avatar: null,
    sender: 'TechStart Myanmar'
  },
  {
    id: 2,
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'You have an interview with Digital Solutions on Jan 20, 2025 at 2:00 PM',
    time: '15 minutes ago',
    timestamp: Date.now() - 15 * 60 * 1000,
    read: false,
    actionUrl: '/applications',
    avatar: null,
    sender: 'Digital Solutions'
  },
  {
    id: 3,
    type: 'profile_view',
    title: 'Someone viewed your profile',
    message: 'A recruiter from App Innovators viewed your profile',
    time: '1 hour ago',
    timestamp: Date.now() - 60 * 60 * 1000,
    read: false,
    actionUrl: '/profile',
    avatar: null,
    sender: 'App Innovators'
  },
  {
    id: 4,
    type: 'endorsement',
    title: 'Skill Endorsed',
    message: 'Thiri Win endorsed you for React',
    time: '2 hours ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
    actionUrl: '/profile',
    avatar: null,
    sender: 'Thiri Win'
  },
  {
    id: 5,
    type: 'job_alert',
    title: 'New job matches your profile',
    message: 'UI/UX Designer at Design Studio - 90% match',
    time: '3 hours ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/opportunities',
    avatar: null,
    sender: 'JobX'
  },
  {
    id: 6,
    type: 'like',
    title: 'Post liked',
    message: 'Min Thu and 5 others liked your post about React best practices',
    time: '5 hours ago',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/community',
    avatar: null,
    sender: 'Min Thu'
  },
  {
    id: 7,
    type: 'comment',
    title: 'New comment',
    message: 'Aung Kyaw commented on your post: "Great insights! Thanks for sharing..."',
    time: '6 hours ago',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/community',
    avatar: null,
    sender: 'Aung Kyaw'
  },
  {
    id: 8,
    type: 'follow',
    title: 'New follower',
    message: 'Phyu Phyu started following you',
    time: '1 day ago',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/profile',
    avatar: null,
    sender: 'Phyu Phyu'
  },
  {
    id: 9,
    type: 'community',
    title: 'Trending in Tech Community',
    message: 'A discussion you follow has 50+ new comments',
    time: '1 day ago',
    timestamp: Date.now() - 26 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/community',
    avatar: null,
    sender: 'Tech Community'
  },
  {
    id: 10,
    type: 'achievement',
    title: 'Achievement Unlocked! 🏆',
    message: 'You earned the "Rising Star" badge for receiving 10 skill endorsements',
    time: '2 days ago',
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
    read: true,
    actionUrl: '/profile',
    avatar: null,
    sender: 'JobX'
  }
];

const NotificationItem = ({ notification, onRead, onDelete, onNavigate }) => {
  const config = notificationTypes[notification.type] || notificationTypes.job_alert;
  const Icon = config.icon;

  return (
    <div
      className={`relative group flex gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
      onClick={() => {
        onRead(notification.id);
        if (notification.actionUrl) {
          onNavigate(notification.actionUrl.replace('/', ''));
        }
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
            {notification.message}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{notification.time}</span>
          {notification.sender && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{notification.sender}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification.id);
            }}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4 text-gray-500" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="Delete"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export const NotificationsDropdown = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState('all'); // all, unread
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleNavigate = (view) => {
    setIsOpen(false);
    if (onNavigate) onNavigate(view);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-full border border-gray-200/60 shadow-lg hover:bg-white/90 transition-all"
      >
        <Bell className="w-5 h-5 text-gray-700" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-[420px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => handleNavigate('settings')}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notification settings"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  filter === 'unread' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[400px]">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h3>
                <p className="text-sm text-gray-500">
                  {filter === 'unread' 
                    ? "You're all caught up!" 
                    : "When you get notifications, they'll show up here"
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Today */}
                {filteredNotifications.some(n => n.timestamp > Date.now() - 24 * 60 * 60 * 1000) && (
                  <>
                    <div className="px-5 py-2 bg-gray-50">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today</span>
                    </div>
                    {filteredNotifications
                      .filter(n => n.timestamp > Date.now() - 24 * 60 * 60 * 1000)
                      .map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onRead={markAsRead}
                          onDelete={deleteNotification}
                          onNavigate={handleNavigate}
                        />
                      ))
                    }
                  </>
                )}

                {/* Earlier */}
                {filteredNotifications.some(n => n.timestamp <= Date.now() - 24 * 60 * 60 * 1000) && (
                  <>
                    <div className="px-5 py-2 bg-gray-50">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Earlier</span>
                    </div>
                    {filteredNotifications
                      .filter(n => n.timestamp <= Date.now() - 24 * 60 * 60 * 1000)
                      .map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onRead={markAsRead}
                          onDelete={deleteNotification}
                          onNavigate={handleNavigate}
                        />
                      ))
                    }
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 flex items-center justify-between">
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
              <button
                onClick={() => handleNavigate('notifications')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                See all notifications
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
