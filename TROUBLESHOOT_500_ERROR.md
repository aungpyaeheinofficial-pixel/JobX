# Troubleshoot 500 Internal Server Error

## Quick Checks

### 1. Check Nginx Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

This will show the actual error causing the 500.

### 2. Check if Frontend Files Exist

```bash
ls -la /var/www/jobx-frontend/
```

Should see `index.html` and other files.

### 3. Check Backend is Running

```bash
# From server
curl http://127.0.0.1:9999/health

# Should return: {"status":"healthy",...}
```

### 4. Check Nginx Configuration

```bash
sudo nginx -t
```

Should show "syntax is ok" and "test is successful".

### 5. Check File Permissions

```bash
# Frontend files should be readable
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend
```

## Common Issues & Fixes

### Issue 1: Frontend Files Missing

**Solution:**
```bash
# Check if files exist
ls -la /var/www/jobx-frontend/

# If empty, upload/build frontend
cd /var/www/html/JobX
npm run build
cp -r dist/* /var/www/jobx-frontend/
```

### Issue 2: Nginx Rewrite Rule Issue

The rewrite rule might be causing issues. Try this updated config:

```nginx
server {
    listen 5560;
    server_name _;

    # Backend API
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
        
        # Remove rewrite, let backend handle /api path
        # rewrite ^/api/(.*) /$1 break;
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

### Issue 3: Backend Not Responding

**Check backend logs:**
```bash
pm2 logs jobx-backend --lines 50
```

**Check if backend is listening:**
```bash
sudo netstat -tulpn | grep 9999
```

### Issue 4: Permission Denied

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend
sudo chown -R $USER:$USER /var/www/html/JobX/backend
```

## Step-by-Step Debugging

1. **Check Nginx error log:**
   ```bash
   sudo tail -20 /var/log/nginx/error.log
   ```

2. **Test backend directly:**
   ```bash
   curl http://127.0.0.1:9999/health
   ```

3. **Test frontend files:**
   ```bash
   curl http://127.0.0.1:5560/
   ```

4. **Check Nginx config syntax:**
   ```bash
   sudo nginx -t
   ```

5. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## Most Likely Issue

Based on the error, the most common cause is:

1. **Frontend files not uploaded** - Check `/var/www/jobx-frontend/` has files
2. **Nginx rewrite rule issue** - The rewrite might be breaking the proxy
3. **Backend route mismatch** - Backend expects `/api` but rewrite removes it

Try the updated Nginx config above without the rewrite rule first.
