import React, { useState, useEffect } from 'react';
import { ToastProvider } from './ToastContext.jsx';
import { AuthProvider, useAuth } from './src/contexts/AuthContext.jsx';
import api from './src/services/api.js';
import JobXLanding from './JobXLanding.jsx';
import JobXAuth from './JobXAuth.jsx';
import RoleSelection from './RoleSelection.jsx';
import Dashboard from './Dashboard.jsx';
import FeedPage from './FeedPage.jsx';
import CommunityFeed from './CommunityFeed.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import JobsPage from './JobsPage.jsx';
import PostJob from './PostJob.jsx';
import ProfilePage from './ProfilePage.jsx';
import SettingsPage from './SettingsPage.jsx';
import MessagingDrawer from './MessagingDrawer.jsx';
import LiquidGlassShowcase from './LiquidGlassShowcase.jsx';
import FeedbackShowcase from './FeedbackShowcase.jsx';
import NavigationShowcase from './NavigationShowcase.jsx';
import ApplicationsPage from './ApplicationsPage.jsx';
import EmployerDashboard from './EmployerDashboard.jsx';
import EmployerOnboarding from './EmployerOnboarding.jsx';
import PaymentsPage from './PaymentsPage.jsx';
import PremiumPage from './PremiumPage.jsx';
import NetworkPage from './NetworkPage.jsx';
import CompanyProfilePage from './CompanyProfilePage.jsx';
import TalentPoolPage from './TalentPoolPage.jsx';
import PremiumShowcase from './PremiumShowcase.jsx';

const AppContent = () => {
  const { user, isAuthenticated, loading, logout, updateUser } = useAuth();
  
  // Check URL hash for showcase routes
  const getInitialView = () => {
    const hash = window.location.hash;
    if (hash === '#showcase') return 'showcase';
    if (hash === '#feedback') return 'feedback';
    if (hash === '#navigation') return 'navigation';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView());
  const [userRole, setUserRole] = useState(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  
  // Load applications from API on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadApplications();
    }
  }, [isAuthenticated, user]);

  const loadApplications = async () => {
    try {
      const response = await api.applications.getMyApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  // Handle new job application
  const handleApply = async (jobId, coverLetter, resumeUrl) => {
    try {
      await api.applications.apply(jobId, coverLetter, resumeUrl);
      // Reload applications
      await loadApplications();
    } catch (error) {
      if (error.message.includes('requiresPremium')) {
        // Show upgrade modal or redirect to premium page
        setCurrentView('premium');
      } else {
        alert(error.message || 'Failed to submit application');
      }
      throw error;
    }
  };

  // Handle withdraw application
  const handleWithdrawApplication = async (applicationId) => {
    try {
      await api.applications.withdraw(applicationId);
      // Reload applications
      await loadApplications();
    } catch (error) {
      alert(error.message || 'Failed to withdraw application');
    }
  };

  // Handle employer onboarding completion
  const handleEmployerOnboardingComplete = async (companyData) => {
    try {
      // Save company to backend
      await api.companies.create(companyData);
      // Refresh user data to get company info
      const updatedUser = await api.auth.getCurrentUser();
      updateUser(updatedUser.user);
      setCurrentView('employer');
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('Failed to save company data. Please try again.');
    }
  };

  // Handle authentication completion
  const handleAuthComplete = (userData) => {
    updateUser(userData);
    setUserRole('job_seeker');
    setCurrentView('feed');
  };

  // Handle navigation between pages
  const handleNavigate = (view) => {
    // Check if user is trying to post a job without company setup
    if (view === 'post-opportunity' && !user?.companyData) {
      // Redirect to employer onboarding (company setup) first
      setCurrentView('employer-onboarding');
      return;
    }

    setCurrentView(view);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setUserRole(null);
    setApplications([]);
    setCurrentView('landing');
  };

  const handleOpenMessages = () => setIsMessagesOpen(true);
  const handleCloseMessages = () => setIsMessagesOpen(false);

  // Render based on current view
  // Special routes for showcases (accessible without auth)
  if (currentView === 'showcase') {
    return <LiquidGlassShowcase />;
  }

  if (currentView === 'feedback') {
    return <FeedbackShowcase />;
  }

  if (currentView === 'navigation') {
    return <NavigationShowcase />;
  }

  if (currentView === 'premium-showcase') {
    return <PremiumShowcase onBack={() => setCurrentView('landing')} />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && currentView === 'landing') {
    return <JobXLanding onGetStarted={() => setCurrentView('auth')} />;
  }

  if (!isAuthenticated && currentView === 'auth') {
    return (
      <JobXAuth
        onBack={() => setCurrentView('landing')}
        onAuthComplete={handleAuthComplete}
      />
    );
  }

  // Authenticated views
  let page = null;
  switch (currentView) {
    case 'feed':
      page = (
        <FeedPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'dashboard':
      page = (
        <Dashboard
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'network':
      page = (
        <NetworkPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'community':
      page = (
        <CommunityFeed
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'projects':
      page = (
        <ProjectsPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'opportunities':
      page = (
        <JobsPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
          applications={applications}
          onApply={handleApply}
        />
      );
      break;

    case 'applications':
      page = (
        <ApplicationsPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
          applications={applications}
          onWithdraw={handleWithdrawApplication}
        />
      );
      break;

    case 'employer':
      page = (
        <EmployerDashboard
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'employer-onboarding':
      page = (
        <EmployerOnboarding
          userData={user}
          onComplete={handleEmployerOnboardingComplete}
          onBack={() => setCurrentView('feed')}
        />
      );
      break;

    case 'post-opportunity':
      page = (
        <PostJob
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'payments':
      page = (
        <PaymentsPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'premium':
      page = (
        <PremiumPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'company-profile':
      page = (
        <CompanyProfilePage
          userData={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
          onSave={async (companyData) => {
            try {
              await api.companies.create(companyData);
              const updatedUser = await api.auth.getCurrentUser();
              updateUser(updatedUser.user);
            } catch (error) {
              alert('Failed to save company data');
            }
          }}
        />
      );
      break;

    case 'talent-pool':
      page = (
        <TalentPoolPage
          userData={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'profile':
      page = (
        <ProfilePage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    case 'settings':
      page = (
        <SettingsPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;

    default:
      page = (
        <FeedPage
          userData={user}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenMessages={handleOpenMessages}
        />
      );
      break;
  }

  return (
    <ToastProvider>
      {page}
      <MessagingDrawer open={isMessagesOpen} onClose={handleCloseMessages} currentUser={user} />
    </ToastProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
