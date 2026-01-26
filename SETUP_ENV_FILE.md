# Setup Environment File for Frontend

## Quick Setup

### Step 1: Create `.env` File

In the **root directory** of your project, create a file named `.env`:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

### Step 2: Add API URL

Open `.env` and add:

```env
VITE_API_URL=http://167.172.90.182:5560/api
```

**⚠️ Important:** Replace `167.172.90.182` with your actual Digital Ocean droplet IP address.

### Step 3: Restart Development Server

**You MUST restart the dev server** for Vite to pick up the new environment variable:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Verify

Open browser console (F12) and check:

```javascript
// Should show your API URL
console.log(import.meta.env.VITE_API_URL);

// Test connection
testConnection();
```

## For Production Build

When building for production, create `.env.production`:

```bash
# .env.production
VITE_API_URL=http://167.172.90.182:5560/api
```

Then build:
```bash
npm run build
```

## Troubleshooting

### Environment variable not loading?

1. ✅ Check file is named exactly `.env` (not `.env.txt`)
2. ✅ Check file is in root directory (same level as `package.json`)
3. ✅ Check variable name starts with `VITE_`
4. ✅ **Restart dev server** after creating/modifying `.env`
5. ✅ Check `.env` is not in `.gitignore` (it should be, but check it exists)

### Still not working?

1. Check browser console for API URL:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

2. Test connection manually:
   ```javascript
   fetch('http://167.172.90.182:5560/api/health')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error);
   ```

3. Check backend is running:
   ```bash
   # On server
   pm2 status
   curl http://127.0.0.1:9999/health
   ```

## Example `.env` File

```env
# Frontend Environment Variables
# Update YOUR_DROPLET_IP with your actual Digital Ocean droplet IP

VITE_API_URL=http://167.172.90.182:5560/api
```

## Notes

- `.env` file is in `.gitignore` (not committed to git)
- `.env.example` is provided as a template
- Environment variables must start with `VITE_` to be exposed to frontend
- Changes to `.env` require dev server restart
