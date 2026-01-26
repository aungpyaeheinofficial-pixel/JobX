# Fix Migration Error: Trigger Already Exists

## Problem
```
error: trigger "update_users_updated_at" for relation "users" already exists
```

This happens when migrations were partially run before.

## Solution 1: Quick Fix (Recommended)

**On your server, run:**

```bash
cd /var/www/html/JobX/backend

# Drop existing triggers
sudo -u postgres psql -d jobx_db << EOF
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_feed_posts_updated_at ON feed_posts;
\q
EOF

# Run migrations again
npm run migrate
```

## Solution 2: Use Cleanup Script

```bash
cd /var/www/html/JobX/backend
chmod +x migrations/cleanup_and_rerun.sh
./migrations/cleanup_and_rerun.sh
npm run migrate
```

## Solution 3: Manual Drop (if needed)

```bash
sudo -u postgres psql -d jobx_db
```

Then in PostgreSQL shell:
```sql
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_feed_posts_updated_at ON feed_posts;
\q
```

Then run migrations:
```bash
npm run migrate
```

## What Was Fixed

The migration SQL has been updated to include `DROP TRIGGER IF EXISTS` before creating triggers, so future migrations will work even if run multiple times.

After pulling the latest code, you can run migrations without this error.
