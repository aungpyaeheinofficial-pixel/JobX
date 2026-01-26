// Paste this directly into browser console to test connection
// Copy and paste the entire code block below into your browser console (F12)

(async function testConnection() {
  const API_URL = 'http://167.172.90.182:5560/api'; // Update with your IP
  const baseURL = API_URL.replace('/api', '');
  
  console.log('🔍 Testing Backend Connection...');
  console.log('📍 API URL:', API_URL);
  console.log('📍 Base URL:', baseURL);
  
  try {
    // Test health endpoint
    console.log('📡 Testing /health endpoint...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health Check:', healthData);
    
    // Test API endpoint
    console.log('📡 Testing /api/auth endpoint...');
    const apiResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'no-token'}`
      }
    });
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ API Endpoint Working:', apiData);
    } else {
      const errorData = await apiResponse.json();
      console.log('⚠️ API Response (expected if not logged in):', errorData);
    }
    
    console.log('✅ Connection test complete!');
    return { success: true };
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    console.error('💡 Troubleshooting:');
    console.error('   1. Check backend is running: pm2 status');
    console.error('   2. Check Nginx is running: sudo systemctl status nginx');
    console.error('   3. Verify API URL is correct:', API_URL);
    console.error('   4. Check CORS settings in backend/.env');
    return { success: false, error: error.message };
  }
})();
