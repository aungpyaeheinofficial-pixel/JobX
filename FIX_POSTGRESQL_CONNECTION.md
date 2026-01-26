# Fix PostgreSQL Connection - Peer Authentication Failed

## Problem
```bash
psql -U jobx_user -d jobx_db
# Error: Peer authentication failed for user "jobx_user"
```

## Solution

### Option 1: Use TCP Connection (Recommended)

```bash
psql -h localhost -U jobx_user -d jobx_db
```

When prompted, enter the password you set for `jobx_user`.

### Option 2: Connect as postgres User First

```bash
# Connect as postgres superuser
sudo -u postgres psql

# Then switch to jobx_db
\c jobx_db

# Now you can query
SELECT email, name FROM users;
```

### Option 3: Fix PostgreSQL Authentication

Edit PostgreSQL config:

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Find this line:
```
local   all             all                                     peer
```

Change to:
```
local   all             all                                     md5
```

Also check for:
```
host    all             all             127.0.0.1/32            peer
```

Change to:
```
host    all             all             127.0.0.1/32            md5
```

Then restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Quick Check Users

**Easiest method:**

```bash
# Connect as postgres user
sudo -u postgres psql -d jobx_db -c "SELECT email, name, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

Or with password:

```bash
# Use TCP connection (will prompt for password)
psql -h localhost -U jobx_user -d jobx_db -c "SELECT email, name FROM users;"
```

## Test Database Connection

```bash
# Test connection
psql -h localhost -U jobx_user -d jobx_db -c "SELECT COUNT(*) FROM users;"
```

If this works, your database is fine and users should be there!
