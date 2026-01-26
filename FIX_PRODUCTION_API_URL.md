# Fix Production API URL - Currently Using localhost

## Problem
Production build shows:
```
Current API URL: http://localhost:9999/api
```

This won't work because the browser can't reach `localhost:9999` from your computer!

## Solution: Rebuild Frontend with Correct API URL

### Step 1: Create `.env.production` File

**On your LOCAL machine**, in the project root, create `.env.production`:

```bash
# Windows PowerShell
New-Item -Path .env.production -ItemType File

# Or manually create the file
```

Add this content:
```env
VITE_API_URL=http://167.172.90.182:5560/api
```

### Step 2: Rebuild Frontend

```bash
npm run build
```

### Step 3: Upload to Server

```bash
# From your local machine
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

### Step 4: Set Permissions (On Server)

```bash
# SSH to server
ssh root@167.172.90.182

# Set permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

### Step 5: Verify

Refresh browser and check console - should now show:
```
Current API URL: http://167.172.90.182:5560/api
```

## Quick Commands

```bash
# 1. Create .env.production
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production

# 2. Build
npm run build

# 3. Upload (from local machine)
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/

# 4. Set permissions (on server)
sudo chown -R www-data:www-data /var/www/jobx-frontend
```
