# Frontend Not Connecting to Database - FIX GUIDE

## 🔍 Problem
Frontend is not connecting to the backend database. This means:
- Login/Signup doesn't work
- Data doesn't persist
- API calls fail

## ✅ Solution

### The Issue
The frontend needs to know where the backend API is located. This is configured via environment variables.

### Step-by-Step Fix

#### 1. Create `.env` File (REQUIRED)

**On your LOCAL machine**, in the project root directory, create a `.env` file:

```bash
# Create .env file
# Windows PowerShell:
New-Item -Path .env -ItemType File

# Linux/Mac:
touch .env
```

#### 2. Add API URL to `.env`

Open `.env` and add this line (replace with your actual IP):

```env
VITE_API_URL=http://167.172.90.182:5560/api
```

**⚠️ Replace `167.172.90.182` with your actual Digital Ocean droplet IP!**

#### 3. Restart Development Server

**CRITICAL:** You MUST restart the dev server for Vite to load the new environment variable:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

#### 4. Verify Connection

Open browser console (F12) and you should see:

```
🔗 API URL: http://167.172.90.182:5560/api
```

Test the connection:
```javascript
// In browser console
testConnection();
```

## 🔧 What Was Added

### 1. Enhanced API Error Logging
- Better error messages showing what went wrong
- Network error detection
- API URL logging in development

### 2. Debug Tools
- `testConnection()` - Test backend connection
- `testAuth()` - Test authentication
- Available in browser console (F12)

### 3. Environment File Template
- `.env.example` - Template for environment variables
- `SETUP_ENV_FILE.md` - Detailed setup guide

## 📋 Verification Checklist

Before testing, verify:

- [ ] `.env` file exists in root directory
- [ ] `.env` contains `VITE_API_URL=http://YOUR_IP:5560/api`
- [ ] Dev server was restarted after creating `.env`
- [ ] Backend is running on server (`pm2 status`)
- [ ] Backend health check works (`curl http://127.0.0.1:9999/health`)
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Browser console shows correct API URL

## 🧪 Testing

### Test 1: Check API URL
```javascript
// Browser console
console.log(import.meta.env.VITE_API_URL);
// Should show: http://167.172.90.182:5560/api
```

### Test 2: Test Connection
```javascript
// Browser console
testConnection();
// Should show: ✅ Backend Health Check: {status: "healthy", ...}
```

### Test 3: Test Login
1. Go to login page
2. Enter credentials
3. Check browser console for:
   - `🔐 Attempting login...`
   - `✅ Login successful: your@email.com`
   - OR error message if it fails

## 🐛 Common Issues

### Issue: "Cannot connect to server"
**Check:**
1. Backend running? `pm2 status` on server
2. Backend accessible? `curl http://127.0.0.1:9999/health` on server
3. Nginx running? `sudo systemctl status nginx` on server
4. API URL correct? Check `.env` file

### Issue: CORS Error
**Fix:**
1. Update `backend/.env`:
   ```bash
   ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182
   ```
2. Restart backend: `pm2 restart jobx-backend`

### Issue: Environment variable not loading
**Fix:**
1. Check `.env` file name (exactly `.env`, not `.env.txt`)
2. Check file location (root directory, same as `package.json`)
3. **Restart dev server** (most common issue!)
4. Check variable name starts with `VITE_`

### Issue: 404 Not Found
**Check:**
1. Nginx `proxy_pass` includes `/api`:
   ```nginx
   location /api {
       proxy_pass http://127.0.0.1:9999/api;
   }
   ```
2. Backend routes are under `/api` prefix

## 📝 Files Changed

- ✅ `src/services/api.js` - Enhanced error logging
- ✅ `src/contexts/AuthContext.jsx` - Added debug logging
- ✅ `main.jsx` - Added connection test utilities
- ✅ `src/utils/testConnection.js` - NEW: Connection testing tools
- ✅ `.env.example` - NEW: Environment file template
- ✅ `FIX_FRONTEND_CONNECTION.md` - Detailed troubleshooting guide
- ✅ `SETUP_ENV_FILE.md` - Environment setup guide

## 🚀 Next Steps

1. **Create `.env` file** with your API URL
2. **Restart dev server**
3. **Test connection** using `testConnection()` in browser console
4. **Try login/signup** and check console for errors

## 💡 Quick Reference

```bash
# Create .env file
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env

# Restart dev server
npm run dev

# Test in browser console
testConnection()
```

## ✅ Success Indicators

When everything works, you should see:
- ✅ Browser console shows correct API URL
- ✅ `testConnection()` returns success
- ✅ Login/Signup works
- ✅ Data persists after refresh
- ✅ No CORS errors in console

---

**Still having issues?** Check `FIX_FRONTEND_CONNECTION.md` for detailed troubleshooting.
