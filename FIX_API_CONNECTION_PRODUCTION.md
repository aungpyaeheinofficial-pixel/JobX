# Fix API Connection - Production Build

## Problem
Frontend loads on `http://167.172.90.182:5560/` but API calls fail.

## Root Cause
The production build doesn't have the API URL configured, so it defaults to `http://localhost:9999/api` which doesn't work.

## Solution

### Step 1: Check What's Happening

**In browser console (F12), run:**
```javascript
// Check what API URL is being used
console.log('API URL:', import.meta.env.VITE_API_URL);

// Test API connection
fetch('http://167.172.90.182:5560/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ API works:', d))
  .catch(e => console.error('❌ API failed:', e));
```

### Step 2: Verify Backend is Running (On Server)

```bash
# SSH to server
ssh root@167.172.90.182

# Check backend status
pm2 status

# Should show: jobx-backend | online

# If not running, start it:
cd /var/www/jobx-backend
pm2 start ecosystem.config.cjs
pm2 logs jobx-backend
```

### Step 3: Test Backend Directly (On Server)

```bash
# Test backend health
curl http://127.0.0.1:9999/health

# Should return: {"status":"healthy",...}
```

### Step 4: Test API Through Nginx (On Server)

```bash
# Test API endpoint through Nginx
curl http://127.0.0.1:5560/api/health

# Should return: {"status":"healthy",...}
```

**If this fails, Nginx isn't proxying correctly!**

### Step 5: Check Nginx Configuration (On Server)

```bash
# Check Nginx config
sudo cat /etc/nginx/sites-available/jobx | grep -A 10 "location /api"

# Should show:
# location /api {
#     proxy_pass http://127.0.0.1:9999/api;
#     ...
# }
```

**If `/api` location is missing, add it:**

```bash
sudo nano /etc/nginx/sites-available/jobx
```

Add this BEFORE the `location /` block:

```nginx
# Backend API - must come before frontend location
location /api {
    proxy_pass http://127.0.0.1:9999/api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Then:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Rebuild Frontend with Correct API URL

**On your LOCAL machine:**

1. Create `.env.production` file:
```bash
# In project root
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production
```

2. Rebuild frontend:
```bash
npm run build
```

3. Upload new build to server:
```bash
# From your local machine
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

**On server, set permissions:**
```bash
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

### Step 7: Check CORS Settings (On Server)

```bash
# Check backend .env
cat /var/www/jobx-backend/.env | grep ALLOWED_ORIGINS

# Should include:
# ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182

# If missing, add it:
nano /var/www/jobx-backend/.env
# Add: ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182
# Save and restart:
pm2 restart jobx-backend
```

## Quick Diagnostic Commands

**Run these on your server to diagnose:**

```bash
# 1. Check backend
pm2 status
curl http://127.0.0.1:9999/health

# 2. Check Nginx
sudo systemctl status nginx
curl http://127.0.0.1:5560/api/health

# 3. Check Nginx config
sudo nginx -t
sudo cat /etc/nginx/sites-available/jobx

# 4. Check logs
pm2 logs jobx-backend --lines 20
sudo tail -20 /var/log/nginx/error.log
```

## Expected Results

✅ `pm2 status` → Shows jobx-backend as "online"  
✅ `curl http://127.0.0.1:9999/health` → Returns JSON  
✅ `curl http://127.0.0.1:5560/api/health` → Returns JSON  
✅ Browser `fetch('/api/health')` → Returns JSON  
✅ No CORS errors in browser console

## Most Common Issues

1. **Backend not running** → `pm2 start ecosystem.config.cjs`
2. **Nginx not proxying /api** → Add location /api block
3. **CORS error** → Update ALLOWED_ORIGINS in backend .env
4. **Wrong API URL in build** → Rebuild with .env.production

## Test After Fix

In browser console:
```javascript
// Should work now
fetch('http://167.172.90.182:5560/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Success!', d));
```
