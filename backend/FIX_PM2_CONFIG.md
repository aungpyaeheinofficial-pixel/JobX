# Fix PM2 Config Error

## Problem
```
ReferenceError: module is not defined in ES module scope
```

This happens because `package.json` has `"type": "module"` but `ecosystem.config.js` uses CommonJS syntax.

## Solution: Rename to .cjs

**On your server, run:**

```bash
cd /var/www/html/JobX/backend
mv ecosystem.config.js ecosystem.config.cjs
```

**Then update PM2 command:**

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## Alternative: Use ES Module Syntax

If you prefer to keep `.js` extension, you can convert to ES module syntax, but PM2 works better with CommonJS config files, so the `.cjs` approach is recommended.
