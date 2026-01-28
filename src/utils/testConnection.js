// Utility to test backend connection
// Use this in browser console to debug connection issues

export const testConnection = async () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';
  
  try {
    // Test health endpoint
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    const data = await response.json();
    console.log('✅ Backend Health Check:', data);
    return data;
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    return { error: error.message };
  }
};

// Test auth endpoint
export const testAuth = async () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';
  
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth Test Success:', data);
      return { success: true, data };
    } else {
      const error = await response.json();
      console.error('❌ Auth Test Failed:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('❌ Auth Test Error:', error.message);
    return { success: false, error: error.message };
  }
};

// Functions are exported and will be attached to window in main.jsx
