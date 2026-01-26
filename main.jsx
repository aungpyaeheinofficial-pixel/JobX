import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { testConnection, testAuth } from './src/utils/testConnection.js' // Load connection test utilities

// Make test functions available globally for debugging
if (import.meta.env.DEV) {
  window.testConnection = testConnection;
  window.testAuth = testAuth;
  console.log('🔧 Debug tools available:');
  console.log('   - testConnection() - Test backend connection');
  console.log('   - testAuth() - Test authentication');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
