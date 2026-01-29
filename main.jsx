import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { testConnection, testAuth } from './src/utils/testConnection.js' // Load connection test utilities

// Default to dark theme (brand: #FC5114)
document.documentElement.classList.add('dark');

// Make test functions available globally for debugging (always available)
window.testConnection = testConnection;
window.testAuth = testAuth;

// Log availability
console.log('🔧 Debug tools available:');
console.log('   - testConnection() - Test backend connection');
console.log('   - testAuth() - Test authentication');
console.log('   - Current API URL:', import.meta.env.VITE_API_URL || 'http://localhost:9999/api');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
