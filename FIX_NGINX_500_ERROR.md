# Fix 500 Internal Server Error - Quick Solution

## Problem
Nginx returns 500 error when accessing `http://YOUR_IP:5560`

## Most Common Causes

### 1. Frontend Files Not Uploaded

**Check:**
```bash
ls -la /var/www/jobx-frontend/
```

**If empty or missing index.html:**
```bash
# Build and upload frontend
cd /var/www/html/JobX
npm run build
sudo cp -r dist/* /var/www/jobx-frontend/
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

### 2. Nginx Rewrite Rule Issue

The rewrite rule is breaking the API proxy. Use this **corrected Nginx config**:

```bash
sudo nano /etc/nginx/sites-available/jobx
```

**Replace with this (FIXED VERSION):**

```nginx
server {
    listen 5560;
    server_name _;

    # Backend API - NO rewrite needed, backend handles /api prefix
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
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Key change:** `proxy_pass http://127.0.0.1:9999/api;` (includes /api, no rewrite)

**Then:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Check Nginx Error Log

```bash
sudo tail -30 /var/log/nginx/error.log
```

This will show the exact error.

### 4. Verify Backend is Working

```bash
# Test backend directly
curl http://127.0.0.1:9999/health

# Should return: {"status":"healthy",...}
```

### 5. Check File Permissions

```bash
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend
```

## Quick Fix Commands

Run these in order:

```bash
# 1. Check error log
sudo tail -20 /var/log/nginx/error.log

# 2. Test backend
curl http://127.0.0.1:9999/health

# 3. Check frontend files
ls -la /var/www/jobx-frontend/

# 4. Fix permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend

# 5. Update Nginx config (use the fixed version above)
sudo nano /etc/nginx/sites-available/jobx

# 6. Test and restart
sudo nginx -t
sudo systemctl restart nginx

# 7. Test again
curl http://127.0.0.1:5560/
```

## Expected Results

After fixing:
- `http://YOUR_IP:5560` → Shows frontend
- `http://YOUR_IP:5560/api/health` → Returns `{"status":"healthy",...}`
