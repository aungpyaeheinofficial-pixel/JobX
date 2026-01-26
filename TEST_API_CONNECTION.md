# Test API Connection - Quick Guide

## Problem
Frontend loads but API calls to backend fail.

## Quick Tests

### Test 1: Check Backend Health (On Server)

```bash
# SSH to your server
ssh root@167.172.90.182

# Test backend directly
curl http://127.0.0.1:9999/health

# Should return: {"status":"healthy",...}
```

### Test 2: Test API Through Nginx (On Server)

```bash
# Test API endpoint through Nginx
curl http://127.0.0.1:5560/api/health

# Should return: {"status":"healthy",...}
```

### Test 3: Test API From Browser Console

Open browser console (F12) and run:

```javascript
// Test API health endpoint
fetch('http://167.172.90.182:5560/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ API Working:', data))
  .catch(err => console.error('❌ API Error:', err));
```

## Common Issues & Fixes

### Issue 1: Backend Not Running

**Check:**
```bash
pm2 status
```

**Fix:**
```bash
cd /var/www/jobx-backend
pm2 start ecosystem.config.cjs
pm2 logs jobx-backend
```

### Issue 2: Nginx Not Proxying /api

**Check Nginx config:**
```bash
sudo cat /etc/nginx/sites-available/jobx
```

**Should have:**
```nginx
location /api {
    proxy_pass http://127.0.0.1:9999/api;
    # ... other settings
}
```

**Fix if missing:**
```bash
sudo nano /etc/nginx/sites-available/jobx
# Add the /api location block
sudo nginx -t
sudo systemctl restart nginx
```

### Issue 3: CORS Error

**Check backend .env:**
```bash
cat /var/www/jobx-backend/.env | grep ALLOWED_ORIGINS
```

**Should include:**
```
ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182
```

**Fix:**
```bash
nano /var/www/jobx-backend/.env
# Update ALLOWED_ORIGINS
pm2 restart jobx-backend
```

### Issue 4: Backend Port Not Accessible

**Check if backend is listening:**
```bash
sudo netstat -tulpn | grep 9999
```

**Should show Node.js process listening on 9999**

## Step-by-Step Fix

1. **Verify Backend is Running:**
   ```bash
   pm2 status
   # Should show jobx-backend as "online"
   ```

2. **Test Backend Directly:**
   ```bash
   curl http://127.0.0.1:9999/health
   ```

3. **Test Through Nginx:**
   ```bash
   curl http://127.0.0.1:5560/api/health
   ```

4. **Check Nginx Logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

5. **Check Backend Logs:**
   ```bash
   pm2 logs jobx-backend --lines 50
   ```

6. **Test from Browser:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login/register
   - Check for failed `/api` requests
   - Look at error messages

## Expected Behavior

✅ Backend health: `curl http://127.0.0.1:9999/health` → Returns JSON  
✅ API through Nginx: `curl http://127.0.0.1:5560/api/health` → Returns JSON  
✅ Browser fetch: `fetch('/api/health')` → Returns JSON  
✅ No CORS errors in browser console  
✅ API requests show 200 status in Network tab
