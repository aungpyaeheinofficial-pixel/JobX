# Port 5560 Verification ✅

## Current Configuration

All files are correctly configured to use **port 5560**:

### ✅ Frontend Configuration
- `vite.config.js` → `port: 5560` ✓
- All documentation → Port 5560 ✓
- Nginx config → `listen 5560;` ✓

### ✅ Backend Configuration  
- Backend runs on port 9999 (internal only) ✓
- Nginx proxies `/api` from port 5560 to 9999 ✓

## Verification Checklist

### On Your Server

1. **Check Nginx Configuration:**
   ```bash
   sudo cat /etc/nginx/sites-available/jobx | grep "listen"
   # Should show: listen 5560;
   ```

2. **Check Nginx is Listening on 5560:**
   ```bash
   sudo netstat -tulpn | grep 5560
   # Should show nginx listening on 5560
   ```

3. **Check Firewall:**
   ```bash
   sudo ufw status | grep 5560
   # Should show: 5560/tcp ALLOW
   ```

4. **Restart Nginx if Needed:**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### On Your Local Machine

1. **Check Vite Config:**
   ```bash
   cat vite.config.js | grep port
   # Should show: port: 5560,
   ```

2. **Check Dev Server:**
   ```bash
   npm run dev
   # Should start on: http://localhost:5560
   ```

## If You See Port 5561 Anywhere

If you're seeing port 5561, check:

1. **Browser cache** - Clear cache and hard refresh (Ctrl+Shift+R)
2. **Running processes** - Check what's actually running:
   ```bash
   # On server
   sudo lsof -i :5561
   sudo lsof -i :5560
   ```
3. **Environment variables** - Check for any port overrides:
   ```bash
   # On server
   env | grep PORT
   ```

## Force Port 5560

If something is using 5561, ensure everything uses 5560:

### On Server (Nginx)
```bash
sudo nano /etc/nginx/sites-available/jobx
# Verify: listen 5560;
sudo nginx -t
sudo systemctl restart nginx
```

### On Local (Vite)
```bash
# vite.config.js should have:
server: {
  port: 5560,
  host: true
}
```

## Summary

✅ **All code is configured for port 5560**  
✅ **No references to port 5561 found**  
✅ **Configuration is correct**

If you're still seeing 5561, it might be:
- A cached value in your browser
- A running process that needs restart
- An environment variable override

Check the verification steps above to identify where 5561 is coming from.
