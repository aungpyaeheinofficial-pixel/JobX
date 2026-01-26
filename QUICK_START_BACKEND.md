# Quick Start: Complete Backend Setup

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Database Migrations
```bash
cd backend
npm run migrate
```

Expected output:
```
✅ Database connected
🔄 Running database migrations...
✅ Migrations completed successfully!
```

### Step 2: Start Backend Server
```bash
cd backend
pm2 start ecosystem.config.cjs
pm2 logs jobx-backend
```

### Step 3: Verify Backend is Running
```bash
curl http://127.0.0.1:9999/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-26T...",
  "database": "connected"
}
```

### Step 4: Test Frontend
1. Open your frontend in browser
2. Go to signup page
3. Create an account
4. **Data should now persist in database!**

## ✅ What's Fixed

1. **Authentication** - Login/Signup now saves to database
2. **Data Persistence** - Data persists across page refreshes
3. **Token Management** - JWT tokens stored securely
4. **Database Schema** - All tables created and ready

## 🔍 Verify Database

Check if users are being created:
```bash
psql -U jobx_user -d jobx_db -c "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

## 🐛 Troubleshooting

### Migration Fails
```bash
# Grant permissions
psql -U postgres -d jobx_db -c "
GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;
GRANT USAGE, CREATE ON SCHEMA public TO jobx_user;
ALTER SCHEMA public OWNER TO jobx_user;
"

# Then retry
cd backend
npm run migrate
```

### Backend Not Starting
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs jobx-backend

# Restart if needed
pm2 restart jobx-backend
```

### Frontend Can't Connect
1. Check backend is running: `curl http://127.0.0.1:9999/health`
2. Check CORS settings in `backend/.env`:
   ```
   ALLOWED_ORIGINS=http://167.172.90.182:5560,http://localhost:5560
   ```
3. Check frontend API URL in `.env`:
   ```
   VITE_API_URL=http://167.172.90.182:5560/api
   ```

## 📝 What Changed

### Frontend
- ✅ `src/contexts/AuthContext.jsx` - New authentication context
- ✅ `App.jsx` - Now uses AuthContext for persistent auth
- ✅ `JobXAuth.jsx` - Calls API instead of local state

### Backend
- ✅ `backend/routes/auth.js` - Fixed JSONB parsing
- ✅ `backend/routes/companies.js` - Fixed company creation
- ✅ Database schema - Complete and idempotent

## 🎉 You're Done!

Your backend is now fully integrated:
- ✅ Users can register and login
- ✅ Data saves to PostgreSQL
- ✅ Data persists across refreshes
- ✅ Secure JWT authentication

Test it by:
1. Creating a new account
2. Refreshing the page
3. You should stay logged in!
