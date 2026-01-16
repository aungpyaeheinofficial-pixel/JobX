# 🎨 JobX Premium Components

Apple-style micro-interactions and animations powered by Framer Motion.

## 📦 What's Included

### 1. **PremiumButton**
Spring-physics button with press feedback.

```jsx
import { PremiumButton } from './PremiumComponents.jsx';

<PremiumButton
  variant="primary"  // primary | secondary | ghost
  onClick={() => console.log('Clicked!')}
  icon={Sparkles}
  disabled={false}
>
  Click Me
</PremiumButton>
```

**Features:**
- Scale on hover (1.02x)
- Press feedback (0.98x)
- Spring physics animation
- Icon support
- Disabled state

---

### 2. **PremiumCard**
Card with hover lift effect.

```jsx
import { PremiumCard } from './PremiumComponents.jsx';

<PremiumCard hoverable={true} onClick={() => {}}>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</PremiumCard>
```

**Features:**
- Lifts 4px on hover
- Smooth shadow transition
- Rounded 3xl corners
- Optional onClick handler

---

### 3. **Skeleton Loaders**
Apple-style loading placeholders.

```jsx
import { Skeleton, CardSkeleton } from './PremiumComponents.jsx';

// Basic skeleton
<Skeleton variant="default" />
<Skeleton variant="title" />
<Skeleton variant="avatar" />
<Skeleton variant="button" />
<Skeleton variant="card" />

// Full card skeleton
<CardSkeleton />
```

**Features:**
- Shimmer animation
- Multiple variants
- Customizable className
- Smooth opacity pulse

---

### 4. **Toast Notifications**
Context-based notification system.

```jsx
import { useToast } from './ToastContext.jsx';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  return (
    <button onClick={() => showSuccess('Saved successfully!')}>
      Save
    </button>
  );
}
```

**Features:**
- 4 variants: success, error, info, warning
- Auto-dismiss (4s default)
- Manual close button
- Spring entrance/exit animations
- Stack multiple toasts

**Setup in App.jsx:**
```jsx
import { ToastProvider } from './ToastContext.jsx';

function App() {
  return (
    <ToastProvider>
      {/* Your app */}
    </ToastProvider>
  );
}
```

---

### 5. **StaggerContainer & StaggerItem**
Stagger animations for lists/grids.

```jsx
import { StaggerContainer, StaggerItem } from './PremiumComponents.jsx';

<StaggerContainer className="grid grid-cols-3 gap-4">
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

**Features:**
- 100ms stagger delay
- Fade in + slide up
- Works with any grid/list

---

### 6. **IconButton**
Circular icon button with hover scale.

```jsx
import { IconButton } from './PremiumComponents.jsx';
import { Heart } from 'lucide-react';

<IconButton
  icon={Heart}
  onClick={() => {}}
  label="Like"
  className="text-red-500"
/>
```

**Features:**
- 1.1x scale on hover
- 0.95x press feedback
- Circular shape
- Accessibility label

---

### 7. **ScaleOnHover**
Wrapper for scale effect.

```jsx
import { ScaleOnHover } from './PremiumComponents.jsx';

<ScaleOnHover scale={1.05}>
  <img src="/image.jpg" alt="Product" />
</ScaleOnHover>
```

---

### 8. **PremiumBadge**
Animated badge component.

```jsx
import { PremiumBadge } from './PremiumComponents.jsx';

<PremiumBadge variant="success">Active</PremiumBadge>
<PremiumBadge variant="warning">Pending</PremiumBadge>
<PremiumBadge variant="error">Failed</PremiumBadge>
<PremiumBadge variant="primary">Premium</PremiumBadge>
```

---

### 9. **LoadingDots**
Three-dot loading indicator.

```jsx
import { LoadingDots } from './PremiumComponents.jsx';

<button>
  {loading ? <LoadingDots /> : 'Submit'}
</button>
```

---

### 10. **RevealOnScroll**
Fade in when element enters viewport.

```jsx
import { RevealOnScroll } from './PremiumComponents.jsx';

<RevealOnScroll>
  <section>
    This fades in on scroll
  </section>
</RevealOnScroll>
```

---

### 11. **PageTransition**
Smooth page transitions.

```jsx
import { PageTransition } from './PremiumComponents.jsx';

function MyPage() {
  return (
    <PageTransition>
      <div>Page content</div>
    </PageTransition>
  );
}
```

---

### 12. **FloatingButton**
Floating action button (FAB).

```jsx
import { FloatingButton } from './PremiumComponents.jsx';
import { Plus } from 'lucide-react';

