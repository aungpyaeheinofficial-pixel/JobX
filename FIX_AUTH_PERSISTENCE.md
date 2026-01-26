# Fix Authentication Persistence - User Logs Out on Refresh

## Problem
- API connection works ✅
- But user gets logged out on page refresh
- Previous user account not there

## Root Cause
The production build doesn't have the correct `VITE_API_URL`, so:
1. Token might be saved, but API calls fail
2. `checkAuth()` fails because it can't reach `/auth/me`
3. User gets logged out

## Solution

### Step 1: Check Current API URL in Browser

Open browser console (F12) and type:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

**If it shows `undefined` or `http://localhost:9999/api`**, that's the problem!

### Step 2: Rebuild Frontend with Correct API URL

**On your LOCAL machine:**

1. Create `.env.production` file in project root:

```bash
# Create .env.production
echo "VITE_API_URL=http://167.172.90.182:5560/api" > .env.production
```

Or manually create `.env.production`:
```env
VITE_API_URL=http://167.172.90.182:5560/api
```

2. Rebuild frontend:

```bash
npm run build
```

3. Upload new build to server:

```bash
# From your local machine
scp -r dist/* root@167.172.90.182:/var/www/jobx-frontend/
```

**On server, set permissions:**

```bash
sudo chown -R www-data:www-data /var/www/jobx-frontend
```

### Step 3: Verify Token is Being Saved

After login, check in browser console:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('authToken'))

// Test auth endpoint
fetch('http://167.172.90.182:5560/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
})
.then(r => r.json())
.then(d => console.log('User data:', d))
.catch(e => console.error('Error:', e))
```

### Step 4: Check Database for Users

**On server:**

```bash
# Check if users are being saved
psql -U jobx_user -d jobx_db -c "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

If no users, registration isn't working. If users exist, login should work.

## Debugging Steps

### Check 1: Is Token Saved?

```javascript
// In browser console after login
localStorage.getItem('authToken')
// Should return a JWT token string
```

### Check 2: Does checkAuth Work?

```javascript
// In browser console
fetch('http://167.172.90.182:5560/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Auth works!', d))
.catch(e => console.error('❌ Auth failed:', e))
```

### Check 3: Check Browser Console on Page Load

When you refresh, check console for:
- `🔗 API URL: ...` - Should show correct URL
- `No token found, user not authenticated` - Token not saved
- `Auth check failed: ...` - API call failed

## Common Issues

### Issue 1: API URL is localhost

**Symptom:** Console shows `API URL: http://localhost:9999/api`

**Fix:** Rebuild with `.env.production` file

### Issue 2: Token Not Saved

**Symptom:** `localStorage.getItem('authToken')` returns `null`

**Fix:** Check if login/register is actually calling the API and receiving a token

### Issue 3: CORS Error

**Symptom:** Console shows CORS error

**Fix:** Update `ALLOWED_ORIGINS` in `backend/.env`:
```
ALLOWED_ORIGINS=http://167.172.90.182:5560,http://167.172.90.182
```
Then restart: `pm2 restart jobx-backend`

### Issue 4: 401 Unauthorized

**Symptom:** `Auth check failed: Invalid token`

**Fix:** Token might be expired or invalid. Try logging in again.

## Quick Test Flow

1. **Login/Register** → Check console for success message
2. **Check token saved:** `localStorage.getItem('authToken')`
3. **Refresh page** → Check console for auth check
4. **Should stay logged in** → If not, check API URL

## Expected Behavior

✅ After login: Token saved to localStorage  
✅ On refresh: `checkAuth()` calls `/auth/me`  
✅ User data loaded: User stays logged in  
✅ Console shows: `✅ Login successful: email@example.com`

## Still Not Working?

1. Check browser console for errors
2. Check Network tab for failed `/api/auth/me` request
3. Verify API URL is correct: `console.log(import.meta.env.VITE_API_URL)`
4. Rebuild frontend with correct `.env.production`
5. Check backend logs: `pm2 logs jobx-backend`
