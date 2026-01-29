import React, { useState } from 'react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import { FormInput, FormSelect, FormTextarea, useFormValidation, validators } from './FormValidation.jsx';
import { ToastProvider, useToast } from './ToastNotification.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Mail,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Download,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor,
  Zap,
  Volume2,
  VolumeX,
  Accessibility,
  Type,
  MousePointer,
  Keyboard,
  Clock,
  MapPin,
} from 'lucide-react';

const SettingsPageContent = ({ userData, userRole, onNavigate, onLogout, onOpenMessages }) => {
  const [activeSection, setActiveSection] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();

  // Settings state
  const [settings, setSettings] = useState({
    // Account
    name: userData?.name || 'Aung Pyae Hein',
    email: userData?.email || 'aungpyae@jobx.com',
    phone: '09123456789',
    bio: 'Full Stack Developer passionate about building products',
    location: 'Yangon, Myanmar',

    // System Preferences
    language: 'en',
    theme: 'dark',
    timezone: 'Asia/Yangon',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',

    // Display Settings
    fontSize: 'medium',
    fontFamily: 'default',
    compactMode: false,
    highContrast: false,
    reducedMotion: false,

    // Accessibility
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    largeClickTargets: false,

    // Sound & Notifications
    soundEffects: true,
    notificationSounds: true,
    volume: 70,

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    communityUpdates: true,
    projectInvites: true,
    messageNotifications: true,
    weeklyDigest: false,

    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessagesFrom: 'everyone',
  });

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'data', label: 'Data & Storage', icon: Download },
  ];

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.info('Preparing your data export...');
    setTimeout(() => {
      toast.success('Data export is ready for download');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      {children}
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="font-semibold text-gray-900 mb-1">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          checked ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm ${
            checked ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  const RadioOption = ({ label, description, value, checked, onChange }) => (
    <button
      onClick={() => onChange(value)}
      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
        checked
          ? 'border-black bg-gray-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
        checked ? 'border-black' : 'border-gray-300'
      }`}>
        {checked && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
      </div>
      <div className="text-left flex-1">
        <div className="font-semibold text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="settings"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        showPostButton={false}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-2 sticky top-24">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    <span className="font-semibold text-sm">{section.label}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Account Settings */}
                {activeSection === 'account' && (
                  <>
                    <SettingSection
                      title="Profile Information"
                      description="Update your personal information and profile details"
                    >
                      <div className="space-y-4">
                        <FormInput
                          label="Full Name"
                          name="name"
                          value={settings.name}
                          onChange={(_, value) => handleSettingChange('name', value)}
                          onBlur={() => {}}
                          required
                        />
                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          value={settings.email}
                          onChange={(_, value) => handleSettingChange('email', value)}
                          onBlur={() => {}}
                          required
                        />
                        <FormInput
                          label="Phone Number"
                          name="phone"
                          value={settings.phone}
                          onChange={(_, value) => handleSettingChange('phone', value)}
                          onBlur={() => {}}
                        />
                        <FormInput
                          label="Location"
                          name="location"
                          value={settings.location}
                          onChange={(_, value) => handleSettingChange('location', value)}
                          onBlur={() => {}}
                        />
                        <FormTextarea
                          label="Bio"
                          name="bio"
                          value={settings.bio}
                          onChange={(_, value) => handleSettingChange('bio', value)}
                          onBlur={() => {}}
                          rows={4}
                          maxLength={200}
                        />
                      </div>
                    </SettingSection>

                    <SettingSection title="Password" description="Change your password">
                      <div className="space-y-4">
                        <FormInput
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                          onChange={() => {}}
                          onBlur={() => {}}
                        />
                        <FormInput
                          label="New Password"
                          name="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          onChange={() => {}}
                          onBlur={() => {}}
                        />
                        <FormInput
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          onChange={() => {}}
                          onBlur={() => {}}
                        />
                      </div>
                    </SettingSection>
                  </>
                )}

                {/* System Settings */}
                {activeSection === 'system' && (
                  <>
                    <SettingSection
                      title="Language & Region"
                      description="Set your preferred language and regional formats"
                    >
                      <div className="space-y-4">
                        <FormSelect
                          label="Language"
                          name="language"
                          value={settings.language}
                          onChange={(_, value) => handleSettingChange('language', value)}
                          onBlur={() => {}}
                          options={[
                            { value: 'en', label: 'English' },
                            { value: 'my', label: 'Myanmar (မြန်မာ)' },
                            { value: 'zh', label: 'Chinese (中文)' },
                            { value: 'th', label: 'Thai (ไทย)' },
                          ]}
                        />
                        <FormSelect
                          label="Timezone"
                          name="timezone"
                          value={settings.timezone}
                          onChange={(_, value) => handleSettingChange('timezone', value)}
                          onBlur={() => {}}
                          options={[
                            { value: 'Asia/Yangon', label: 'Yangon (GMT+6:30)' },
                            { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
                            { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
                            { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)' },
                            { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
                          ]}
                        />
                      </div>
                    </SettingSection>

                    <SettingSection
                      title="Date & Time Format"
                      description="Choose how dates and times are displayed"
                    >
                      <div className="space-y-4">
                        <FormSelect
                          label="Date Format"
                          name="dateFormat"
                          value={settings.dateFormat}
                          onChange={(_, value) => handleSettingChange('dateFormat', value)}
                          onBlur={() => {}}
                          options={[
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/01/2026)' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/15/2026)' },
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-01-15)' },
                          ]}
                        />
                        <FormSelect
                          label="Time Format"
                          name="timeFormat"
                          value={settings.timeFormat}
                          onChange={(_, value) => handleSettingChange('timeFormat', value)}
                          onBlur={() => {}}
                          options={[
                            { value: '24h', label: '24-hour (14:30)' },
                            { value: '12h', label: '12-hour (2:30 PM)' },
                          ]}
                        />
                      </div>
                    </SettingSection>

                    <SettingSection
                      title="Performance"
                      description="Optimize app performance for your device"
                    >
                      <ToggleSwitch
                        label="Reduced Motion"
                        description="Minimize animations and transitions"
                        checked={settings.reducedMotion}
                        onChange={(value) => handleSettingChange('reducedMotion', value)}
                      />
                      <ToggleSwitch
                        label="Compact Mode"
                        description="Show more content with tighter spacing"
                        checked={settings.compactMode}
                        onChange={(value) => handleSettingChange('compactMode', value)}
                      />
                    </SettingSection>
                  </>
                )}

                {/* Appearance Settings */}
                {activeSection === 'appearance' && (
                  <>
                    <SettingSection
                      title="Theme"
                      description="Choose your preferred color scheme"
                    >
                      <div className="space-y-3">
                        <RadioOption
                          label="Light Mode"
                          description="Use light colors throughout the app"
                          value="light"
                          checked={settings.theme === 'light'}
                          onChange={(value) => handleSettingChange('theme', value)}
                        />
                        <RadioOption
                          label="Dark Mode"
                          description="Use dark colors throughout the app"
                          value="dark"
                          checked={settings.theme === 'dark'}
                          onChange={(value) => handleSettingChange('theme', value)}
                        />
                        <RadioOption
                          label="Auto"
                          description="Match your system settings"
                          value="auto"
                          checked={settings.theme === 'auto'}
                          onChange={(value) => handleSettingChange('theme', value)}
                        />
                      </div>
                    </SettingSection>

                    <SettingSection
                      title="Text & Display"
                      description="Customize how text and content appear"
                    >
                      <div className="space-y-4 mb-6">
                        <FormSelect
                          label="Font Size"
                          name="fontSize"
                          value={settings.fontSize}
                          onChange={(_, value) => handleSettingChange('fontSize', value)}
                          onBlur={() => {}}
                          options={[
                            { value: 'small', label: 'Small - Compact text' },
                            { value: 'medium', label: 'Medium - Comfortable reading' },
                            { value: 'large', label: 'Large - Easy to read' },
                            { value: 'xlarge', label: 'Extra Large - Maximum readability' },
                          ]}
                        />
                        <FormSelect
                          label="Font Family"
                          name="fontFamily"
                          value={settings.fontFamily}
                          onChange={(_, value) => handleSettingChange('fontFamily', value)}
                          onBlur={() => {}}
                          options={[
                            { value: 'default', label: 'Default - System font' },
                            { value: 'serif', label: 'Serif - Traditional' },
                            { value: 'mono', label: 'Monospace - Code-style' },
                          ]}
                        />
                      </div>
                      <ToggleSwitch
                        label="High Contrast"
                        description="Increase color contrast for better visibility"
                        checked={settings.highContrast}
                        onChange={(value) => handleSettingChange('highContrast', value)}
                      />
                    </SettingSection>

                    <SettingSection
                      title="Preview"
                      description="See how your settings look"
                    >
                      <div
                        className={`p-6 rounded-xl border ${
                          settings.highContrast
                            ? 'bg-black text-white border-white'
                            : 'bg-gray-50 text-gray-900 border-gray-200'
                        }`}
                        style={{
                          fontSize: {
                            small: '14px',
                            medium: '16px',
                            large: '18px',
                            xlarge: '20px',
                          }[settings.fontSize],
                          fontFamily: {
                            default: 'system-ui',
                            serif: 'Georgia, serif',
                            mono: 'monospace',
                          }[settings.fontFamily],
                        }}
                      >
                        <h4 className="font-bold mb-2">Sample Heading</h4>
                        <p className="mb-2">This is how your text will appear with current settings.</p>
                        <p className="text-sm opacity-75">Secondary text at smaller size.</p>
                      </div>
                    </SettingSection>
                  </>
                )}

                {/* Accessibility Settings */}
                {activeSection === 'accessibility' && (
                  <>
                    <SettingSection
                      title="Navigation"
                      description="Control how you navigate through the app"
                    >
                      <ToggleSwitch
                        label="Keyboard Navigation"
                        description="Enable full keyboard control"
                        checked={settings.keyboardNavigation}
                        onChange={(value) => handleSettingChange('keyboardNavigation', value)}
                      />
                      <ToggleSwitch
                        label="Focus Indicators"
                        description="Show visible focus outlines"
                        checked={settings.focusIndicators}
                        onChange={(value) => handleSettingChange('focusIndicators', value)}
                      />
                      <ToggleSwitch
                        label="Large Click Targets"
                        description="Increase button and link sizes"
                        checked={settings.largeClickTargets}
                        onChange={(value) => handleSettingChange('largeClickTargets', value)}
                      />
                    </SettingSection>

                    <SettingSection
                      title="Screen Reader"
                      description="Optimize for screen reader users"
                    >
                      <ToggleSwitch
                        label="Screen Reader Support"
                        description="Enable enhanced screen reader compatibility"
                        checked={settings.screenReader}
                        onChange={(value) => handleSettingChange('screenReader', value)}
                      />
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Screen Reader Shortcuts:</strong><br/>
                          • Tab - Navigate forward<br/>
                          • Shift+Tab - Navigate backward<br/>
                          • Enter/Space - Activate<br/>
                          • Escape - Close dialogs
                        </p>
                      </div>
                    </SettingSection>

                    <SettingSection
                      title="Motion & Animation"
                      description="Control movement and visual effects"
                    >
                      <ToggleSwitch
                        label="Reduce Motion"
                        description="Minimize animations for motion sensitivity"
                        checked={settings.reducedMotion}
                        onChange={(value) => handleSettingChange('reducedMotion', value)}
                      />
                      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm text-amber-800">
                          💡 <strong>Tip:</strong> Reducing motion can help with motion sickness
                          and improve focus for users with ADHD or vestibular disorders.
                        </p>
                      </div>
                    </SettingSection>
                  </>
                )}

                {/* Sound Settings */}
                {activeSection === 'sound' && (
                  <>
                    <SettingSection
                      title="Sound Effects"
                      description="Control app sounds and audio feedback"
                    >
                      <ToggleSwitch
                        label="UI Sound Effects"
                        description="Play sounds for clicks and actions"
                        checked={settings.soundEffects}
                        onChange={(value) => handleSettingChange('soundEffects', value)}
                      />
                      <ToggleSwitch
                        label="Notification Sounds"
                        description="Play sounds for new notifications"
                        checked={settings.notificationSounds}
                        onChange={(value) => handleSettingChange('notificationSounds', value)}
                      />
                    </SettingSection>

                    <SettingSection
                      title="Volume"
                      description="Adjust sound volume levels"
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-gray-900">
                              Master Volume
                            </label>
                            <span className="text-sm font-bold text-gray-900">
                              {settings.volume}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.volume}
                            onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                          />
                        </div>

                        <button
                          onClick={() => {
                            // Play test sound
                            toast.info('🔊 Test sound played');
                          }}
                          className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          {settings.volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                          Test Sound
                        </button>
                      </div>
                    </SettingSection>
                  </>
                )}

                {/* Notifications Settings */}
                {activeSection === 'notifications' && (
                  <>
                    <SettingSection
                      title="Notification Channels"
                      description="Choose how you want to receive notifications"
                    >
                      <ToggleSwitch
                        label="Email Notifications"
                        description="Receive notifications via email"
                        checked={settings.emailNotifications}
                        onChange={(value) => handleSettingChange('emailNotifications', value)}
                      />
                      <ToggleSwitch
                        label="Push Notifications"
                        description="Receive push notifications on your device"
                        checked={settings.pushNotifications}
                        onChange={(value) => handleSettingChange('pushNotifications', value)}
                      />
                    </SettingSection>

                    <SettingSection
                      title="Activity Notifications"
                      description="Control what activities trigger notifications"
                    >
                      <ToggleSwitch
                        label="Job Alerts"
                        description="Get notified about new job opportunities"
                        checked={settings.jobAlerts}
                        onChange={(value) => handleSettingChange('jobAlerts', value)}
                      />
                      <ToggleSwitch
                        label="Community Updates"
                        description="Get notified about posts in your communities"
                        checked={settings.communityUpdates}
                        onChange={(value) => handleSettingChange('communityUpdates', value)}
                      />
                      <ToggleSwitch
                        label="Project Invites"
                        description="Get notified when invited to projects"
                        checked={settings.projectInvites}
                        onChange={(value) => handleSettingChange('projectInvites', value)}
                      />
                      <ToggleSwitch
                        label="Messages"
                        description="Get notified about new messages"
                        checked={settings.messageNotifications}
                        onChange={(value) => handleSettingChange('messageNotifications', value)}
                      />
                      <ToggleSwitch
                        label="Weekly Digest"
                        description="Receive a weekly summary email"
                        checked={settings.weeklyDigest}
                        onChange={(value) => handleSettingChange('weeklyDigest', value)}
                      />
                    </SettingSection>
                  </>
                )}

                {/* Privacy & Security Settings */}
                {activeSection === 'privacy' && (
                  <>
                    <SettingSection
                      title="Profile Visibility"
                      description="Control who can see your profile"
                    >
                      <div className="space-y-3">
                        <RadioOption
                          label="Public"
                          description="Anyone can view your profile"
                          value="public"
                          checked={settings.profileVisibility === 'public'}
                          onChange={(value) => handleSettingChange('profileVisibility', value)}
                        />
                        <RadioOption
                          label="Community Only"
                          description="Only members of your communities can see your profile"
                          value="community"
                          checked={settings.profileVisibility === 'community'}
                          onChange={(value) => handleSettingChange('profileVisibility', value)}
                        />
                        <RadioOption
                          label="Private"
                          description="Only you can see your profile"
                          value="private"
                          checked={settings.profileVisibility === 'private'}
                          onChange={(value) => handleSettingChange('profileVisibility', value)}
                        />
                      </div>
                    </SettingSection>

                    <SettingSection
                      title="Contact Information"
                      description="Control what contact info is visible"
                    >
                      <ToggleSwitch
                        label="Show Email Address"
                        description="Display your email on your profile"
                        checked={settings.showEmail}
                        onChange={(value) => handleSettingChange('showEmail', value)}
                      />
                      <ToggleSwitch
                        label="Show Phone Number"
                        description="Display your phone number on your profile"
                        checked={settings.showPhone}
                        onChange={(value) => handleSettingChange('showPhone', value)}
                      />
                      <ToggleSwitch
                        label="Show Location"
                        description="Display your location on your profile"
                        checked={settings.showLocation}
                        onChange={(value) => handleSettingChange('showLocation', value)}
                      />
                    </SettingSection>

                    <SettingSection
                      title="Messaging"
                      description="Control who can send you messages"
                    >
                      <div className="space-y-3">
                        <RadioOption
                          label="Everyone"
                          description="Anyone can send you messages"
                          value="everyone"
                          checked={settings.allowMessagesFrom === 'everyone'}
                          onChange={(value) => handleSettingChange('allowMessagesFrom', value)}
                        />
                        <RadioOption
                          label="Community Members Only"
                          description="Only people in your communities can message you"
                          value="community"
                          checked={settings.allowMessagesFrom === 'community'}
                          onChange={(value) => handleSettingChange('allowMessagesFrom', value)}
                        />
                        <RadioOption
                          label="No One"
                          description="Disable all incoming messages"
                          value="none"
                          checked={settings.allowMessagesFrom === 'none'}
                          onChange={(value) => handleSettingChange('allowMessagesFrom', value)}
                        />
                      </div>
                    </SettingSection>
                  </>
                )}

                {/* Data & Storage Settings */}
                {activeSection === 'data' && (
                  <>
                    <SettingSection
                      title="Download Your Data"
                      description="Export a copy of your JobX data"
                    >
                      <p className="text-gray-600 mb-4">
                        Download a copy of your profile, posts, projects, and other data.
                      </p>
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
                      >
                        <Download className="w-5 h-5" />
                        Export Data
                      </button>
                    </SettingSection>

                    <SettingSection
                      title="Delete Account"
                      description="Permanently delete your account and all data"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-800 text-sm font-medium">
                          ⚠️ This action cannot be undone. All your data will be permanently deleted.
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </button>
                    </SettingSection>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Save Button */}
            {activeSection !== 'data' && (
              <div className="sticky bottom-6 mt-8">
                <button
                  onClick={handleSave}
                  className="w-full px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = (props) => {
  return (
    <ToastProvider>
      <SettingsPageContent {...props} />
    </ToastProvider>
  );
};

export default SettingsPage;
