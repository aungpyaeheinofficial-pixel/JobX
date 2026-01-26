# JobX Backend Deployment Guide - Digital Ocean VPS

## Prerequisites

- Digital Ocean Droplet (Ubuntu 22.04 LTS recommended)
- Domain name (optional but recommended)
- SSH access to server

## Step 1: Server Setup

### Connect to your server
```bash
ssh root@your_server_ip
```

### Update system
```bash
apt update && apt upgrade -y
```

### Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Install PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### Install PM2
```bash
npm install -g pm2
```

### Install Nginx (for reverse proxy)
```bash
apt install -y nginx
```

## Step 2: Database Setup

### Create database and user
```bash
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE jobx_db;
CREATE USER jobx_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;
\q
```

### Configure PostgreSQL
```bash
# Edit pg_hba.conf
nano /etc/postgresql/14/main/pg_hba.conf

# Change line:
# local   all             all                                     peer
# to:
# local   all             all                                     md5

# Restart PostgreSQL
systemctl restart postgresql
```

## Step 3: Deploy Backend

### Create app directory
```bash
mkdir -p /var/www/jobx-backend
cd /var/www/jobx-backend
```

### Clone or upload your code
```bash
# If using git:
git clone your-repo-url .

# Or upload files via SCP/SFTP
```

### Install dependencies
```bash
npm install --production
```

### Create .env file
```bash
nano .env
```

Add your configuration:
```env
NODE_ENV=production
FRONTEND_PORT=5560
BACKEND_PORT=9999
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=http://127.0.0.1:9999

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobx_db
DB_USER=jobx_user
DB_PASSWORD=your_secure_password

JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

ALLOWED_ORIGINS=https://yourdomain.com
```

### Run migrations
```bash
npm run migrate
```

### Create logs directory
```bash
mkdir -p logs uploads
```

## Step 4: Configure PM2

### Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs           # View logs
pm2 restart all    # Restart all
pm2 stop all       # Stop all
pm2 delete all     # Delete all
```

## Step 5: Configure Nginx Reverse Proxy

### Create Nginx config
```bash
nano /etc/nginx/sites-available/jobx
```

Add configuration:
```nginx
# Frontend (Port 5560)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5560;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API (Port 9999) - Only accessible via reverse proxy
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:9999;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable site
```bash
ln -s /etc/nginx/sites-available/jobx /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 6: SSL with Let's Encrypt

### Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Get SSL certificate
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Auto-renewal
```bash
certbot renew --dry-run
```

## Step 7: Firewall Configuration

### Configure UFW
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

**Important:** Backend port 9999 is NOT exposed externally. Only accessible via Nginx reverse proxy.

## Step 8: Monitoring

### PM2 Monitoring
```bash
pm2 monit
```

### Check logs
```bash
pm2 logs jobx-backend
tail -f /var/www/jobx-backend/logs/pm2-out.log
```

### Database monitoring
```bash
sudo -u postgres psql -d jobx_db -c "SELECT COUNT(*) FROM users;"
```

## Step 9: Update Frontend Configuration

In your frontend `.env` or config, set:
```env
VITE_API_URL=https://api.yourdomain.com
```

## Security Checklist

- [ ] Strong database password
- [ ] Strong JWT secret (min 32 characters)
- [ ] Backend only accessible on 127.0.0.1
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured
- [ ] Regular backups configured
- [ ] PM2 auto-restart enabled
- [ ] Environment variables secured

## Backup

### Database backup script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U jobx_user jobx_db > /var/backups/jobx_db_$DATE.sql
```

### Setup cron for daily backups
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Check PM2 status
```bash
pm2 status
pm2 logs
```

### Check Nginx
```bash
systemctl status nginx
nginx -t
tail -f /var/log/nginx/error.log
```

### Check PostgreSQL
```bash
systemctl status postgresql
sudo -u postgres psql -d jobx_db
```

### Check backend logs
```bash
tail -f /var/www/jobx-backend/logs/pm2-error.log
```
