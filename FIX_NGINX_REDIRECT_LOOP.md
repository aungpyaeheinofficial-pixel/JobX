# Fix Nginx Redirect Loop Error

## Problem
```
rewrite or internal redirection cycle while internally redirecting to "/index.html"
```

This happens when Nginx gets stuck in a redirect loop trying to serve index.html.

## Solution: Fixed Nginx Configuration

**Update your Nginx config:**

```bash
sudo nano /etc/nginx/sites-available/jobx
```

**Replace the entire file with this CORRECTED version:**

```nginx
server {
    listen 5560;
    server_name _;

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

    # Frontend - serves static files
    root /var/www/jobx-frontend;
    index index.html;

    # Main location block
    location / {
        # First try to serve the file, then directory, then fallback to index.html
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

**Key fixes:**
1. Removed any conflicting location blocks
2. Simplified the try_files directive
3. Added `access_log off` for static assets to reduce log noise

**Then:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Alternative: If Still Having Issues

**Check if index.html exists:**
```bash
ls -la /var/www/jobx-frontend/index.html
```

**If missing, check the directory:**
```bash
ls -la /var/www/jobx-frontend/
```

**If files are in wrong location:**
```bash
# Find where your frontend build is
find /var/www -name "index.html" -type f

# Copy to correct location
sudo cp -r /path/to/dist/* /var/www/jobx-frontend/
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

## Verify Fix

```bash
# Test frontend
curl -I http://127.0.0.1:5560/

# Should return 200 OK, not 500 or redirect loop
```
