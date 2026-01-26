# Setup Frontend Directory and Files

## Problem
Frontend directory `/var/www/jobx-frontend/` doesn't exist.

## Solution

### Step 1: Create Frontend Directory

**On your server:**

```bash
# Create directory
sudo mkdir -p /var/www/jobx-frontend

# Set permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend
```

### Step 2: Build Frontend

**Option A: Build on Server (if Node.js is installed)**

```bash
cd /var/www/html/JobX

# Install dependencies (if not done)
npm install

# Build frontend
npm run build

# Copy build files
sudo cp -r dist/* /var/www/jobx-frontend/
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

**Option B: Build Locally and Upload (Recommended)**

**On your LOCAL machine:**

```bash
# Navigate to project
cd /path/to/JobX

# Create .env.production with API URL
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production

# Install dependencies (if not done)
npm install

# Build frontend
npm run build

# Upload to server
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

**On server after upload:**

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/jobx-frontend
sudo chmod -R 755 /var/www/jobx-frontend

# Verify files
ls -la /var/www/jobx-frontend/
# Should see index.html and other files
```

### Step 3: Verify Setup

```bash
# Check if index.html exists
ls -la /var/www/jobx-frontend/index.html

# Test with curl
curl -I http://127.0.0.1:5560/
# Should return 200 OK
```

### Step 4: Restart Nginx

```bash
sudo systemctl restart nginx
```

## Quick One-Liner (If Building on Server)

```bash
sudo mkdir -p /var/www/jobx-frontend && \
cd /var/www/html/JobX && \
npm run build && \
sudo cp -r dist/* /var/www/jobx-frontend/ && \
sudo chown -R www-data:www-data /var/www/jobx-frontend && \
sudo chmod -R 755 /var/www/jobx-frontend && \
ls -la /var/www/jobx-frontend/
```
