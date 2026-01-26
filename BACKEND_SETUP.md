# JobX Backend System - Complete Setup Guide

## Overview

This document provides a complete guide for setting up the secure backend system for JobX with:
- PostgreSQL database
- PM2 process management
- Digital Ocean VPS deployment
- Subscription system
- No local storage (all data in database)

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   Port: 5560    │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│     Nginx       │
│  Reverse Proxy  │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│   Backend    │  │  PostgreSQL  │
│ Port: 9999   │  │   Database   │
│ (127.0.0.1)  │  │              │
└──────────────┘  └──────────────┘
```

**Security Note:** Backend port 9999 is only accessible from localhost (127.0.0.1), not exposed externally. All external access goes through Nginx reverse proxy.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm start
```

### 2. Frontend Setup

```bash
# In project root
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:9999/api
npm run dev
```

## Database Schema

The database includes tables for:
- Users (with subscription info)
- Companies (employer profiles)
- Jobs (job postings with tiers)
- Applications (job applications)
- Feed Posts (community feed)
- Subscriptions (Stripe integration)
- Transactions (payments/wallet)
- Connections (network)
- Projects
- Messages
- Notifications

See `backend/migrations/001_initial_schema.sql` for full schema.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - List jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `DELETE /api/applications/:id` - Withdraw application

### Feed
- `GET /api/feed` - Get feed posts
- `POST /api/feed` - Create post
- `POST /api/feed/:id/like` - Like/Unlike
- `POST /api/feed/:id/bookmark` - Bookmark

### Subscriptions
- `GET /api/subscriptions/plans` - Get plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/checkout` - Create Stripe checkout
- `POST /api/subscriptions/cancel` - Cancel subscription

### Payments
- `GET /api/payments/wallet` - Get wallet balance
- `GET /api/payments/transactions` - Get transactions

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with salt rounds
3. **Rate Limiting** - Prevents abuse
4. **CORS Protection** - Only allows frontend origin
5. **Helmet** - Security headers
6. **Input Validation** - express-validator
7. **SQL Injection Protection** - Parameterized queries
8. **Backend Isolation** - Only accessible from server

## Subscription System

### Plans
- **Free**: 5 applications/month, basic features
- **Pro**: $9.99/month or $99/year - Unlimited applications, premium features
- **Business**: $49.99/month or $499/year - Everything + employer tools

### Stripe Integration
- Checkout sessions for subscriptions
- Webhook handling for payment events
- Automatic subscription management

## PM2 Configuration

The backend runs with PM2 for:
- Process management
- Auto-restart on crashes
- Load balancing (2 instances)
- Log management
- Memory limits

### PM2 Commands
```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs
pm2 restart all
pm2 stop all
```

## Deployment Checklist

### Server Setup
- [ ] Ubuntu 22.04 LTS
- [ ] Node.js 20.x installed
- [ ] PostgreSQL installed and configured
- [ ] PM2 installed globally
- [ ] Nginx installed

### Database
- [ ] Database created
- [ ] User created with password
- [ ] Migrations run
- [ ] Backup script configured

### Backend
- [ ] Code deployed to `/var/www/jobx-backend`
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] PM2 started
- [ ] Logs directory created

### Nginx
- [ ] Reverse proxy configured
- [ ] SSL certificate (Let's Encrypt)
- [ ] Backend accessible only via proxy

### Security
- [ ] Firewall configured (UFW)
- [ ] Strong passwords set
- [ ] JWT secret changed
- [ ] Backend not exposed externally

## Frontend Integration

Replace all local storage usage with API calls:

```javascript
// Before (local storage)
localStorage.setItem('user', JSON.stringify(userData));

// After (API)
import api from './services/api';
const response = await api.auth.login(email, password);
```

See `src/services/api.js` for all API methods.

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
BACKEND_PORT=9999
FRONTEND_URL=https://yourdomain.com
DB_HOST=localhost
DB_NAME=jobx_db
DB_USER=jobx_user
DB_PASSWORD=secure_password
JWT_SECRET=your_32_char_secret
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Monitoring

### Health Check
```bash
curl http://127.0.0.1:9999/health
```

### PM2 Monitoring
```bash
pm2 monit
```

### Database Monitoring
```bash
sudo -u postgres psql -d jobx_db
```

## Troubleshooting

### Backend not starting
- Check PM2 logs: `pm2 logs jobx-backend`
- Verify database connection
- Check .env file configuration

### Database connection errors
- Verify PostgreSQL is running: `systemctl status postgresql`
- Check credentials in .env
- Verify user has permissions

### API errors
- Check CORS configuration
- Verify JWT token is valid
- Check rate limiting

## Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Check database: `psql -d jobx_db`
3. Verify environment variables
4. Check Nginx configuration

## Next Steps

1. Set up monitoring (PM2 Plus or custom)
2. Configure automated backups
3. Set up error tracking (Sentry)
4. Configure CDN for static assets
5. Set up staging environment
