# Quick Fix: Nginx Redirect Loop

## The Problem
```
rewrite or internal redirection cycle while internally redirecting to "/index.html"
```

## Most Likely Cause: Missing index.html

**Check if index.html exists:**
```bash
ls -la /var/www/jobx-frontend/index.html
```

**If it doesn't exist, you need to build and upload the frontend:**

```bash
# On your LOCAL machine
cd /path/to/JobX
npm run build

# Upload to server
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

**On server, fix permissions:**
```bash
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend
```

## Updated Nginx Config (Clean Version)

```bash
sudo nano /etc/nginx/sites-available/jobx
```

**Use this configuration:**

```nginx
server {
    listen 5560;
    server_name _;

    # Backend API
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

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

**Then:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Verify

```bash
# Check if index.html exists
ls -la /var/www/jobx-frontend/index.html

# Test
curl -I http://127.0.0.1:5560/
# Should return 200 OK
```
