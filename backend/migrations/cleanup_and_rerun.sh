#!/bin/bash
# Script to clean up partial migration and rerun

echo "⚠️  WARNING: This will drop all triggers. Make sure you want to do this!"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Connect to database and drop triggers
sudo -u postgres psql -d jobx_db << EOF
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_feed_posts_updated_at ON feed_posts;
\q
EOF

echo "✅ Triggers dropped. Now run: npm run migrate"
