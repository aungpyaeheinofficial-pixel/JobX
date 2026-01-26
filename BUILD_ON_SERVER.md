# Build Frontend on Server - Quick Fix

## Problem
- Git pull failed due to `.env.production` conflict
- Frontend still using localhost API URL
- Need to rebuild on server

## Solution: Build on Server

### Step 1: Fix Git Conflict

**On your server:**

```bash
# Remove the conflicting file
rm .env.production

# Pull again
git pull
```

### Step 2: Create .env.production on Server

```bash
# Create .env.production with correct API URL
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production
```

### Step 3: Build Frontend

```bash
# Make sure you're in the project root
cd /var/www/html/JobX

# Install dependencies if needed
npm install

# Build
npm run build
```

### Step 4: Copy Build to Frontend Directory

```bash
# Copy dist contents to frontend directory
sudo cp -r dist/* /var/www/jobx-frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

### Step 5: Verify

1. Clear browser cache (Ctrl+Shift+R)
2. Refresh page
3. Check console - should show:
   ```
   Current API URL: http://167.172.90.182:5560/api
   ```

## Quick Commands (All on Server)

```bash
# 1. Fix git conflict
rm .env.production
git pull

# 2. Create .env.production
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production

# 3. Build
npm run build

# 4. Copy to frontend
sudo cp -r dist/* /var/www/jobx-frontend/
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

## After This

- Frontend will use correct API URL
- Registration/Login will work
- Users will be saved to database
- Authentication will persist on refresh