<FloatingButton
  icon={Plus}
  onClick={() => {}}
  label="Add new"
/>
```

---

## 🎯 Usage Examples

### Example 1: Job Card with Premium Interactions

```jsx
import { PremiumCard, PremiumBadge, IconButton, ScaleOnHover } from './PremiumComponents.jsx';
import { Bookmark, Share2 } from 'lucide-react';

function JobCard({ job }) {
  return (
    <PremiumCard hoverable={true}>
      <div className="flex items-start gap-4">
        <ScaleOnHover scale={1.05}>
          <img src={job.logo} className="w-16 h-16 rounded-2xl" />
        </ScaleOnHover>

        <div className="flex-1">
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>

          <div className="flex gap-2 mt-3">
            <PremiumBadge variant="success">{job.type}</PremiumBadge>
            <PremiumBadge variant="default">{job.location}</PremiumBadge>
          </div>
        </div>

        <div className="flex gap-2">
          <IconButton icon={Bookmark} label="Save" />
          <IconButton icon={Share2} label="Share" />
        </div>
      </div>
    </PremiumCard>
  );
}
```

---

### Example 2: Form with Toast Feedback

```jsx
import { PremiumButton } from './PremiumComponents.jsx';
import { useToast } from './ToastContext.jsx';
import { Send } from 'lucide-react';

function ApplicationForm() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitApplication();
      showSuccess('Application submitted successfully!');
    } catch (error) {
      showError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      {/* Form fields */}
      <PremiumButton
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        icon={Send}
      >
        {loading ? <LoadingDots /> : 'Submit Application'}
      </PremiumButton>
    </form>
  );
}
```

---

### Example 3: Loading State

```jsx
import { CardSkeleton } from './PremiumComponents.jsx';

function JobsList({ loading, jobs }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

---

### Example 4: Stagger Grid Animation

```jsx
import { StaggerContainer, StaggerItem, PremiumCard } from './PremiumComponents.jsx';

function FeaturesGrid({ features }) {
  return (
    <StaggerContainer className="grid grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <StaggerItem key={i}>
          <PremiumCard hoverable={true}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </PremiumCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

---

## 🎨 Animation Configuration

All components use consistent spring physics:

```javascript
const springConfig = {
  type: "spring",
  stiffness: 400,  // Snappy feel
  damping: 30      // Smooth settle
};

const smoothConfig = {
  type: "spring",
  stiffness: 300,  // Gentler
  damping: 25
};
```

You can customize by modifying `PremiumComponents.jsx`.

---

## 🚀 View the Showcase

Visit the premium showcase page:
```
http://localhost:5173/#premium-showcase
```

Or programmatically:
```jsx
setCurrentView('premium-showcase')
```

---

## 💡 Best Practices

1. **Use PremiumButton** for all primary actions
2. **Add loading states** with Skeleton/LoadingDots
3. **Toast feedback** for all user actions
4. **PremiumCard** for hoverable content
5. **StaggerContainer** for lists/grids
6. **RevealOnScroll** for long pages
7. **Keep animations consistent** - use provided configs

---

## 🎯 When to Use What

| Component | Use Case |
|-----------|----------|
| PremiumButton | Primary CTAs, form submissions |
| PremiumCard | Job cards, profile cards, content blocks |
| Skeleton | Loading states for cards/lists |
| LoadingDots | Button loading states |
| Toast | Success/error feedback |
| StaggerContainer | Animated grids/lists |
| IconButton | Toolbar actions, like/share buttons |
| PremiumBadge | Status indicators, tags |
| RevealOnScroll | Section reveals on landing pages |
| ScaleOnHover | Images, logos, icons |

---

## 📱 Mobile Considerations

All components are mobile-optimized:
- Touch targets ≥ 44px
- Reduced motion respected
- Smooth scroll behavior
- Proper focus states

---

## ♿ Accessibility

- Focus visible states
- ARIA labels on IconButton
- Keyboard navigation
- Screen reader friendly
- Respects prefers-reduced-motion

---

## 🔧 Troubleshooting

**Animation not working?**
- Check framer-motion is installed
- Ensure ToastProvider wraps your app
- Verify component imports

**Toasts not showing?**
- Check ToastProvider is at app root
- Use useToast() inside ToastProvider
- Check z-index conflicts

**Skeleton not animating?**
- CSS animation keyframes loaded?
- Check index.css is imported

---

## 📦 Dependencies

```json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.x.x",
  "react": "^18.x.x"
}
```

---

Built with ❤️ for JobX - Myanmar's Premium Job Platform
