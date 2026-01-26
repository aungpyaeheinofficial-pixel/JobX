# Complete Backend Database Setup Guide

## Overview
This guide ensures your JobX backend database is completely set up with all tables, relationships, and proper data persistence.

## Prerequisites
- PostgreSQL installed and running
- Database user `jobx_user` created with proper permissions
- Environment variables configured in `backend/.env`

## Step 1: Verify Database Connection

```bash
cd backend
psql -U jobx_user -d jobx_db -c "SELECT version();"
```

## Step 2: Run Database Migrations

The migration script is idempotent (can be run multiple times safely):

```bash
cd backend
npm run migrate
```

This will create:
- ✅ All tables (users, companies, jobs, applications, feed_posts, etc.)
- ✅ All indexes for performance
- ✅ All triggers for `updated_at` timestamps
- ✅ Default communities
- ✅ UUID extension

## Step 3: Verify Tables Created

```bash
psql -U jobx_user -d jobx_db -c "\dt"
```

You should see these tables:
- users
- companies
- jobs
- applications
- feed_posts
- post_likes
- post_comments
- post_bookmarks
- connections
- projects
- transactions
- subscriptions
- communities
- community_members
- messages
- notifications

## Step 4: Test Database Schema

```bash
psql -U jobx_user -d jobx_db -c "
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
"
```

## Step 5: Start Backend Server

```bash
cd backend
pm2 start ecosystem.config.cjs
pm2 logs jobx-backend
```

## Step 6: Test API Endpoints

### Health Check
```bash
curl http://127.0.0.1:9999/health
```

### Register User
```bash
curl -X POST http://127.0.0.1:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "location": "Yangon",
    "industries": ["Technology"],
    "skills": ["Web Development"],
    "goal": "Build amazing products"
  }'
```

### Login
```bash
curl -X POST http://127.0.0.1:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Common Issues

### Issue: Permission Denied
**Solution:** Grant proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;
GRANT USAGE, CREATE ON SCHEMA public TO jobx_user;
ALTER SCHEMA public OWNER TO jobx_user;
```

### Issue: Trigger Already Exists
**Solution:** The migration script now handles this with `DROP TRIGGER IF EXISTS`. If you still see errors, run:
```bash
cd backend/migrations
bash cleanup_and_rerun.sh
```

### Issue: Tables Already Exist
**Solution:** The migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

## Database Schema Summary

### Core Tables
1. **users** - User accounts with authentication
2. **companies** - Employer company profiles
3. **jobs** - Job postings
4. **applications** - Job applications
5. **feed_posts** - Community feed posts
6. **post_likes** - Post likes
7. **post_comments** - Post comments
8. **post_bookmarks** - Saved posts
9. **connections** - User network connections
10. **projects** - User projects
11. **transactions** - Payment transactions
12. **subscriptions** - User subscriptions
13. **communities** - Community groups
14. **community_members** - Community membership
15. **messages** - Direct messages
16. **notifications** - User notifications

### Key Features
- ✅ UUID primary keys
- ✅ JSONB for flexible data (industries, skills)
- ✅ Automatic `updated_at` triggers
- ✅ Foreign key constraints with CASCADE
- ✅ Indexes for performance
- ✅ Soft deletes support (is_active flags)

## Next Steps

1. ✅ Database migrations complete
2. ✅ Backend API running
3. ✅ Frontend connected to API
4. ✅ Authentication working
5. ✅ Data persistence enabled

Your backend is now fully set up with secure database persistence!
