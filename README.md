# 🌟 JobX

> Myanmar's Premium Job Platform with Apple-Style Design

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/jobx)

---

## 🎨 Features

- ✨ **Premium Apple-Style UI** - Clean, confident, generous whitespace
- 🚀 **Smooth Animations** - Framer Motion with spring physics
- 💬 **Toast Notifications** - Real-time user feedback
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Lightning Fast** - Vite + React optimized
- 🎯 **Job Matching** - Smart search and filters
- 🤝 **Professional Network** - Connect with talent
- 💼 **Employer Dashboard** - Manage postings and applications

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
./deploy.sh
```

### Option 3: GitHub Integration

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

📖 **Full deployment guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 📂 Project Structure

```
JobX/
├── src/
│   ├── components/
│   │   ├── PremiumComponents.jsx    # Reusable premium UI
│   │   ├── ToastContext.jsx         # Toast notification system
│   │   └── ...
│   ├── pages/
│   │   ├── JobsPage.jsx              # Job listings
│   │   ├── NetworkPage.jsx           # Professional network
│   │   ├── EmployerDashboard.jsx     # Employer tools
│   │   └── ...
│   ├── App.jsx                       # Main app component
│   └── index.css                     # Global styles
├── public/                           # Static assets
├── vercel.json                       # Vercel config
└── package.json                      # Dependencies
```

---

## 🎨 Premium Components

JobX includes a complete set of Apple-style components:

- **PremiumButton** - Spring physics interactions
- **PremiumCard** - Hover lift effects
- **Toast Notifications** - 4 variants (success, error, info, warning)
- **Skeleton Loaders** - Smooth loading states
- **Stagger Animations** - Sequential reveals
- **Icon Buttons** - Micro-interactions
- **Badges** - Status indicators

📖 **Component docs:** [PREMIUM_COMPONENTS.md](./PREMIUM_COMPONENTS.md)

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_APP_NAME=JobX
VITE_API_URL=https://api.jobx.com
```

### Vercel Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables

---

## 🎯 Features by Role

### For Job Seekers:
- 🔍 Advanced job search with filters
- 💾 Save favorite jobs
- 📝 Quick apply with resume upload
- 📊 Application tracking
- 🤝 Network with professionals
- 💬 Direct messaging

### For Employers:
- 📢 Post job openings
- 👥 Browse talent pool
- 📈 Application management
- 🏢 Company profile
- 🎯 Smart candidate matching
- 💼 Hiring dashboard

---

## 📱 Pages

- **Landing** - Marketing homepage
- **Auth** - Sign up / Login / Reset password
- **Onboarding** - Personalized setup
- **Dashboard** - Personal feed
- **Find Jobs** - Job search and apply
- **Network** - Professional connections
- **Messages** - Direct messaging
- **Profile** - User profile
- **Applications** - Track applications (Job Seekers)
- **Employer Dashboard** - Manage postings (Employers)
- **Company Profile** - Company information
- **Talent Pool** - Browse candidates
- **Settings** - Account settings

---

## 🎨 Design System

### Colors
- **Primary:** Black (#000000)
- **Secondary:** Gray (#6B7280)
- **Success:** Green (#10B981)
- **Error:** Red (#EF4444)
- **Warning:** Yellow (#F59E0B)
- **Info:** Blue (#3B82F6)

### Typography
- **Headlines:** SF Pro Display (system)
- **Body:** SF Pro Text (system)
- **Sizes:** 6xl (hero), 4xl (title), 2xl (subtitle)

### Spacing
- **Generous whitespace** - Apple editorial style
- **Rhythm:** 8px base unit (py-2, py-4, py-8, py-16, py-24, py-32)

### Animations
- **Spring physics** - stiffness: 400, damping: 30
- **Duration:** 200ms (fast), 300ms (normal)
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1)

---

## 🚦 Performance

### Lighthouse Scores (Target)

- ⚡ **Performance:** 95+
- ♿ **Accessibility:** 95+
- ✅ **Best Practices:** 95+
- 🔍 **SEO:** 95+

### Optimizations

- Code splitting with React.lazy
- Image optimization
- Tree shaking
- Minification
- Compression (Brotli/Gzip)
- CDN delivery

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Toast Not Showing

Ensure ToastProvider wraps your app:

```jsx
import { ToastProvider } from './ToastContext.jsx';

<ToastProvider>
  <App />
</ToastProvider>
```

### Animations Not Working

Check framer-motion is installed:

```bash
npm install framer-motion
```

---

## 📖 Documentation

- [Deployment Guide](./VERCEL_DEPLOYMENT.md) - Complete Vercel setup
- [Premium Components](./PREMIUM_COMPONENTS.md) - Component API reference
- [Integration Summary](./INTEGRATION_SUMMARY.md) - Feature integration status

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use for your own projects!

---

## 🙏 Acknowledgments

- Design inspiration: Apple.com
- Icons: Lucide React
- Animations: Framer Motion
- Framework: Vite + React

---

## 📞 Support

Need help? Contact us:
- 📧 Email: support@jobx.com
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@JobXMyanmar](#)

---

## 🎉 Live Demo

Check out the live demo:

🔗 **[https://jobx.vercel.app](#)**

---

Built with ❤️ in Myanmar 🇲🇲

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build

# Deployment
./deploy.sh          # Quick deploy
vercel               # Deploy preview
vercel --prod        # Deploy production

# Maintenance
npm install          # Install dependencies
npm update           # Update dependencies
```

---

**Status:** Production Ready ✅
**Last Updated:** January 2025
**Version:** 1.0.0
