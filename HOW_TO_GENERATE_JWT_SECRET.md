# How to Generate JWT Secret Key

## Quick Method (Recommended)

### Option 1: Using Node.js (Easiest)

**On your local machine or server:**

```bash
# Generate a random 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Copy this output and use it as your JWT_SECRET**

### Option 2: Using OpenSSL

```bash
# Generate a random 64-character secret
openssl rand -hex 32
```

### Option 3: Using Online Generator (Less Secure)

Visit: https://generate-secret.vercel.app/64

**⚠️ Warning**: Only use online generators if you trust the service. It's better to generate locally.

---

## Step-by-Step Instructions

### 1. Generate the Secret

**On Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**On Mac/Linux:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Or if Node.js is not installed:**
```bash
openssl rand -hex 32
```

### 2. Copy the Generated Secret

The output will be a 64-character hexadecimal string like:
```
f8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7
```

### 3. Add to Your .env File

**On your server:**

```bash
cd /var/www/jobx-backend
nano .env
```

Add or update this line:
```env
JWT_SECRET=f8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7
```

**Replace the value with your generated secret**

### 4. Save and Restart

```bash
# Save the file (Ctrl+X, then Y, then Enter)
# Restart backend
pm2 restart jobx-backend
```

---

## Security Best Practices

1. **Length**: Use at least 32 bytes (64 hex characters) - the code above generates 32 bytes
2. **Randomness**: Use cryptographically secure random generators (Node.js crypto or OpenSSL)
3. **Secrecy**: Never commit JWT_SECRET to Git
4. **Uniqueness**: Generate a different secret for each environment (dev, staging, production)
5. **Storage**: Keep it in `.env` file, never in code

---

## Example .env File

```env
NODE_ENV=production
FRONTEND_PORT=5560
BACKEND_PORT=9999
FRONTEND_URL=http://YOUR_DROPLET_IP
BACKEND_URL=http://127.0.0.1:9999

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobx_db
DB_USER=jobx_user
DB_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET=your_generated_64_character_hex_string_here
JWT_EXPIRES_IN=7d

# Stripe (optional - can be added later)
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

ALLOWED_ORIGINS=http://YOUR_DROPLET_IP,http://YOUR_DROPLET_IP:5560

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Quick Command Reference

```bash
# Generate JWT Secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT Secret (OpenSSL)
openssl rand -hex 32

# Generate JWT Secret (Python - if installed)
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## Troubleshooting

**If you get "Error: Cannot find module 'crypto'"**
- Make sure Node.js is installed: `node --version`
- If not installed, use OpenSSL method instead

**If OpenSSL is not available**
- Install it: `sudo apt install openssl` (Linux) or use Node.js method

**For Windows without Node.js or OpenSSL**
- Install Node.js from https://nodejs.org/
- Or use an online generator (less secure)

---

## Important Notes

- ✅ **DO**: Generate a unique secret for production
- ✅ **DO**: Keep it secret and secure
- ✅ **DO**: Use at least 32 bytes (64 hex characters)
- ❌ **DON'T**: Use simple words or predictable patterns
- ❌ **DON'T**: Commit it to Git
- ❌ **DON'T**: Share it publicly
- ❌ **DON'T**: Reuse the same secret across different projects

---

**That's it!** Your JWT_SECRET is now ready to use. Just copy the generated string into your `.env` file.
