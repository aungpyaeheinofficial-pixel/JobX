# Fix Frontend Database Connection

## Problem
Frontend is not connecting to the backend database.

## Solution

### Step 1: Create `.env` File

Create a `.env` file in the root directory with your API URL:

```bash
# .env
VITE_API_URL=http://167.172.90.182:5560/api
```

**Important:** Replace `167.172.90.182` with your actual Digital Ocean droplet IP.

### Step 2: Verify Backend is Running

On your server, check if backend is running:

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs jobx-backend

# Test backend health
curl http://127.0.0.1:9999/health
```

### Step 3: Verify Nginx Configuration

Check that Nginx is proxying `/api` requests correctly:

```bash
# Check Nginx config
sudo cat /etc/nginx/sites-available/jobx

# Test Nginx config
sudo nginx -t

# Restart Nginx if needed
sudo systemctl restart nginx
```

The Nginx config should have:
```nginx
location /api {
    proxy_pass http://127.0.0.1:9999/api;
    # ... other proxy settings
}
```

### Step 4: Check CORS Settings

In `backend/.env`, ensure CORS allows your frontend:

```bash
ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182,http://localhost:5560
```

### Step 5: Rebuild Frontend

After creating `.env`, rebuild the frontend:

```bash
# Development
npm run dev

# Production build
npm run build
```

**Important:** Vite requires a restart to pick up new environment variables!

### Step 6: Check Browser Console

Open browser DevTools (F12) and check:
1. **Console tab** - Look for API errors
2. **Network tab** - Check if API requests are being made
3. Look for CORS errors or connection refused errors

### Step 7: Test API Connection

In browser console, test the connection:

```javascript
// Check API URL
console.log('API URL:', import.meta.env.VITE_API_URL);

// Test connection
fetch('http://167.172.90.182:5560/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## Common Issues

### Issue 1: "Cannot connect to server"
**Solution:**
- Check backend is running: `pm2 status`
- Check backend port: `netstat -tulpn | grep 9999`
- Check Nginx is running: `sudo systemctl status nginx`

### Issue 2: CORS Error
**Solution:**
- Update `ALLOWED_ORIGINS` in `backend/.env`
- Restart backend: `pm2 restart jobx-backend`

### Issue 3: 404 Not Found
**Solution:**
- Check Nginx `proxy_pass` includes `/api` at the end
- Verify route: `http://127.0.0.1:9999/api/health` works

### Issue 4: Environment Variable Not Loading
**Solution:**
- Restart Vite dev server
- Check `.env` file is in root directory
- Check variable name starts with `VITE_`
- Rebuild: `npm run build`

## Verification Checklist

- [ ] `.env` file exists with `VITE_API_URL`
- [ ] Backend is running (`pm2 status`)
- [ ] Backend health check works (`curl http://127.0.0.1:9999/health`)
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Nginx proxies `/api` correctly
- [ ] CORS allows frontend origin
- [ ] Frontend rebuilt after `.env` changes
- [ ] Browser console shows correct API URL
- [ ] Network tab shows API requests

## Quick Test

```bash
# On server - Test backend
curl http://127.0.0.1:9999/api/health

# From browser - Test frontend connection
# Open DevTools Console and run:
fetch('http://167.172.90.182:5560/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Connected!', d))
  .catch(e => console.error('❌ Error:', e));
```

## Still Not Working?

1. Check firewall: `sudo ufw status`
2. Check backend logs: `pm2 logs jobx-backend --lines 50`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Check browser network tab for actual request/response
