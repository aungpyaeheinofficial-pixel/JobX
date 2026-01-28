import React, { useRef, useState, useEffect } from 'react';
import { EnhancedHeader } from './EnhancedLiquidNav.jsx';
import api from './src/services/api.js';
import {
  Bell,
  MessageSquare,
  User,
  MapPin,
  Briefcase,
  Mail,
  Globe,
  Edit3,
  Camera,
  Plus,
  Check,
  X,
  ThumbsUp,
  Calendar,
  Building2,
  Award,
  ExternalLink,
  Trash2,
  Upload,
  Image,
  FileText,
  Link as LinkIcon,
  GripVertical
} from 'lucide-react';

const ProfilePage = ({ userData, userRole, onNavigate, onLogout, onOpenMessages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('about'); // about, portfolio, experience, certifications
  const [loading, setLoading] = useState(true);
  const avatarInputRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const certInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  const [profile, setProfile] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    location: userData?.location || '',
    title: '',
    bio: '',
    website: '',
    avatarUrl: userData?.avatar_url || '',
    skills: [],
    experience: [],
    portfolio: [],
    certifications: []
  });

  // Fetch profile data on mount
  useEffect(() => {
    if (userData?.id) {
      loadProfile();
    }
  }, [userData?.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Fetch extended profile
      const [userResponse, profileResponse] = await Promise.all([
        api.users.getProfile(userData.id, true),
        api.profiles.getMyExtended().catch(() => ({ profile: null }))
      ]);

      const user = userResponse.user || {};
      const extendedProfile = profileResponse.profile || {};

      setProfile({
        name: user.name || userData?.name || '',
        email: user.email || userData?.email || '',
        location: user.location || userData?.location || '',
        title: extendedProfile.title || '',
        bio: extendedProfile.bio || '',
        website: extendedProfile.website || '',
        avatarUrl: user.avatar_url || userData?.avatar_url || '',
        skills: Array.isArray(user.skills) ? user.skills.map((s, i) => ({
          id: i + 1,
          name: typeof s === 'string' ? s : s.name || s,
          endorsements: 0,
          endorsed: false
        })) : [],
        experience: Array.isArray(extendedProfile.work_experience) ? extendedProfile.work_experience.map((exp, i) => ({
          id: i + 1,
          title: exp.title || exp.position || '',
          company: exp.company || exp.organization || '',
          location: exp.location || '',
          startDate: exp.start_date || exp.startDate || '',
          endDate: exp.end_date || exp.endDate || null,
          current: !exp.end_date && !exp.endDate,
          description: exp.description || exp.responsibilities || ''
        })) : [],
        portfolio: Array.isArray(extendedProfile.portfolio_items) ? extendedProfile.portfolio_items.map((item, i) => ({
          id: i + 1,
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.image_url || item.imageUrl || '',
          projectUrl: item.project_url || item.projectUrl || '',
          tags: Array.isArray(item.tags) ? item.tags : []
        })) : [],
        certifications: Array.isArray(extendedProfile.certifications) ? extendedProfile.certifications.map((cert, i) => ({
          id: i + 1,
          name: cert.name || cert.title || '',
          issuer: cert.issuer || cert.organization || '',
          issueDate: cert.issue_date || cert.issueDate || '',
          expiryDate: cert.expiry_date || cert.expiryDate || null,
          credentialId: cert.credential_id || cert.credentialId || '',
          credentialUrl: cert.credential_url || cert.credentialUrl || '',
          imageUrl: cert.image_url || cert.imageUrl || ''
        })) : []
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Use userData as fallback
      setProfile(prev => ({
        ...prev,
        name: userData?.name || prev.name,
        email: userData?.email || prev.email,
        location: userData?.location || prev.location,
      }));
    } finally {
      setLoading(false);
    }
  };

  const [editForm, setEditForm] = useState(profile);
  const [newExperience, setNewExperience] = useState({
    title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: ''
  });
  const [newCertification, setNewCertification] = useState({
    name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: ''
  });
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '', description: '', imageUrl: '', projectUrl: '', tags: []
  });
  const [portfolioTagInput, setPortfolioTagInput] = useState('');

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleAvatarFile = async (file) => {
    setAvatarError('');
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setAvatarError('Please choose an image file.');
      return;
    }
    const maxBytes = 6 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAvatarError('Image is too large. Please use a file under 6MB.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setEditForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
    } catch {
      setAvatarError('Could not load that image. Please try another file.');
    }
  };

  const handlePortfolioImage = async (file) => {
    if (!file || !file.type?.startsWith('image/')) return;
    if (file.size > 6 * 1024 * 1024) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setNewPortfolioItem(prev => ({ ...prev, imageUrl: dataUrl }));
    } catch {
      // silently fail
    }
  };

  const handleCertImage = async (file) => {
    if (!file || !file.type?.startsWith('image/')) return;
    if (file.size > 6 * 1024 * 1024) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setNewCertification(prev => ({ ...prev, imageUrl: dataUrl }));
    } catch {
      // silently fail
    }
  };

  const handleSave = async () => {
    try {
      // Transform experience and portfolio to match API format
      const transformedExperience = (profile.experience || []).map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        start_date: exp.startDate || exp.start_date || '',
        end_date: exp.endDate || exp.end_date || null,
        current: exp.current !== undefined ? exp.current : (!exp.endDate && !exp.end_date),
        description: exp.description || ''
      }));

      const transformedPortfolio = (profile.portfolio || []).map(item => ({
        title: item.title || '',
        description: item.description || '',
        image_url: item.imageUrl || item.image_url || '',
        project_url: item.projectUrl || item.project_url || '',
        tags: Array.isArray(item.tags) ? item.tags : []
      }));

      const transformedCertifications = (profile.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issue_date: cert.issueDate || cert.issue_date || '',
        expiry_date: cert.expiryDate || cert.expiry_date || null,
        credential_id: cert.credentialId || cert.credential_id || '',
        credential_url: cert.credentialUrl || cert.credential_url || '',
        image_url: cert.imageUrl || cert.image_url || ''
      }));

      // Save extended profile
      const profileData = {
        bio: editForm.bio || '',
        title: editForm.title || '',
        website: editForm.website || '',
        phone: editForm.phone || null,
        experience_years: editForm.experience_years || null,
        work_experience: transformedExperience,
        portfolio_items: transformedPortfolio,
        certifications: transformedCertifications,
        education: Array.isArray(editForm.education) ? editForm.education : []
      };

      await api.profiles.updateExtended(profileData);

      // Also update basic user profile if needed
      if (editForm.name !== profile.name || editForm.location !== profile.location || editForm.avatarUrl !== profile.avatarUrl) {
        await api.users.updateProfile({
          name: editForm.name,
          location: editForm.location,
          avatar_url: editForm.avatarUrl
        });
      }

      setProfile(editForm);
      setIsEditing(false);
      setAvatarError('');
      
      // Reload to get latest data from database
      await loadProfile();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
    setAvatarError('');
  };

  // Skills endorsement
  const toggleEndorse = (skillId) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === skillId
          ? {
              ...skill,
              endorsed: !skill.endorsed,
              endorsements: skill.endorsed ? skill.endorsements - 1 : skill.endorsements + 1
            }
          : skill
      )
    }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill = {
      id: Date.now(),
      name: newSkill.trim(),
      endorsements: 0,
      endorsed: false
    };
    setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    setEditForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    setNewSkill('');
    setShowAddSkill(false);
  };

  const removeSkill = (skillId) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
    setEditForm(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
  };

  // Experience management
  const addExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      alert('Please fill in at least Title and Company');
      return;
    }
    
    const exp = {
      title: newExperience.title,
      company: newExperience.company,
      location: newExperience.location || '',
      start_date: newExperience.startDate || '',
      end_date: newExperience.endDate || null,
      current: newExperience.current || false,
      description: newExperience.description || ''
    };
    
    // Update local state immediately
    const updatedExp = { ...exp, id: Date.now() };
    const updatedExperience = [updatedExp, ...profile.experience];
    
    setProfile(prev => ({ ...prev, experience: updatedExperience }));
    setEditForm(prev => ({ ...prev, experience: updatedExperience }));
    
    // Save to database immediately - need to send ALL profile fields
    try {
      // Transform all experiences to API format
      const transformedExperience = updatedExperience.map(e => ({
        title: e.title || '',
        company: e.company || '',
        location: e.location || '',
        start_date: e.startDate || e.start_date || '',
        end_date: e.endDate || e.end_date || null,
        current: e.current !== undefined ? e.current : (!e.endDate && !e.end_date),
        description: e.description || ''
      }));

      // Transform portfolio and certifications too
      const transformedPortfolio = (profile.portfolio || []).map(item => ({
        title: item.title || '',
        description: item.description || '',
        image_url: item.imageUrl || item.image_url || '',
        project_url: item.projectUrl || item.project_url || '',
        tags: Array.isArray(item.tags) ? item.tags : []
      }));

      const transformedCertifications = (profile.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issue_date: cert.issueDate || cert.issue_date || '',
        expiry_date: cert.expiryDate || cert.expiry_date || null,
        credential_id: cert.credentialId || cert.credential_id || '',
        credential_url: cert.credentialUrl || cert.credential_url || '',
        image_url: cert.imageUrl || cert.image_url || ''
      }));

      // Send complete profile data
      const profileData = {
        bio: editForm.bio || profile.bio || '',
        title: editForm.title || profile.title || '',
        website: editForm.website || profile.website || '',
        phone: editForm.phone || null,
        experience_years: editForm.experience_years || null,
        work_experience: transformedExperience,
        portfolio_items: transformedPortfolio,
        certifications: transformedCertifications,
        education: Array.isArray(editForm.education) ? editForm.education : []
      };

      console.log('Saving experience to database:', profileData);
      const response = await api.profiles.updateExtended(profileData);
      console.log('Experience saved successfully:', response);
      
      // Reload profile to get latest from database
      await loadProfile();
    } catch (error) {
      console.error('Failed to save experience:', error);
      console.error('Error details:', error.message, error.data);
      alert(`Failed to save experience: ${error.message || 'Please try again.'}`);
      // Revert local state on error
      setProfile(prev => ({ ...prev, experience: profile.experience }));
      setEditForm(prev => ({ ...prev, experience: profile.experience }));
      return;
    }
    
    setNewExperience({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
    setShowAddExperience(false);
  };

  const removeExperience = (expId) => {
    setProfile(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== expId) }));
    setEditForm(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== expId) }));
  };

  // Portfolio management
  const addPortfolioItem = async () => {
    if (!newPortfolioItem.title) {
      alert('Please enter a title for your portfolio item');
      return;
    }
    
    const item = {
      title: newPortfolioItem.title,
      description: newPortfolioItem.description || '',
      image_url: newPortfolioItem.imageUrl || '',
      project_url: newPortfolioItem.projectUrl || '',
      tags: Array.isArray(newPortfolioItem.tags) ? newPortfolioItem.tags : []
    };
    
    // Update local state immediately
    const updatedItem = { ...item, id: Date.now() };
    const updatedPortfolio = [...profile.portfolio, updatedItem];
    
    setProfile(prev => ({ ...prev, portfolio: updatedPortfolio }));
    setEditForm(prev => ({ ...prev, portfolio: updatedPortfolio }));
    
    // Save to database immediately - need to send ALL profile fields
    try {
      // Transform all portfolio items to API format
      const transformedPortfolio = updatedPortfolio.map(p => ({
        title: p.title || '',
        description: p.description || '',
        image_url: p.imageUrl || p.image_url || '',
        project_url: p.projectUrl || p.project_url || '',
        tags: Array.isArray(p.tags) ? p.tags : []
      }));

      // Transform experiences and certifications too
      const transformedExperience = (profile.experience || []).map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        start_date: exp.startDate || exp.start_date || '',
        end_date: exp.endDate || exp.end_date || null,
        current: exp.current !== undefined ? exp.current : (!exp.endDate && !exp.end_date),
        description: exp.description || ''
      }));

      const transformedCertifications = (profile.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issue_date: cert.issueDate || cert.issue_date || '',
        expiry_date: cert.expiryDate || cert.expiry_date || null,
        credential_id: cert.credentialId || cert.credential_id || '',
        credential_url: cert.credentialUrl || cert.credential_url || '',
        image_url: cert.imageUrl || cert.image_url || ''
      }));

      // Send complete profile data
      const profileData = {
        bio: editForm.bio || profile.bio || '',
        title: editForm.title || profile.title || '',
        website: editForm.website || profile.website || '',
        phone: editForm.phone || null,
        experience_years: editForm.experience_years || null,
        work_experience: transformedExperience,
        portfolio_items: transformedPortfolio,
        certifications: transformedCertifications,
        education: Array.isArray(editForm.education) ? editForm.education : []
      };

      console.log('Saving portfolio item to database:', profileData);
      const response = await api.profiles.updateExtended(profileData);
      console.log('Portfolio item saved successfully:', response);
      
      // Reload profile to get latest from database
      await loadProfile();
    } catch (error) {
      console.error('Failed to save portfolio item:', error);
      console.error('Error details:', error.message, error.data);
      alert(`Failed to save portfolio item: ${error.message || 'Please try again.'}`);
      // Revert local state on error
      setProfile(prev => ({ ...prev, portfolio: profile.portfolio }));
      setEditForm(prev => ({ ...prev, portfolio: profile.portfolio }));
      return;
    }
    
    setNewPortfolioItem({ title: '', description: '', imageUrl: '', projectUrl: '', tags: [] });
    setPortfolioTagInput('');
    setShowAddPortfolio(false);
  };

  const removePortfolioItem = (itemId) => {
    setProfile(prev => ({ ...prev, portfolio: prev.portfolio.filter(p => p.id !== itemId) }));
    setEditForm(prev => ({ ...prev, portfolio: prev.portfolio.filter(p => p.id !== itemId) }));
  };

  const addPortfolioTag = () => {
    if (!portfolioTagInput.trim()) return;
    setNewPortfolioItem(prev => ({
      ...prev,
      tags: [...prev.tags, portfolioTagInput.trim()]
    }));
    setPortfolioTagInput('');
  };

  // Certification management
  const addCertification = () => {
    if (!newCertification.name || !newCertification.issuer) return;
    const cert = {
      ...newCertification,
      id: Date.now()
    };
    setProfile(prev => ({ ...prev, certifications: [...prev.certifications, cert] }));
    setEditForm(prev => ({ ...prev, certifications: [...prev.certifications, cert] }));
    setNewCertification({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: '' });
    setShowAddCert(false);
  };

  const removeCertification = (certId) => {
    setProfile(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== certId) }));
    setEditForm(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== certId) }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'portfolio', label: 'Portfolio', count: profile.portfolio.length },
    { id: 'experience', label: 'Experience', count: profile.experience.length },
    { id: 'certifications', label: 'Certifications', count: profile.certifications.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader
        userData={userData}
        userRole={userRole}
        activeTab="profile"
        onNavigate={onNavigate}
        onOpenMessages={onOpenMessages}
        onLogout={onLogout}
        onSettings={() => onNavigate('settings')}
        showPostButton={false}
      />

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8">
          {/* Cover & Avatar */}
          <div className="relative pt-8 pb-6">
            <div className="flex items-end gap-8">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    handleAvatarFile(f);
                  }}
                />
                <div className="w-36 h-36 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center ring-4 ring-white">
                  {(isEditing ? editForm.avatarUrl : profile.avatarUrl) ? (
                    <img
                      src={(isEditing ? editForm.avatarUrl : profile.avatarUrl)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-6xl">
                      {(profile.name?.charAt(0) || 'A').toUpperCase()}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pb-2">
                {!isEditing ? (
                  <>
                    <h1 className="text-4xl font-bold mb-1">{profile.name}</h1>
                    <p className="text-xl text-gray-600 mb-3">{profile.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </span>
                      {profile.website && (
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4" />
                          {profile.website}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {avatarError && <p className="text-red-600 text-sm">{avatarError}</p>}
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-4xl font-bold bg-white border border-gray-200 rounded-xl px-4 py-2 w-full outline-none focus:border-black"
                      placeholder="Your name"
                    />
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="text-xl text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2 w-full outline-none focus:border-black"
                      placeholder="Your title"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-black"
                        placeholder="Location"
                      />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-black"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-black"
                        placeholder="Website"
                      />
                    </div>
                  </div>
                )}
            </div>

              {/* Actions */}
              <div className="flex gap-3 pb-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
              </button>
            ) : (
                  <>
                <button
                  onClick={handleCancel}
                      className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                      Cancel
                </button>
                <button
                  onClick={handleSave}
                      className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
                >
                      <Check className="w-4 h-4" />
                      Save
                </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-4 font-medium transition-all relative ${
                  activeSection === tab.id
                    ? 'text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeSection === tab.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeSection === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
          </div>
        </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* About Tab */}
        {activeSection === 'about' && (
          <div className="space-y-10">
            {/* Bio */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
          {!isEditing ? (
                <p className="text-lg text-gray-600 leading-relaxed">{profile.bio}</p>
          ) : (
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={4}
                  className="w-full text-lg text-gray-600 bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-black resize-none"
                  placeholder="Tell us about yourself..."
            />
          )}
        </section>

            {/* Skills with Endorsements */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Skills & Endorsements</h2>
                {isEditing && !showAddSkill && (
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                )}
              </div>

              {showAddSkill && (
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill name"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button
                    onClick={addSkill}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowAddSkill(false); setNewSkill(''); }}
                    className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-lg">{skill.name}</span>
                      <span className="text-sm text-gray-500">
                        {skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEndorse(skill.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                          skill.endorsed
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${skill.endorsed ? 'fill-current' : ''}`} />
                        {skill.endorsed ? 'Endorsed' : 'Endorse'}
                      </button>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl font-bold text-gray-900">127</div>
                <div className="text-sm text-gray-500 mt-1">Profile Views</div>
                <div className="text-xs text-green-600 mt-2">+12% this week</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-500 mt-1">Connections</div>
                <div className="text-xs text-green-600 mt-2">+3 new</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-500 mt-1">Applications</div>
                <div className="text-xs text-blue-600 mt-2">2 in review</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-500 mt-1">Post Impressions</div>
                <div className="text-xs text-green-600 mt-2">+45% this week</div>
              </div>
            </div>

            {/* Recent Activity */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Applied to Senior Developer at TechCorp', time: '2 hours ago', type: 'application' },
                  { action: 'Your post received 12 likes', time: '5 hours ago', type: 'engagement' },
                  { action: 'Connected with May Thu', time: '1 day ago', type: 'connection' },
                  { action: 'Profile viewed by 5 recruiters', time: '2 days ago', type: 'view' },
                  { action: 'Skill "React" endorsed by Ko Zaw', time: '3 days ago', type: 'endorsement' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.type === 'application' ? 'bg-blue-500' :
                        item.type === 'engagement' ? 'bg-green-500' :
                        item.type === 'connection' ? 'bg-purple-500' :
                        item.type === 'view' ? 'bg-amber-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-gray-800">{item.action}</span>
                    </div>
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => onNavigate('applications')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <Briefcase className="w-6 h-6 text-gray-600 mb-2" />
                  <div className="font-medium text-gray-900">My Applications</div>
                  <div className="text-sm text-gray-500">Track job applications</div>
                </button>
                <button 
                  onClick={() => onNavigate('employer')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="w-6 h-6 text-gray-600 mb-2" />
                  <div className="font-medium text-gray-900">Employer View</div>
                  <div className="text-sm text-gray-500">Review applicants</div>
                </button>
                <button 
                  onClick={() => onNavigate('payments')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <Globe className="w-6 h-6 text-gray-600 mb-2" />
                  <div className="font-medium text-gray-900">Payments</div>
                  <div className="text-sm text-gray-500">Wallet & transactions</div>
                </button>
                <button 
                  onClick={() => onNavigate('settings')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <Edit3 className="w-6 h-6 text-gray-600 mb-2" />
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-500">Account preferences</div>
                </button>
              </div>
            </section>

            {/* Profile Completeness */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Profile Strength</h2>
                <span className="text-2xl font-bold">75%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-white rounded-full h-2" style={{ width: '75%' }} />
              </div>
              <p className="text-gray-300 text-sm">
                Complete your profile to attract more opportunities. Add your certifications and portfolio projects.
              </p>
            </section>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeSection === 'portfolio' && (
          <div className="space-y-6">
            {/* Add Portfolio Button */}
            {!showAddPortfolio && (
              <button
                onClick={() => setShowAddPortfolio(true)}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Project to Portfolio
              </button>
            )}

            {/* Add Portfolio Form */}
            {showAddPortfolio && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold mb-6">Add Portfolio Project</h3>
                
                {/* Image Upload */}
                <div className="mb-6">
                  <input
                    ref={portfolioInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handlePortfolioImage(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                  {newPortfolioItem.imageUrl ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={newPortfolioItem.imageUrl}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setNewPortfolioItem(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => portfolioInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all"
                    >
                      <Image className="w-8 h-8" />
                      <span>Upload Project Image</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newPortfolioItem.title}
                    onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Project Title *"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="url"
                    value={newPortfolioItem.projectUrl}
                    onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, projectUrl: e.target.value }))}
                    placeholder="Project URL"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>

                <textarea
                  value={newPortfolioItem.description}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black resize-none mb-4"
                />

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={portfolioTagInput}
                      onChange={(e) => setPortfolioTagInput(e.target.value)}
                      placeholder="Add technology tag"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-black"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioTag())}
                    />
                    <button onClick={addPortfolioTag} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Add
                    </button>
                  </div>
                  {newPortfolioItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newPortfolioItem.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => setNewPortfolioItem(prev => ({
                              ...prev,
                              tags: prev.tags.filter((_, i) => i !== idx)
                            }))}
                            className="hover:text-violet-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowAddPortfolio(false); setNewPortfolioItem({ title: '', description: '', imageUrl: '', projectUrl: '', tags: [] }); }}
                    className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPortfolioItem}
                    disabled={!newPortfolioItem.title}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            )}

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.portfolio.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-violet-100 to-purple-100 relative">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-violet-300" />
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removePortfolioItem(project.id)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeSection === 'experience' && (
          <div className="space-y-6">
            {/* Add Experience Button */}
            {!showAddExperience && (
              <button
                onClick={() => setShowAddExperience(true)}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Work Experience
              </button>
            )}

            {/* Add Experience Form */}
            {showAddExperience && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold mb-6">Add Work Experience</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Job Title *"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company *"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>

                <input
                  type="text"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black mb-4"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                    <input
                      type="month"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">End Date</label>
                    <input
                      type="month"
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={newExperience.current}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExperience.current}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked, endDate: '' }))}
                    className="w-5 h-5 accent-black"
                  />
                  <span>I currently work here</span>
                </label>

                <textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your role and achievements..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black resize-none mb-6"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowAddExperience(false); setNewExperience({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }); }}
                    className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExperience}
                    disabled={!newExperience.title || !newExperience.company}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            )}

            {/* Experience List */}
            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeSection === 'certifications' && (
          <div className="space-y-6">
            {/* Add Certification Button */}
            {!showAddCert && (
              <button
                onClick={() => setShowAddCert(true)}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Certification
              </button>
            )}

            {/* Add Certification Form */}
            {showAddCert && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold mb-6">Add Certification</h3>

                {/* Certificate Image */}
                <div className="mb-6">
                  <input
                    ref={certInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleCertImage(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                  {newCertification.imageUrl ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={newCertification.imageUrl}
                        alt="Certificate"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setNewCertification(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => certInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 transition-all"
                    >
                      <Award className="w-6 h-6" />
                      <span className="text-sm">Upload Certificate Image (optional)</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Certification Name *"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="Issuing Organization *"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Issue Date</label>
                    <input
                      type="month"
                      value={newCertification.issueDate}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Expiry Date (optional)</label>
                    <input
                      type="month"
                      value={newCertification.expiryDate}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <input
                    type="text"
                    value={newCertification.credentialId}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                    placeholder="Credential ID"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="url"
                    value={newCertification.credentialUrl}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, credentialUrl: e.target.value }))}
                    placeholder="Credential URL"
                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowAddCert(false); setNewCertification({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: '' }); }}
                    className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCertification}
                    disabled={!newCertification.name || !newCertification.issuer}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Certification
                  </button>
                </div>
              </div>
            )}

            {/* Certifications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {cert.imageUrl ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-8 h-8 text-amber-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{cert.name}</h3>
                        {isEditing && (
                          <button
                            onClick={() => removeCertification(cert.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600">{cert.issuer}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                        <span>Issued {formatDate(cert.issueDate)}</span>
                        {cert.expiryDate && (
                          <span>• Expires {formatDate(cert.expiryDate)}</span>
                        )}
                      </div>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mt-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Show credential
                        </a>
                      )}
                    </div>
                  </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
