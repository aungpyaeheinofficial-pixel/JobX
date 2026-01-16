# Settings Page

Comprehensive settings and preferences management for JobX users.

## 📋 Overview

A beautifully designed settings page with multiple sections for managing account, preferences, notifications, privacy, and data.

---

## 🎯 Features

### **5 Main Sections:**

1. **Account Settings**
   - Profile information (name, email, phone, location, bio)
   - Password management
   - Profile picture

2. **Preferences**
   - Language selection (English, Myanmar)
   - Timezone settings
   - Theme/Appearance (Light, Dark, Auto)

3. **Notifications**
   - Notification channels (Email, Push)
   - Activity notifications (Jobs, Community, Projects, Messages)
   - Weekly digest

4. **Privacy & Security**
   - Profile visibility (Public, Community, Private)
   - Contact information visibility
   - Messaging permissions
   - Data sharing controls

5. **Data & Storage**
   - Export your data
   - Delete account (with warning)

---

## 🎨 UI Components

### Sidebar Navigation
- Sticky sidebar with icon navigation
- Active state highlighting
- Smooth transitions between sections

### Toggle Switch
- Custom animated switch
- Spring-based animation
- Clear on/off states

### Radio Options
- Large clickable cards
- Visual selection indicator
- Description text for clarity

### Form Inputs
- All form components from `FormValidation.jsx`
- Inline validation
- Character counters
- Success/error states

---

## 🔧 How It Works

### State Management
```jsx
const [settings, setSettings] = useState({
  // Account
  name: 'Aung Pyae Hein',
  email: 'aungpyae@jobx.com',

  // Preferences
  language: 'en',
  theme: 'light',

  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  jobAlerts: true,

  // Privacy
  profileVisibility: 'public',
  showEmail: false,
});
```

### Saving Settings
```jsx
const handleSave = () => {
  // API call to save settings
  toast.success('Settings saved successfully!');
};
```

### Section Navigation
```jsx
const [activeSection, setActiveSection] = useState('account');

// Animated section transitions
<AnimatePresence mode="wait">
  <motion.div key={activeSection}>
    {/* Section content */}
  </motion.div>
</AnimatePresence>
```

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar + content layout (4 column grid)
- Sticky sidebar navigation
- Full-width form inputs

### Tablet (≥768px)
- Sidebar collapses to icons
- Content area adjusts
- Maintains two-column layout

### Mobile (<768px)
- Stacked layout
- Full-width sections
- Sticky save button

---

## 🎭 Animations

### Section Transitions
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.2 }}
```

### Toggle Switch
```jsx
<motion.div
  layout
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  className="toggle-thumb"
/>
```

### Save Button
- Sticky at bottom
- Gradient background
- Hover shadow effect

---

## 🔐 Privacy Controls

### Profile Visibility Options

**Public**
- Anyone can view your profile
- Appear in search results
- Maximum visibility

**Community Only**
- Only community members can see you
- Limited search visibility
- Balanced privacy

**Private**
- Only you can see your profile
- No search results
- Maximum privacy

### Contact Information

Users can control visibility of:
- Email address
- Phone number
- Location

### Messaging Permissions

Options:
- **Everyone** - Anyone can message
- **Community Members Only** - Restricted access
- **No One** - Disabled messaging

---

## 🔔 Notification Settings

### Channels
- Email notifications
- Push notifications

### Activities
- Job alerts
- Community updates
- Project invites
- New messages
- Weekly digest

---

## 💾 Data Management

### Export Data
```jsx
const handleExportData = () => {
  toast.info('Preparing your data export...');
  // API call to generate export
  setTimeout(() => {
    toast.success('Data export is ready for download');
  }, 2000);
};
```

### Delete Account
- Warning modal
- Confirmation required
- Irreversible action

---

## 🎨 Custom Components

### SettingSection
Wrapper for settings groups:
```jsx
<SettingSection
  title="Profile Information"
  description="Update your personal information"
>
  {/* Form inputs */}
</SettingSection>
```

### ToggleSwitch
Animated toggle with label:
```jsx
<ToggleSwitch
  label="Email Notifications"
  description="Receive notifications via email"
  checked={settings.emailNotifications}
  onChange={(value) => handleSettingChange('emailNotifications', value)}
/>
```

### RadioOption
Large clickable radio button:
```jsx
<RadioOption
  label="Public"
  description="Anyone can view your profile"
  value="public"
  checked={settings.profileVisibility === 'public'}
  onChange={(value) => handleSettingChange('profileVisibility', value)}
