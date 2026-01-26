# Frontend-Backend Integration Guide

## Overview

This guide shows how to update your frontend components to use the backend API instead of local storage.

## Setup

### 1. Install API Service

The API service is already created at `src/services/api.js`. Make sure it's imported where needed.

### 2. Update Environment

Create `.env` file in project root:
```env
VITE_API_URL=http://localhost:9999/api
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Example: Updating JobXAuth Component

### Before (using local storage):
```javascript
const handleAuthComplete = (user) => {
  setIsAuthenticated(true);
  setUserData(user);
  localStorage.setItem('user', JSON.stringify(user));
  setCurrentView('feed');
};
```

### After (using API):
```javascript
import api from '../services/api';

const handleLogin = async (email, password) => {
  try {
    const response = await api.auth.login(email, password);
    setIsAuthenticated(true);
    setUserData(response.user);
    setCurrentView('feed');
  } catch (error) {
    // Handle error
    console.error('Login failed:', error);
  }
};

const handleRegister = async (userData) => {
  try {
    const response = await api.auth.register(userData);
    setIsAuthenticated(true);
    setUserData(response.user);
    setCurrentView('feed');
  } catch (error) {
    // Handle error
    console.error('Registration failed:', error);
  }
};
```

## Example: Updating FeedPage Component

### Before:
```javascript
const [posts, setPosts] = useState(initialPosts);

const handleNewPost = ({ content, type, image }) => {
  const newPost = {
    id: Date.now(),
    author: { name: userData?.name },
    content,
    // ...
  };
  setPosts(prev => [newPost, ...prev]);
};
```

### After:
```javascript
import api from '../services/api';
import { useEffect } from 'react';

const FeedPage = ({ userData }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await api.feed.getPosts();
      setPosts(response.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async ({ content, type, image }) => {
    try {
      const response = await api.feed.createPost({
        content,
        post_type: type,
        image_url: image
      });
      setPosts(prev => [response.post, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
};
```

## Example: Updating JobsPage Component

### Before:
```javascript
const [jobs, setJobs] = useState(mockJobs);
```

### After:
```javascript
import api from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await api.jobs.getAll();
      setJobs(response.jobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };
};
```

## Example: Updating Applications

### Before:
```javascript
const handleApply = (applicationData) => {
  setApplications(prev => [...prev, applicationData]);
};
```

### After:
```javascript
import api from '../services/api';

const handleApply = async (jobId, coverLetter) => {
  try {
    await api.applications.apply(jobId, coverLetter);
    // Refresh applications list
    const response = await api.applications.getMyApplications();
    setApplications(response.applications);
  } catch (error) {
    if (error.message.includes('requiresPremium')) {
      // Show upgrade modal
      setShowPremiumModal(true);
    } else {
      console.error('Failed to apply:', error);
    }
  }
};
```

## Authentication State Management

### Create Auth Context

Create `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = api.getToken();
    if (token) {
      try {
        const response = await api.auth.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        api.removeToken();
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.auth.login(email, password);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Use in App.jsx

```javascript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

## Error Handling

Always wrap API calls in try-catch:

```javascript
try {
  const response = await api.jobs.getAll();
  // Handle success
} catch (error) {
  // Handle error
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    navigate('/auth');
  } else if (error.message.includes('403')) {
    // Forbidden - show upgrade message
    showUpgradeModal();
  } else {
    // Other errors
    showErrorToast(error.message);
  }
}
```

## Loading States

Always show loading states:

```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await api.someAction();
  } finally {
    setLoading(false);
  }
};
```

## Checklist for Each Component

When updating a component:

- [ ] Remove local storage usage
- [ ] Import API service
- [ ] Add loading states
- [ ] Add error handling
- [ ] Use useEffect for data loading
- [ ] Update state from API responses
- [ ] Handle authentication errors
- [ ] Handle subscription limits

## Common Patterns

### Loading Data on Mount
```javascript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const response = await api.someEndpoint();
    setData(response.data);
  } catch (error) {
    handleError(error);
  }
};
```

### Creating/Updating Data
```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await api.createSomething(formData);
    setItems(prev => [response.item, ...prev]);
    showSuccessToast('Created successfully');
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

### Deleting Data
```javascript
const handleDelete = async (id) => {
  try {
    await api.deleteSomething(id);
    setItems(prev => prev.filter(item => item.id !== id));
    showSuccessToast('Deleted successfully');
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

## Testing API Connection

Test your API connection:

```javascript
// In browser console or component
import api from './services/api';

// Test health endpoint
fetch('http://localhost:9999/health')
  .then(r => r.json())
  .then(console.log);

// Test login
api.auth.login('test@example.com', 'password')
  .then(console.log)
  .catch(console.error);
```

## Next Steps

1. Update each component one by one
2. Test each API endpoint
3. Handle errors gracefully
4. Add loading indicators
5. Update authentication flow
6. Test subscription features
7. Test payment flows
