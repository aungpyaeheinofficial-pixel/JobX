// API Service for JobX Frontend
// Replace all local storage with API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

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
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
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
    return apiRequest('/feed', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  likePost: async (postId) => {
    return apiRequest(`/feed/${postId}/like`, {
      method: 'POST',
    });
  },

  bookmarkPost: async (postId) => {
    return apiRequest(`/feed/${postId}/bookmark`, {
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
  getProfile: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
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
  network: networkAPI,
  projects: projectsAPI,
  getToken,
  setToken,
  removeToken,
};