/>
```

---

## 🚀 Integration

### Access Settings

**From Enhanced Navigation:**
```jsx
<EnhancedAvatar
  userData={userData}
  onSettings={() => onNavigate('settings')}
/>
```

**Direct Navigation:**
```jsx
onNavigate('settings')
```

### Props Required
```jsx
<SettingsPage
  userData={userData}
  onNavigate={handleNavigate}
  onLogout={handleLogout}
  onOpenMessages={handleOpenMessages}
/>
```

---

## 🎯 Usage Examples

### Basic Integration
```jsx
import SettingsPage from './SettingsPage.jsx';

function App() {
  return (
    <SettingsPage
      userData={{ name: 'User', email: 'user@example.com' }}
      onNavigate={(view) => console.log('Navigate to:', view)}
      onLogout={() => console.log('Logout')}
      onOpenMessages={() => console.log('Messages')}
    />
  );
}
```

### With State Management
```jsx
const [settings, setSettings] = useState(initialSettings);

const saveSettings = async (newSettings) => {
  try {
    await api.updateSettings(newSettings);
    setSettings(newSettings);
    toast.success('Settings saved!');
  } catch (error) {
    toast.error('Failed to save settings');
  }
};
```

---

## 🎨 Styling

### Color Palette
```css
/* Active State */
background: #000000
text: #ffffff

/* Hover State */
background: #f9fafb
border: #d1d5db

/* Disabled State */
opacity: 0.5
cursor: not-allowed
```

### Border Radius
- Cards: `16px` (rounded-2xl)
- Buttons: `12px` (rounded-xl)
- Inputs: `12px` (rounded-xl)
- Toggles: `9999px` (rounded-full)

### Shadows
```css
/* Default */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)

/* Hover */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

---

## ♿ Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to toggle switches
- Arrow keys for radio groups

### Screen Readers
- Descriptive labels on all inputs
- Section headings properly structured
- Toggle states announced

### Focus Management
- Visible focus indicators
- Logical tab order
- Skip to section links

---

## 🔄 State Persistence

### Local Storage (Client-side)
```jsx
// Save to localStorage
localStorage.setItem('jobx_settings', JSON.stringify(settings));

// Load from localStorage
const saved = localStorage.getItem('jobx_settings');
if (saved) {
  setSettings(JSON.parse(saved));
}
```

### API Integration (Server-side)
```jsx
// Save to backend
const saveSettings = async (settings) => {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return response.json();
};
```

---

## 🐛 Common Issues

### Toggle Not Working
- Ensure state is updating correctly
- Check onChange handler is called
- Verify no conflicting event handlers

### Form Not Saving
- Check toast notifications working
- Verify handleSave is called
- Ensure no validation errors

### Section Not Switching
- Check activeSection state
- Verify AnimatePresence key
- Check motion dependencies

---

## 🎯 Future Enhancements

### Planned Features
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Connected accounts (OAuth)
- [ ] API keys management
- [ ] Webhook configuration
- [ ] Export preferences
- [ ] Import settings
- [ ] Settings search
- [ ] Recent changes history
- [ ] Undo/redo changes

### UI Improvements
- [ ] Dark mode styling
- [ ] Compact mode option
- [ ] Settings presets
- [ ] Quick settings panel
- [ ] Keyboard shortcuts

---

## 📊 Settings Schema

```typescript
interface Settings {
  // Account
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;

  // Preferences
  language: 'en' | 'my';
  theme: 'light' | 'dark' | 'auto';
  timezone: string;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  jobAlerts: boolean;
  communityUpdates: boolean;
  projectInvites: boolean;
  messageNotifications: boolean;
  weeklyDigest: boolean;

  // Privacy
  profileVisibility: 'public' | 'community' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessagesFrom: 'everyone' | 'community' | 'none';
}
```

---

## 📝 Testing

### Manual Testing Checklist
- [ ] All sections load correctly
- [ ] Toggle switches work
- [ ] Radio buttons select properly
- [ ] Forms validate inputs
- [ ] Save button works
- [ ] Toast notifications appear
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] No console errors

---

## 🤝 Dependencies

- **React** - UI framework
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **FormValidation.jsx** - Form components
- **ToastNotification.jsx** - Toast system
- **EnhancedLiquidNav.jsx** - Navigation

---

## 📄 License

Part of JobX application - Internal use only

---

Built with ❤️ for JobX Myanmar

For questions: Check the main app documentation
