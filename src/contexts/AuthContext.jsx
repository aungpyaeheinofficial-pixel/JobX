import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = api.getToken();
    if (token) {
      try {
        const response = await api.auth.getCurrentUser();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid or expired
        console.error('Auth check failed:', error.message);
        api.removeToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('No token found, user not authenticated');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await api.auth.login(email, password);
      console.log('✅ Login successful:', response.user?.email);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...');
      const response = await api.auth.register(userData);
      console.log('✅ Registration successful:', response.user?.email);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const refreshUser = async () => {
    try {
      const response = await api.auth.getCurrentUser();
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
