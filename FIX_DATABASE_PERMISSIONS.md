# Fix PostgreSQL Permission Error

## Problem
```
error: permission denied for schema public
```

This happens when the database user doesn't have permission to create tables in the public schema.

## Solution

### Step 1: Connect to PostgreSQL as Superuser

```bash
sudo -u postgres psql
```

### Step 2: Grant Permissions

Run these commands in the PostgreSQL shell:

```sql
-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;

-- Connect to the jobx_db database
\c jobx_db

-- Grant usage and create privileges on the public schema
GRANT USAGE ON SCHEMA public TO jobx_user;
GRANT CREATE ON SCHEMA public TO jobx_user;

-- Make jobx_user the owner of the public schema (optional but recommended)
ALTER SCHEMA public OWNER TO jobx_user;

-- Grant all privileges on all existing tables (if any)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jobx_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jobx_user;

-- Grant privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO jobx_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO jobx_user;

-- Exit PostgreSQL
\q
```

### Step 3: Run Migrations Again

```bash
cd /var/www/html/JobX/backend
npm run migrate
```

## Alternative: Make User Database Owner

If the above doesn't work, you can make the user the owner of the database:

```bash
sudo -u postgres psql
```

```sql
-- Make jobx_user the owner of the database
ALTER DATABASE jobx_db OWNER TO jobx_user;

-- Exit
\q
```

Then try migrations again:
```bash
npm run migrate
```

## Quick One-Liner Fix

If you want to do it all at once:

```bash
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;" -c "\c jobx_db" -c "GRANT USAGE ON SCHEMA public TO jobx_user;" -c "GRANT CREATE ON SCHEMA public TO jobx_user;" -c "ALTER SCHEMA public OWNER TO jobx_user;"
```

## Verify Permissions

To check if permissions are set correctly:

```bash
sudo -u postgres psql -d jobx_db -c "\du jobx_user"
```

You should see the user listed with appropriate privileges.
