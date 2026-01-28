# JobX Extended Backend – Tables & Endpoints

This document describes the **extended schema** and **new/updated API routes** so JobX can support job hiring, profile editing, post reactions, saved jobs, job alerts, resumes, and interviews.

## 1. Run migrations

After pulling these changes, run the extended migration on your server:

```bash
cd /var/www/html/JobX/backend   # or your backend path
npm run migrate
```

This runs both `001_initial_schema.sql` and `002_extended_schema.sql`. The second migration creates the new tables below.

## 2. New tables (002_extended_schema.sql)

| Table | Purpose |
|-------|---------|
| `user_profiles` | Extended profile: bio, title, experience, portfolio, certifications, resume_url |
| `post_shares` | Who shared which post (unique per user per post) |
| `post_views` | Who viewed which post (unique per user per post) |
| `job_views` | Who viewed which job (unique per user per job) |
| `saved_jobs` | User’s saved/bookmarked jobs |
| `job_alerts` | User’s job search alerts (keywords, location, job_types, frequency) |
| `resumes` | User’s uploaded resumes/CVs (multiple per user) |
| `cover_letters` | User’s cover letter templates |
| `interviews` | Scheduled interviews for an application |
| `job_offers` | Job offer details for an application |
| `profile_views` | Who viewed whose profile |
| `user_preferences` | Email notifications, theme, etc. |

## 3. New and updated API routes

### Profiles (edit profile – `user_profiles`)

- **GET** `/api/profiles/:userId` – Get extended profile (user + `user_profiles`).  
  Auth optional.
- **GET** `/api/profiles/me/extended` – Current user’s extended profile.  
  Auth required.
- **PUT** `/api/profiles/me` – Create/update extended profile (bio, title, education, work_experience, portfolio_items, certifications, resume_url, etc.).  
  Auth required.

### Users (unchanged + extended option)

- **GET** `/api/users/:id?extended=1` – Same as before; with `?extended=1` or `?extended=true` also returns `profile` from `user_profiles` if it exists.

### Feed (post reactions)

- **POST** `/api/feed/:id/share` – Record share, increment `shares_count`.  
  Auth required.
- **POST** `/api/feed/:id/view` – Record view in `post_views` (idempotent per user).  
  Auth optional (no-op if not logged in).

### Jobs (hiring, saved, views, alerts)

- **GET** `/api/jobs` – List jobs; when authenticated, each job includes `is_saved` (from `saved_jobs`).
- **GET** `/api/jobs/:id` – Single job; records view in `job_views` when logged in, and returns `is_saved`.
- **POST** `/api/jobs/:id/save` – Add job to saved list.  
  Auth required.
- **DELETE** `/api/jobs/:id/save` – Remove from saved list.  
  Auth required.
- **GET** `/api/jobs/saved` – Current user’s saved jobs.  
  Auth required.
- **GET** `/api/jobs/alerts` – Current user’s job alerts.  
  Auth required.
- **POST** `/api/jobs/alerts` – Create job alert (keywords, location, job_types, frequency).  
  Auth required.
- **PUT** `/api/jobs/alerts/:alertId` – Update alert.  
  Auth required.
- **DELETE** `/api/jobs/alerts/:alertId` – Delete alert.  
  Auth required.

### Resumes

- **GET** `/api/resumes` – Current user’s resumes.  
  Auth required.
- **POST** `/api/resumes` – Add resume (title, file_url, file_name, is_default).  
  Auth required.
- **PUT** `/api/resumes/:id` – Update resume.  
  Auth required.
- **DELETE** `/api/resumes/:id` – Delete resume.  
  Auth required.

### Interviews

- **GET** `/api/interviews/application/:applicationId` – List interviews for an application (applicant or company owner).  
  Auth required.
- **POST** `/api/interviews` – Create interview (application_id, scheduled_at, interview_type, duration_minutes, location, meeting_link, notes).  
  Auth + employer required.
- **PATCH** `/api/interviews/:id` – Update interview.  
  Auth + employer required.

## 4. Frontend usage notes

- **Edit profile:** Use `PUT /api/profiles/me` with `user_profiles` fields; use `PUT /api/users/profile` for base user fields (name, location, industries, skills, goal, avatar_url).
- **Feed:** Use `/api/feed/:id/like`, `/api/feed/:id/bookmark`, `/api/feed/:id/comments` and `/api/feed/:id/share`, `/api/feed/:id/view` so likes, bookmarks, comments, shares, and views are stored in the DB.
- **Jobs:** Use `/api/jobs/saved`, `/api/jobs/:id/save`, `/api/jobs/alerts` so saved jobs and alerts are stored and used in list/single job responses.
- **Applications:** Resumes and interviews are backed by `resumes` and `interviews`; wire application flows to `/api/resumes` and `/api/interviews` as needed.

After deploying, run `npm run migrate` and restart the backend (e.g. `pm2 restart jobx-backend`).
