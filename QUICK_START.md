# JobX - Quick Start Guide

## 🚀 For Developers

### Run the App
```bash
npm run dev
# Opens at http://localhost:5176
```

### Project Structure
```
JobX/
├── App.jsx                    # Main app logic
├── JobXAuth.jsx              # Registration (3 steps, no role selection)
├── EnhancedLiquidNav.jsx     # Personal Mode + Hiring Mode navigation
├── EmployerDashboard.jsx     # Hiring Mode dashboard
├── EmployerOnboarding.jsx    # Company setup (ONE TIME)
├── PostJob.jsx               # Job posting form
├── FeedPage.jsx              # Home/Personal Mode
├── JobsPage.jsx              # Find Jobs page
├── NetworkPage.jsx           # Network/Connections
└── New Components/
    ├── Toast.jsx             # Notifications
    ├── EmptyState.jsx        # Empty states
    ├── LoadingSkeleton.jsx   # Loading UI
    ├── EnhancedInput.jsx     # Form inputs
    └── EnhancedButton.jsx    # Buttons
```

---

## 👤 For Users

### Getting Started (Job Seeker)

1. **Sign Up** (Simple 3-step process)
   - Industries you're interested in
   - Your skills
   - Your goals

2. **Land on Home** (Personal Mode)
   - Browse feed
   - Find jobs
   - Connect with people

### Switching to Hiring Mode

1. Click **Profile** (top right)
2. Click **"Switch to Hiring"**
3. **First time:** Complete company setup
4. **Done!** You're now in Hiring Mode

---

## 🏢 For Employers

### Post Your First Job

1. **Switch to Hiring Mode**
   - Profile → "Switch to Hiring"
   - Complete company info (ONE TIME)

2. **Click "+ Post a Job"**
   - Fill job details
   - Choose posting tier:
     - **Free** ($0 - 7 days)
     - **Standard** ($15 - 30 days) ⭐ Most Popular
     - **Featured** ($39 - 45 days, top placement)

3. **Job Goes Live!**
   - View in Employer Dashboard
   - Track applicants in real-time

### Managing Applications

1. **Employer Dashboard**
   - See all your jobs
   - Click a job to view applicants

2. **Review Applicants**
   - Search & filter
   - Click to view full profile
   - Rate candidates (1-5 stars)

3. **Update Status**
   - New → Reviewed → Interview → Accepted/Rejected
   - Each status change notifies the candidate

---

## 🎨 Key Features

### Personal Mode (Default for Everyone)
- ✅ Clean navigation: Home, Find Jobs, Network
- ✅ Browse job listings
- ✅ Apply to jobs
- ✅ Build network
- ✅ Share projects
- ❌ No "Post a Job" visible (reduces confusion)

### Hiring Mode (Employer Dashboard)
- ✅ Blue gradient header ("Hiring Mode" badge)
- ✅ Dashboard, My Jobs, Candidates navigation
- ✅ "+ Post a Job" primary button
- ✅ Applicant management system
- ✅ Status tracking pipeline
- ✅ CV downloads
- ✅ Rating system

### Mode Switching
- **Personal → Hiring:** Profile → "Switch to Hiring"
- **Hiring → Personal:** Profile → "Switch to Personal"
- **Context preserved:** Always know which mode you're in

---

## 🔧 Common Tasks

### Integrate Toast Notifications

**1. Wrap App with ToastProvider:**
```jsx
// App.jsx or main.jsx
import { ToastProvider } from './Toast';

<ToastProvider>
  <App />
</ToastProvider>
```

**2. Use in Components:**
```jsx
import { useToast } from './Toast';

function MyComponent() {
  const { success, error } = useToast();

  const handleAction = () => {
    try {
      // do something
      success("Action completed! ✅");
    } catch (err) {
      error("Something went wrong");
    }
  };
}
```

### Add Empty States

```jsx
import { FeedEmptyState, JobsEmptyState } from './EmptyState';

{items.length === 0 && <FeedEmptyState onNavigate={onNavigate} />}
```

