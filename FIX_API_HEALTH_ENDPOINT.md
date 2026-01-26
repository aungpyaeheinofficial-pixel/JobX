# Fix API Health Endpoint - Route Not Found

## Problem
```bash
curl http://127.0.0.1:5560/api/health
{"error":"Route not found"}
```

## Root Cause
The `/health` endpoint is at the root level (`/health`), but Nginx is proxying `/api/health` to the backend, which doesn't have that route.

## Solution

### Option 1: Fix Nginx Proxy (Recommended)

The backend health endpoint is at `/health`, not `/api/health`. Update Nginx to handle this:

```bash
sudo nano /etc/nginx/sites-available/jobx
```

Update the `/api` location block:

```nginx
# Backend API - must come before frontend location
location /api {
    proxy_pass http://127.0.0.1:9999;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Health endpoint (separate, at root level)
location /health {
    proxy_pass http://127.0.0.1:9999/health;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

**Key change:** `proxy_pass http://127.0.0.1:9999;` (without `/api` at the end)

This way:
- `/api/auth/login` → Backend receives `/api/auth/login` ✓
- `/health` → Backend receives `/health` ✓

### Option 2: Add Health to Backend API Routes

Alternatively, add a health endpoint under `/api` in the backend:

```javascript
// In backend/server.js, add before other routes:
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});
```

## Quick Fix (Recommended)

**On your server:**

```bash
sudo nano /etc/nginx/sites-available/jobx
```

Change this line:
```nginx
proxy_pass http://127.0.0.1:9999/api;
```

To this:
```nginx
proxy_pass http://127.0.0.1:9999;
```

**Why?** The backend routes are already mounted at `/api` in `server.js`, so when Nginx proxies `/api/*` to `http://127.0.0.1:9999`, the backend receives `/api/*` which matches the routes.

But wait - if the health endpoint is at `/health` (not `/api/health`), then we need to handle it separately.

## Correct Nginx Configuration

```nginx
server {
    listen 5560;
    server_name _;

    # Health endpoint (root level)
    location /health {
        proxy_pass http://127.0.0.1:9999/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Backend API routes
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

    # Frontend
    root /var/www/jobx-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ @fallback;
    }

    location @fallback {
        rewrite ^.*$ /index.html last;
    }
}
```

## Test After Fix

```bash
# Test health endpoint
curl http://127.0.0.1:5560/health
# Should return: {"status":"healthy",...}

# Test API endpoint
curl http://127.0.0.1:5560/api/auth/me
# Should return auth error (expected if not logged in)

# Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```
