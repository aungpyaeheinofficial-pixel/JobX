# Complete Digital Ocean Deployment Guide - Frontend & Backend

## Prerequisites

- Digital Ocean account
- SSH access to your computer
- Basic knowledge of Linux commands
- **Note**: This guide uses IP address (no domain required)

---

## Step 1: Create Digital Ocean Droplet

### 1.1 Create New Droplet

1. Log in to [Digital Ocean](https://cloud.digitalocean.com)
2. Click **"Create"** → **"Droplets"**
3. Choose configuration:
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Plan**: Basic Plan
   - **CPU**: Regular (2 vCPU, 4GB RAM minimum recommended)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or Password
4. Click **"Create Droplet"**
5. Wait for droplet to be created (1-2 minutes)
6. Note your **Droplet IP address**

### 1.2 Connect to Your Droplet

```bash
# Replace YOUR_IP with your droplet IP
ssh root@YOUR_IP
```

---

## Step 2: Initial Server Setup

### 2.1 Update System

```bash
apt update && apt upgrade -y
```

### 2.2 Create Non-Root User (Recommended)

```bash
# Create new user
adduser jobx
usermod -aG sudo jobx

# Switch to new user
su - jobx
```

### 2.3 Install Essential Tools

```bash
sudo apt install -y curl wget git build-essential
```

---

## Step 3: Install Node.js

### 3.1 Install Node.js 20.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

---

## Step 4: Install PostgreSQL

### 4.1 Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4.2 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE jobx_db;
CREATE USER jobx_user WITH PASSWORD 'YOUR_SECURE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;
\q
```

**⚠️ Important**: Replace `YOUR_SECURE_PASSWORD_HERE` with a strong password (save it for later!)

### 4.3 Configure PostgreSQL

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Find this line:
# local   all             all                                     peer

# Change to:
# local   all             all                                     md5

# Save and exit (Ctrl+X, then Y, then Enter)

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## Step 5: Install PM2

```bash
sudo npm install -g pm2
```

---

## Step 6: Install Nginx

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Step 7: Deploy Backend

### 7.1 Create Backend Directory

```bash
# Create directory
sudo mkdir -p /var/www/jobx-backend
sudo chown -R $USER:$USER /var/www/jobx-backend
cd /var/www/jobx-backend
```

### 7.2 Clone or Upload Your Code

**Option A: Using Git (if your repo is on GitHub/GitLab)**

```bash
# Clone your repository
git clone https://github.com/yourusername/JobX.git .

# Navigate to backend folder
cd backend
```

**Option B: Using SCP (from your local machine)**

```bash
# On your LOCAL machine, run:
scp -r backend/* root@YOUR_IP:/var/www/jobx-backend/
```

### 7.3 Install Backend Dependencies

```bash
cd /var/www/jobx-backend
npm install --production
```

### 7.4 Create Environment File

```bash
nano .env
```

Add the following (replace with your actual values):

```env
NODE_ENV=production
FRONTEND_PORT=5560
BACKEND_PORT=9999
FRONTEND_URL=http://YOUR_DROPLET_IP:5560
BACKEND_URL=http://127.0.0.1:9999

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobx_db
DB_USER=jobx_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MIN_32_CHARACTERS_LONG
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

ALLOWED_ORIGINS=http://YOUR_DROPLET_IP:5560

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

**Save and exit**: `Ctrl+X`, then `Y`, then `Enter`

### 7.5 Run Database Migrations

```bash
npm run migrate
```

### 7.6 Create Logs Directory

```bash
mkdir -p logs uploads
```

### 7.7 Start Backend with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Follow the command that PM2 outputs (usually something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u jobx --hp /home/jobx
```

### 7.8 Verify Backend is Running

```bash
pm2 status
pm2 logs jobx-backend

# Test backend health
curl http://127.0.0.1:9999/health
```

---

## Step 8: Deploy Frontend

### 8.1 Build Frontend Locally (On Your Computer)

```bash
# On your LOCAL machine, in the JobX project root:
npm install
npm run build

# This creates a 'dist' folder with production files
```

### 8.2 Upload Frontend Build to Server

**Option A: Using SCP**

```bash
# On your LOCAL machine:
scp -r dist/* root@YOUR_IP:/var/www/jobx-frontend/
```

**Option B: Using Git and Build on Server**

```bash
# On server:
sudo mkdir -p /var/www/jobx-frontend
sudo chown -R $USER:$USER /var/www/jobx-frontend
cd /var/www/jobx-frontend

# Clone repo
git clone https://github.com/yourusername/JobX.git temp
cd temp

# Install dependencies
npm install

# Build
npm run build

# Move build files
mv dist/* /var/www/jobx-frontend/
cd ..
rm -rf temp
```

### 8.3 Create Frontend Environment File

**On your LOCAL machine before building:**

```bash
# Create .env.production file in project root
echo "VITE_API_URL=http://YOUR_DROPLET_IP:5560/api" > .env.production
```

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

**Note**: You must rebuild the frontend with this environment variable.

---

## Step 9: Configure Nginx

### 9.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/jobx
```

Add the following configuration:

```nginx
# Combined Frontend and Backend Server (Port 5560)
# Note: Port 80 is used by another application
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

    # Main location block - handle all frontend routes
    location / {
        try_files $uri $uri/ /index.html;
        # Prevent redirect loops
        if (-f $request_filename) {
            break;
        }
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

**Note**: 
- Frontend is served on port 5560 (HTTP)
- Backend API is accessible at `http://YOUR_DROPLET_IP:5560/api`
- Port 80 is used by another application
- No domain required - works with IP address only!

### 9.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/jobx /etc/nginx/sites-enabled/

# Remove default site (optional - only if you want)
# sudo rm /etc/nginx/sites-enabled/default
# Note: Keep default if port 80 is used by another app

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
```

---

## Step 10: Configure Firewall

```bash
# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow JobX Frontend (Port 5560)
sudo ufw allow 5560/tcp

# Allow HTTPS (if you get a domain later)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

**⚠️ Important**: 
- Backend port 9999 is NOT exposed - it's only accessible via Nginx reverse proxy on localhost
- Port 80 is used by another application, so JobX uses port 5560

---

## Step 11: SSL/HTTPS (Optional - Requires Domain)

**⚠️ Note**: SSL certificates require a domain name. If you don't have a domain, you can skip this step and use HTTP. For production, it's highly recommended to get a domain and SSL certificate.

### 11.1 If You Have a Domain (Optional)

If you get a domain later, you can set up SSL:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Point domain DNS to your droplet IP
# Then get certificate:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

**For now, we'll continue without SSL using HTTP.**

---

## Step 12: Update Frontend Build with Correct API URL

### 12.1 Rebuild Frontend with Production API URL

**On your LOCAL machine:**

```bash
# Create .env.production file (replace YOUR_DROPLET_IP with your actual IP)
echo "VITE_API_URL=http://YOUR_DROPLET_IP:5560/api" > .env.production

# Rebuild
npm run build

# Upload new build
scp -r dist/* root@YOUR_DROPLET_IP:/var/www/jobx-frontend/
```

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

---

## Step 13: Final Configuration

### 13.1 Update Backend .env with Production URLs

```bash
cd /var/www/jobx-backend
nano .env
```

Update (replace YOUR_DROPLET_IP with your actual IP):
```env
FRONTEND_URL=http://YOUR_DROPLET_IP:5560
ALLOWED_ORIGINS=http://YOUR_DROPLET_IP:5560
```

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

### 13.2 Restart Backend

```bash
pm2 restart jobx-backend
```

### 13.3 Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## Step 14: Verify Everything Works

### 14.1 Test Frontend

Open in browser: `http://YOUR_DROPLET_IP:5560`

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

### 14.2 Test Backend API

```bash
# Health check via API path (from external)
curl http://YOUR_DROPLET_IP:5560/api/health

# Or directly (from server only)
curl http://127.0.0.1:9999/health

# Should return: {"status":"healthy",...}
```

### 14.3 Test from Browser

Open: `http://YOUR_DROPLET_IP:5560/api/health`

**⚠️ Replace `YOUR_DROPLET_IP` with your actual droplet IP address**

---

## Step 15: Setup Monitoring & Maintenance

### 15.1 PM2 Monitoring

```bash
# View logs
pm2 logs jobx-backend

# Monitor in real-time
pm2 monit

# View status
pm2 status
```

### 15.2 Setup Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-jobx-db.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/jobx"
mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump jobx_db > $BACKUP_DIR/jobx_db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: jobx_db_$DATE.sql"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-jobx-db.sh
```

Setup cron job (daily at 2 AM):
```bash
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-jobx-db.sh
```

### 15.3 Setup Log Rotation

PM2 handles log rotation automatically, but you can configure it:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs jobx-backend

# Check if port is in use
sudo netstat -tulpn | grep 9999

# Check database connection
cd /var/www/jobx-backend
node -e "require('./config/database.js').pool.query('SELECT 1').then(() => console.log('DB OK')).catch(console.error)"
```

### Frontend Not Loading

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx configuration
sudo nginx -t

# Check file permissions
sudo ls -la /var/www/jobx-frontend
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
sudo -u postgres psql -d jobx_db -U jobx_user

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### SSL Certificate Issues (Only if using domain)

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
```

**Note**: If you're not using a domain, SSL is not available. Use HTTP instead.

---

## Quick Reference Commands

```bash
# Backend
pm2 status                    # Check backend status
pm2 logs jobx-backend        # View backend logs
pm2 restart jobx-backend     # Restart backend
pm2 stop jobx-backend        # Stop backend

# Nginx
sudo nginx -t                 # Test Nginx config
sudo systemctl restart nginx  # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # View error logs

# Database
sudo -u postgres psql -d jobx_db  # Connect to database
sudo systemctl status postgresql  # Check PostgreSQL status

# Firewall
sudo ufw status              # Check firewall status
sudo ufw allow 80/tcp        # Allow HTTP
sudo ufw allow 443/tcp       # Allow HTTPS
```

---

## Security Checklist

- [ ] Strong database password set
- [ ] JWT secret is at least 32 characters
- [ ] Backend only accessible on 127.0.0.1
- [ ] Firewall configured (only 22, 80 open - 443 only if using SSL)
- [ ] SSL/HTTPS enabled (optional - requires domain)
- [ ] Non-root user created
- [ ] SSH keys configured (not password)
- [ ] Environment variables secured (.env not in git)
- [ ] PM2 auto-restart enabled
- [ ] Database backups configured
- [ ] Log rotation configured
- [ ] CORS configured correctly with your IP address

---

## Cost Estimation

**Digital Ocean Droplet:**
- Basic Plan (2 vCPU, 4GB RAM): ~$24/month
- Standard Plan (4 vCPU, 8GB RAM): ~$48/month (recommended for production)

**Domain Name (Optional):**
- ~$10-15/year (only if you want a custom domain)

**Total: ~$24-48/month (without domain)**

---

## Next Steps

1. ✅ Set up monitoring (PM2 Plus or custom)
2. ✅ Configure error tracking (Sentry)
3. ✅ Set up CDN for static assets
4. ✅ Configure email service (for notifications)
5. ✅ Set up staging environment
6. ✅ Configure CI/CD pipeline

---

## Support

If you encounter issues:

1. Check logs: `pm2 logs` and `sudo tail -f /var/log/nginx/error.log`
2. Verify all services are running: `pm2 status` and `sudo systemctl status nginx postgresql`
3. Test database connection
4. Verify IP is accessible: `curl http://YOUR_DROPLET_IP:5560`
5. Check firewall: `sudo ufw status`

Your JobX platform is now live on Digital Ocean! 🚀