### Add Loading States

```jsx
import { FeedLoadingSkeleton } from './LoadingSkeleton';

{isLoading ? <FeedLoadingSkeleton /> : <Content />}
```

### Use Enhanced Inputs

```jsx
import EnhancedInput from './EnhancedInput';
import { Mail } from 'lucide-react';

<EnhancedInput
  icon={Mail}
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!isValidEmail(email) ? "Invalid email" : ""}
  success={isValidEmail(email)}
  required
/>
```

---

## 🐛 Troubleshooting

### Issue: Can't switch to Hiring Mode
**Solution:** Complete your profile first, then try again

### Issue: "Post a Job" button missing
**Solution:** You're in Personal Mode. Switch to Hiring Mode via Profile menu

### Issue: Changes not saving
**Solution:** Check network tab, verify API endpoints working

### Issue: Applicants not showing
**Solution:**
1. Check if job is active
2. Verify you're viewing the correct job
3. Try clearing filters

---

## 📱 Mobile Testing

### Quick Test
1. Open Chrome DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select "iPhone SE" (smallest screen)
4. Test all flows

### What to Check
- [ ] Navigation accessible
- [ ] Touch targets ≥ 44px
- [ ] Text readable
- [ ] Forms usable
- [ ] No horizontal scroll
- [ ] Images load properly

---

## 🎯 Success Checklist

### For Job Seekers
- [ ] Can sign up easily
- [ ] Can browse jobs
- [ ] Can apply to jobs
- [ ] Can build network
- [ ] Can switch to Hiring (if needed)

### For Employers
- [ ] Can set up company (ONE TIME)
- [ ] Can post jobs
- [ ] Can view applicants
- [ ] Can manage hiring pipeline
- [ ] Can switch back to Personal Mode

### For Developers
- [ ] All components working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast loading
- [ ] Toast notifications working
- [ ] Empty states showing
- [ ] Analytics tracking

---

## 📊 Performance Targets

- **First Load:** < 2 seconds
- **Page Navigation:** < 300ms
- **API Calls:** < 1 second
- **Animations:** 60 FPS
- **Bundle Size:** < 500 KB (gzipped)

---

## 🚀 Deployment Checklist

### Before Deploy
- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Check for console errors
- [ ] Verify all features work
- [ ] Test on real mobile device
- [ ] Check Lighthouse score (>90)

### Environment Variables
```bash
# .env
VITE_API_URL=https://api.jobx.com
VITE_ANALYTICS_ID=your_analytics_id
VITE_STRIPE_KEY=your_stripe_key
```

### Deploy
```bash
# Build
npm run build

# Deploy to Vercel/Netlify
vercel deploy --prod
# or
netlify deploy --prod
```

---

## 🔗 Helpful Links

- **Documentation:** `UX_IMPROVEMENTS.md`
- **Implementation:** `UX_IMPLEMENTATION_GUIDE.md`
- **Hiring Mode:** `HIRING_MODE_GUIDE.md`
- **GitHub:** https://github.com/yourusername/jobx
- **Live Demo:** https://jobx.vercel.app

---

## 💡 Pro Tips

1. **Use Toast for all notifications** - Never use browser `alert()`
2. **Always show loading states** - Better perceived performance
3. **Add empty states everywhere** - Helps users understand the app
4. **Test on real devices** - Emulators don't catch everything
5. **Monitor analytics** - Data-driven decisions

---

## 🎉 You're Ready!

Your JobX is now:
- ✅ **Clean UX** - Mode-based, not role-based
- ✅ **Professional** - World-class UI components
- ✅ **Mobile-First** - Optimized for Myanmar market
- ✅ **Feature-Complete** - Personal + Hiring modes
- ✅ **Production-Ready** - All systems go!

**Questions?** Check the detailed guides above or open an issue on GitHub.

---

**Last Updated:** January 2026
**Version:** 1.0.0
