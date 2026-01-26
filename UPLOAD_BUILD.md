# Upload New Build to Server

## Build Complete ✅

The frontend has been rebuilt with the correct API URL: `http://167.172.90.182:5560/api`

## Upload to Server

### Option 1: Using SCP (From Your Local Machine)

```bash
# Upload the dist folder contents
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

### Option 2: Using Git (On Server)

**On your server:**

```bash
# SSH to server
ssh root@167.172.90.182

# Go to project directory
cd /var/www/html/JobX

# Pull latest changes
git pull

# Build on server (if Node.js is installed)
npm run build

# Copy to frontend directory
sudo cp -r dist/* /var/www/jobx-frontend/
```

### Set Permissions (On Server)

After uploading, set correct permissions:

```bash
# SSH to server
ssh root@167.172.90.182

# Set permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

## Verify

After uploading:

1. **Clear browser cache** (Ctrl+Shift+Delete or hard refresh Ctrl+Shift+R)
2. **Refresh the page**
3. **Check console** - should now show:
   ```
   Current API URL: http://167.172.90.182:5560/api
   ```
4. **Test connection:**
   ```javascript
   testConnection()
   ```
   Should work now!

## Quick Commands Summary

```bash
# 1. Build (already done ✅)
npm run build

# 2. Upload (from local machine)
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/

# 3. Set permissions (on server)
ssh root@167.172.90.182
sudo chown -R www-data:www-data /var/www/jobx-frontend
```
