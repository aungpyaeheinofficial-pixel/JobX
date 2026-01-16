# Feedback & Interactions Components

Complete UI/UX feedback components for JobX platform.

## 🎯 Components Created

### 1. Toast Notifications (`ToastNotification.jsx`)
**Purpose:** Non-intrusive notifications that appear temporarily

**Features:**
- 4 types: Success, Error, Warning, Info
- Auto-dismiss with configurable duration
- Stacking support for multiple toasts
- Smooth animations (fade in/out)
- Manual close option

**Usage:**
```jsx
import { ToastProvider, useToast } from './ToastNotification.jsx';

// Wrap your app with ToastProvider
<ToastProvider>
  <YourApp />
</ToastProvider>

// Inside your component
const toast = useToast();
toast.success('Operation completed!');
toast.error('Something went wrong');
toast.warning('Please review your input');
toast.info('New feature available');
```

---

### 2. Alert Components (`Alert.jsx`)
**Purpose:** Static alerts for displaying important information

**Components:**
- `Alert` - Standard alert with title, message, and action button
- `InlineAlert` - Compact inline alert
- `BannerAlert` - Full-width banner alert

**Features:**
- 4 types: Success, Error, Warning, Info
- Optional close button
- Optional action button
- Customizable icons

**Usage:**
```jsx
import Alert, { InlineAlert, BannerAlert } from './Alert.jsx';

// Standard Alert
<Alert
  type="success"
  title="Payment Successful"
  message="Your payment has been processed."
  onClose={() => setShowAlert(false)}
/>

// Inline Alert
<InlineAlert type="info" message="Changes saved" />

// Banner Alert
<BannerAlert
  type="warning"
  message="Scheduled maintenance tonight"
  onClose={() => setBanner(false)}
/>
```

---

### 3. Form Validation (`FormValidation.jsx`)
**Purpose:** Form inputs with built-in validation and error handling

**Components:**
- `FormInput` - Text input with validation
- `FormTextarea` - Textarea with character count
- `FormSelect` - Select dropdown with validation

**Hook:**
- `useFormValidation` - Custom hook for form state management

**Validators:**
- `required` - Field is required
- `email` - Valid email format
- `minLength(n)` - Minimum character length
- `maxLength(n)` - Maximum character length
- `phoneNumber` - Myanmar phone format
- `url` - Valid URL format
- `pattern(regex, msg)` - Custom regex pattern
- `match(value, name)` - Match another field

**Usage:**
```jsx
import { FormInput, useFormValidation, validators } from './FormValidation.jsx';

const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
  { email: '', name: '' },
  {
    email: [validators.required, validators.email],
    name: [validators.required, validators.minLength(2)]
  }
);

<FormInput
  label="Email"
  name="email"
  value={values.email}
  error={errors.email}
  touched={touched.email}
  onChange={handleChange}
  onBlur={handleBlur}
  required
  showSuccess
/>
```

---

### 4. Confirmation Modals (`ConfirmationModal.jsx`)
**Purpose:** Modal dialogs for confirming critical actions

**Components:**
- `ConfirmationModal` - Base modal component
- `DeleteConfirmationModal` - Pre-styled delete confirmation
- `LogoutConfirmationModal` - Pre-styled logout confirmation
- `DiscardChangesModal` - Pre-styled discard changes confirmation

**Features:**
- 4 variants: Default, Danger, Warning, Info
- Loading state support
- Keyboard shortcuts (ESC to close)
- Click outside to close
- Customizable icons and text

**Usage:**
```jsx
import { DeleteConfirmationModal } from './ConfirmationModal.jsx';

const [showModal, setShowModal] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const handleConfirm = () => {
  setIsLoading(true);
  // Perform delete action
  setTimeout(() => {
    setIsLoading(false);
    setShowModal(false);
  }, 1000);
};

<DeleteConfirmationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  itemName="Project Alpha"
  isLoading={isLoading}
/>
```

---

### 5. Progress Indicators (`ProgressIndicator.jsx`)
**Purpose:** Various progress indicators for different use cases

**Components:**
- `LinearProgress` - Horizontal progress bar
- `CircularProgress` - Circular/radial progress
- `StepProgress` - Multi-step wizard progress
- `DotsProgress` - Dot indicators for carousels
- `Spinner` - Loading spinner (4 sizes)
- `LoadingOverlay` - Full page loading overlay
- `Skeleton` - Skeleton loader for content

**Features:**
- Smooth animations
- Configurable colors and sizes
- Clickable steps
- Responsive design

**Usage:**
```jsx
import {
  LinearProgress,
  CircularProgress,
  StepProgress,
  Spinner,
  LoadingOverlay
} from './ProgressIndicator.jsx';

// Linear Progress
<LinearProgress progress={65} />

// Circular Progress
<CircularProgress progress={80} size={120} />

// Multi-step Progress
<StepProgress
  steps={[
    { label: 'Personal Info', description: 'Basic details' },
    { label: 'Contact', description: 'Phone & email' },
    { label: 'Review', description: 'Confirm' }
  ]}
  currentStep={1}
  onStepClick={setStep}
/>

// Spinner
<Spinner size="lg" />

// Loading Overlay
<LoadingOverlay show={isLoading} message="Processing..." />
```

---

## 🎨 Demo Page

**Access:** `http://localhost:5175/#feedback`

Interactive demo showcasing all components with working examples.

---

## 📦 Integration Guide

### 1. Add ToastProvider to App.jsx
```jsx
import { ToastProvider } from './ToastNotification.jsx';

const App = () => {
  return (
    <ToastProvider>
      {/* Your app components */}
    </ToastProvider>
  );
};
```

### 2. Use in Components
```jsx
import { useToast } from './ToastNotification.jsx';
import { FormInput, validators, useFormValidation } from './FormValidation.jsx';
import { LogoutConfirmationModal } from './ConfirmationModal.jsx';

const MyComponent = () => {
  const toast = useToast();

  const handleSubmit = () => {
    toast.success('Form submitted successfully!');
  };

  return (
    // Your component JSX
  );
};
```

---

## 🎯 Best Practices

### Toast Notifications
- Use sparingly to avoid notification fatigue
- Keep messages short and actionable
- Auto-dismiss after 3-5 seconds
- Stack maximum 3-4 toasts at a time

### Alerts
- Use for important information that requires attention
- Place near relevant content
- Allow users to dismiss non-critical alerts
- Use appropriate severity levels

### Form Validation
- Validate on blur, not on every keystroke
- Show success indicators for valid fields
- Group related fields together
- Provide helpful error messages

### Confirmation Modals
- Use for destructive actions (delete, logout, etc.)
- Make consequences clear in the message
- Use danger variant for irreversible actions
- Show loading state during async operations

### Progress Indicators
- Use linear progress for file uploads
- Use circular progress for overall completion
- Use step progress for multi-step forms
- Show skeleton loaders while loading content

---

## 🚀 Next Steps

1. **Integrate into existing pages:**
   - Add form validation to JobXAuth.jsx
   - Add toast notifications to Dashboard.jsx
   - Add confirmation modals to ProfilePage.jsx
   - Add progress indicators to PostJob.jsx

2. **Create additional variants:**
   - Custom branded toast designs
   - Animated success confirmations
   - Interactive progress indicators

3. **Accessibility improvements:**
   - ARIA live regions for toasts
   - Focus management in modals
   - Keyboard navigation for progress steps

---

## 📝 Dependencies

All components use:
- **React** - Base framework
- **Framer Motion** - Animations
- **Lucide React** - Icons

No additional dependencies required!

---

Built with ❤️ for JobX Myanmar
