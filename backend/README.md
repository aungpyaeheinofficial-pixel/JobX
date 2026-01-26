# JobX Backend API

Secure backend API server for JobX platform.

## Features

- PostgreSQL database
- JWT authentication
- Subscription management with Stripe
- Payment processing
- Job posting and applications
- Feed/Community features
- Network/Connections
- PM2 process management

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Setup PostgreSQL Database

```bash
# Create database
createdb jobx_db

# Create user
createuser jobx_user

# Set password
psql -c "ALTER USER jobx_user WITH PASSWORD 'your_password';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE jobx_db TO jobx_user;"
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employer)
- `PUT /api/jobs/:id` - Update job (employer)
- `DELETE /api/jobs/:id` - Delete job (employer)

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `DELETE /api/applications/:id` - Withdraw application

### Feed
- `GET /api/feed` - Get feed posts
- `POST /api/feed` - Create post
- `POST /api/feed/:id/like` - Like/Unlike post
- `POST /api/feed/:id/bookmark` - Bookmark post

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/cancel` - Cancel subscription

### Payments
- `GET /api/payments/wallet` - Get wallet balance
- `GET /api/payments/transactions` - Get transactions

## Security

- Backend runs on `127.0.0.1:9999` (only accessible from server)
- Frontend communicates via reverse proxy (nginx)
- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## Deployment

See `DEPLOYMENT.md` for Digital Ocean VPS deployment instructions.
