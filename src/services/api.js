// API Service for JobX Frontend
// Replace all local storage with API calls

// Use relative path if no explicit API URL is set (same origin)
// Otherwise use the configured URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Debug: Log API URL on load (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
  console.log('🔗 Environment:', import.meta.env.MODE);
  console.log('🔗 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Generic fetch wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Handle relative paths (starting with /) vs full URLs
    const fullUrl = API_URL.startsWith('http') 
      ? `${API_URL}${endpoint}` 
      : `${API_URL}${endpoint}`;
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('📡 API Request:', {
        method: options.method || 'GET',
        url: fullUrl,
        hasToken: !!token
      });
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Request failed');
    }

    if (!response.ok) {
      const errorMessage = data.error || data.message || 'Request failed';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      
      // Enhanced error logging
      console.error('❌ API Error Response:', {
        status: response.status,
        endpoint,
        error: errorMessage,
        url: fullUrl
      });
      
      throw error;
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('✅ API Success:', endpoint);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('🌐 Network Error - Check:', {
          apiUrl: API_URL,
          endpoint,
          message: 'Cannot connect to backend. Is the server running?'
        });
        throw new Error(`Cannot connect to server. Please check if the backend is running at ${API_URL}`);
      }
      console.error('❌ API Error:', error.message, endpoint);
      throw error;
    }
    console.error('❌ API Error:', error);
    throw new Error('Network error or invalid response');
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Jobs API
export const jobsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/jobs?${params.toString()}`);
  },

  getById: async (id) => {
    return apiRequest(`/jobs/${id}`);
  },

  create: async (jobData) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  update: async (id, jobData) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  getSaved: async () => {
    return apiRequest('/jobs/saved');
  },

  saveJob: async (jobId) => {
    return apiRequest(`/jobs/${jobId}/save`, {
      method: 'POST',
    });
  },

  unsaveJob: async (jobId) => {
    return apiRequest(`/jobs/${jobId}/save`, {
      method: 'DELETE',
    });
  },
};

// Applications API
export const applicationsAPI = {
  apply: async (jobId, coverLetter, resumeUrl) => {
    return apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      }),
    });
  },

  getMyApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/applications/my-applications?${params.toString()}`);
  },

  withdraw: async (applicationId) => {
    return apiRequest(`/applications/${applicationId}`, {
      method: 'DELETE',
    });
  },
};

// Feed API
export const feedAPI = {
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/feed?${params.toString()}`);
  },

  createPost: async (postData) => {
    if (import.meta.env.DEV) {
      console.log('📤 Creating post:', postData);
    }
    try {
      const response = await apiRequest('/feed', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      if (import.meta.env.DEV) {
        console.log('✅ Post created successfully:', response);
      }
      return response;
    } catch (error) {
      console.error('❌ Post creation failed:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    return apiRequest(`/feed/${postId}/like`, {
      method: 'POST',
    });
  },

  unlikePost: async (postId) => {
    return apiRequest(`/feed/${postId}/like`, {
      method: 'DELETE',
    });
  },

  bookmarkPost: async (postId) => {
    return apiRequest(`/feed/${postId}/bookmark`, {
      method: 'POST',
    });
  },

  unbookmarkPost: async (postId) => {
    return apiRequest(`/feed/${postId}/bookmark`, {
      method: 'DELETE',
    });
  },

  sharePost: async (postId) => {
    return apiRequest(`/feed/${postId}/share`, {
      method: 'POST',
    });
  },

  viewPost: async (postId) => {
    return apiRequest(`/feed/${postId}/view`, {
      method: 'POST',
    });
  },

  addComment: async (postId, content) => {
    return apiRequest(`/feed/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  getComments: async (postId) => {
    return apiRequest(`/feed/${postId}/comments`);
  },
};

// Subscriptions API
export const subscriptionsAPI = {
  getPlans: async () => {
    return apiRequest('/subscriptions/plans');
  },

  getCurrent: async () => {
    return apiRequest('/subscriptions/current');
  },

  checkout: async (plan, billingCycle) => {
    return apiRequest('/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan, billing_cycle: billingCycle }),
    });
  },

  cancel: async () => {
    return apiRequest('/subscriptions/cancel', {
      method: 'POST',
    });
  },
};

// Payments API
export const paymentsAPI = {
  getWallet: async () => {
    return apiRequest('/payments/wallet');
  },

  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/payments/transactions?${params.toString()}`);
  },
};

// Companies API
export const companiesAPI = {
  create: async (companyData) => {
    return apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  getMyCompany: async () => {
    return apiRequest('/companies/me');
  },
};

// Users API
export const usersAPI = {
  getProfile: async (userId, extended = false) => {
    const params = extended ? '?extended=true' : '';
    return apiRequest(`/users/${userId}${params}`);
  },

  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Profiles API (Extended)
export const profilesAPI = {
  getExtended: async (userId) => {
    return apiRequest(`/profiles/${userId}`);
  },

  getMyExtended: async () => {
    return apiRequest('/profiles/me/extended');
  },

  updateExtended: async (profileData) => {
    if (import.meta.env.DEV) {
      console.log('📤 Updating extended profile:', profileData);
    }
    try {
      const response = await apiRequest('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      if (import.meta.env.DEV) {
        console.log('✅ Profile updated successfully:', response);
      }
      return response;
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    return apiRequest('/messages/conversations');
  },

  getMessages: async (userId) => {
    return apiRequest(`/messages/user/${userId}`);
  },

  sendMessage: async (recipientId, content) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, content }),
    });
  },

  markAsRead: async (senderId) => {
    return apiRequest('/messages/read', {
      method: 'PATCH',
      body: JSON.stringify({ sender_id: senderId }),
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/messages/unread/count');
  },

  deleteMessage: async (messageId) => {
    return apiRequest(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};

// Network API
export const networkAPI = {
  getConnections: async () => {
    return apiRequest('/network/connections');
  },

  connect: async (userId) => {
    return apiRequest(`/network/connect/${userId}`, {
      method: 'POST',
    });
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return apiRequest('/projects');
  },

  create: async (projectData) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  feed: feedAPI,
  subscriptions: subscriptionsAPI,
  payments: paymentsAPI,
  companies: companiesAPI,
  users: usersAPI,
  profiles: profilesAPI,
  messages: messagesAPI,
  network: networkAPI,
  projects: projectsAPI,
  getToken,
  setToken,
  removeToken,
};
