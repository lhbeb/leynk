# 🎯 Leynk Developer Command Reference

**Quick access to common development tasks and commands**

---

## 🚀 Getting Started Commands

### Initial Setup
```bash
# Clone or navigate to project
cd /Users/elma777boubi/Downloads/leynk-main

# Install all dependencies
npm install

# Start development server
npm run dev
# Access at: http://localhost:3000
```

### Build Commands
```bash
# Build for production
npm run build

# Start production server locally
npm start
# Access at: http://localhost:3000

# Run linter
npm run lint
```

---

## 🗄️ Database Setup Commands

### Supabase SQL Editor
```sql
-- Step 1: Create main tables (users, links)
-- Copy and run: setup.sql

-- Step 2: Create analytics tables (page_views)
-- Copy and run: analytics_setup.sql

-- Step 3: Add listed_by column
-- Copy and run: add_listed_by_migration.sql

-- Step 4: Add theme column
-- Copy and run: add_theme_migration.sql

-- Step 5: Add soft delete support
-- Copy and run: soft_delete_migration.sql
```

### Storage Bucket Setup
```bash
# Via Supabase Dashboard:
# 1. Go to Storage → New Bucket
# 2. Name: "profile-pictures"
# 3. Public: ON
# 4. Create bucket
```

### Verify Database
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected output:
-- users
-- links
-- page_views

-- Check users table structure
\d users

-- Check links table structure
\d links

-- Check page_views table structure
\d page_views
```

---

## 🧪 Testing & Debugging Commands

### Test API Endpoints
```bash
# Test Telegram bot
curl http://localhost:3000/api/telegram/test

# Test user creation
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "profilePicture": "https://example.com/pic.jpg",
    "bio": "Test bio",
    "links": [
      {
        "id": "1",
        "title": "Website",
        "url": "https://example.com",
        "order": 0
      }
    ]
  }'

# Test analytics tracking
curl -X POST http://localhost:3000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'

# Get all users
curl http://localhost:3000/api/users

# Get single user
curl http://localhost:3000/api/users/testuser

# Get analytics stats
curl http://localhost:3000/api/analytics/stats

# Get user-specific analytics
curl http://localhost:3000/api/analytics/testuser

# Delete user
curl -X DELETE "http://localhost:3000/api/users?username=testuser"
```

### Database Queries (Supabase SQL Editor)
```sql
-- Get all users
SELECT * FROM users ORDER BY created_at DESC;

-- Get all links for a user
SELECT * FROM links 
WHERE user_id = (SELECT id FROM users WHERE username = 'john_doe')
ORDER BY order_index;

-- Get page view count by user
SELECT username, COUNT(*) as views
FROM page_views
GROUP BY username
ORDER BY views DESC;

-- Get recent page views
SELECT * FROM page_views 
ORDER BY viewed_at DESC 
LIMIT 10;

-- Get page views by country
SELECT country, COUNT(*) as count
FROM page_views
GROUP BY country
ORDER BY count DESC;

-- Get deleted users
SELECT * FROM users 
WHERE deleted_at IS NOT NULL;

-- Get users by admin
SELECT * FROM users 
WHERE listed_by = 'Mehdi'
ORDER BY created_at DESC;
```

---

## 📂 File Operations

### Navigate Key Directories
```bash
# Main source directory
cd src

# Components directory
cd src/components

# API routes directory
cd src/app/api

# Admin pages directory
cd src/app/admin

# Library utilities
cd src/lib
```

### View Important Files
```bash
# View package.json
cat package.json

# View database schema
cat setup.sql

# View Supabase configuration
cat src/lib/supabase.ts

# View auth configuration
cat src/lib/auth.ts

# View types
cat src/types/index.ts

# View README
cat README.md
```

---

## 🔧 Development Utilities

### Clear Next.js Cache
```bash
# Remove .next build directory
rm -rf .next

# Remove node_modules
rm -rf node_modules

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### View Logs
```bash
# Development server logs (in terminal)
npm run dev

# Check browser console:
# 1. Open browser (http://localhost:3000)
# 2. Press F12 (DevTools)
# 3. Go to Console tab
# 4. Look for DevTools health check logs
```

### Git Commands
```bash
# Check status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push

# Pull latest changes
git pull

# View commit history
git log --oneline -10
```

---

## 🚀 Deployment Commands

### Vercel Deployment

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

#### Via Git (Automatic)
```bash
# Connect your repo to Vercel Dashboard first
# Then simply push to main branch:
git push origin main

# Vercel will auto-deploy
```

### Environment Variables (Production)
```bash
# Set environment variables in Vercel Dashboard:
# Project Settings → Environment Variables

# Example variables:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD_HASH=your-hashed-password
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

---

## 🎨 Development Workflow

### Create New Feature
```bash
# 1. Create new branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev

# 4. Build to verify
npm run build

# 5. Commit changes
git add .
git commit -m "Add new feature"

# 6. Push to remote
git push origin feature/new-feature

# 7. Create pull request (via GitHub/GitLab)
```

### Debug Issues
```bash
# 1. Check development server terminal
npm run dev
# Look for errors in terminal output

# 2. Check browser console
# F12 → Console tab

# 3. Check Network tab
# F12 → Network tab → Filter by Fetch/XHR

# 4. Check Supabase logs
# Supabase Dashboard → Logs

# 5. Test API endpoints directly
curl http://localhost:3000/api/...
```

---

## 📊 Database Maintenance

### Backup Database
```bash
# Via Supabase Dashboard:
# Database → Backups → Download

# Or via pg_dump (if you have direct access):
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

### Clear Old Analytics Data
```sql
-- Delete page views older than 90 days
DELETE FROM page_views 
WHERE viewed_at < NOW() - INTERVAL '90 days';

-- Vacuum to reclaim space
VACUUM ANALYZE page_views;
```

### Reset Database (⚠️ Destructive!)
```sql
-- WARNING: This deletes ALL data!

-- Drop tables
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Re-run setup
-- Then re-run: setup.sql
-- Then re-run: analytics_setup.sql
-- Then re-run: add_listed_by_migration.sql
-- Then re-run: add_theme_migration.sql
-- Then re-run: soft_delete_migration.sql
```

---

## 🔍 Monitoring & Analytics

### Check Application Health
```bash
# 1. Open browser to http://localhost:3000
# 2. Open DevTools (F12)
# 3. Check Console for health check logs
# 4. Should see:
#    ✅ Database Connection
#    ✅ Users Table
#    ✅ Links Table
#    ✅ Storage Bucket
```

### View Production Logs (Vercel)
```bash
# Via Vercel CLI
vercel logs

# Or via Vercel Dashboard:
# Project → Deployments → [Select deployment] → Logs
```

### Monitor Database Performance
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check query performance
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## 🛠️ Troubleshooting Commands

### Fix Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Fix TypeScript Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Generate types
npm run build
```

### Fix Dependency Issues
```bash
# Update all dependencies
npm update

# Install specific version
npm install package-name@version

# Force reinstall
npm ci
```

### Fix Database Connection Issues
```sql
-- Test connection in Supabase SQL Editor
SELECT NOW();

-- Check RLS policies
SELECT * FROM pg_policies;

-- Disable RLS temporarily (development only!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS (important!)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
```

---

## 📦 Package Management

### Check Installed Packages
```bash
# List all installed packages
npm list

# List only direct dependencies
npm list --depth=0

# Check outdated packages
npm outdated
```

### Update Packages
```bash
# Update to latest patch versions
npm update

# Update to latest minor versions
npm update --save

# Update specific package
npm update package-name

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

---

## 🔑 Quick Access URLs

### Development
- **Homepage:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin
- **Create User:** http://localhost:3000/admin/create
- **User Profile:** http://localhost:3000/{username}
- **Privacy Policy:** http://localhost:3000/privacy
- **Cookie Preferences:** http://localhost:3000/cookie-preferences

### Supabase Dashboard
- **Database:** https://supabase.com/dashboard/project/YOUR_PROJECT/database
- **Storage:** https://supabase.com/dashboard/project/YOUR_PROJECT/storage
- **SQL Editor:** https://supabase.com/dashboard/project/YOUR_PROJECT/sql
- **Logs:** https://supabase.com/dashboard/project/YOUR_PROJECT/logs

### Vercel Dashboard
- **Project:** https://vercel.com/dashboard
- **Deployments:** https://vercel.com/yourteam/yourproject/deployments
- **Analytics:** https://vercel.com/yourteam/yourproject/analytics
- **Settings:** https://vercel.com/yourteam/yourproject/settings

---

## 🎯 Common Tasks Cheat Sheet

### Add New Admin Name
```typescript
// Edit: src/lib/admins.ts
export const ADMIN_NAMES = [
  'Mehdi', 'Hmed', 'Janah', 'Jebbar',
  'Walid', 'Amine', 'Othman', 'Youssef', 'Abdo',
  'NewAdmin' // Add here
] as const;
```

### Add New Theme
```typescript
// Edit: src/lib/themes.ts
export const THEMES = {
  // ... existing themes
  newtheme: {
    name: 'New Theme',
    accent: '#YOUR_COLOR',
    bgPrimary: '#YOUR_BG_COLOR',
    textPrimary: '#YOUR_TEXT_COLOR'
  }
};
```

### Change Admin Credentials
```typescript
// Edit: src/lib/auth.ts
const ADMIN_EMAIL = 'newemail@example.com';
const ADMIN_PASSWORD = 'NewPassword123';

// ⚠️ For production: Use environment variables!
```

### Update Supabase Credentials
```typescript
// Edit: src/lib/supabase.ts
const supabaseUrl = 'https://your-new-project.supabase.co';
const supabaseKey = 'your-new-anon-key';

// ⚠️ For production: Use environment variables!
```

### Update Telegram Bot
```typescript
// Edit: src/lib/telegram.ts
const TELEGRAM_BOT_TOKEN = 'your-new-bot-token';
const TELEGRAM_CHAT_ID = 'your-new-chat-id';

// ⚠️ For production: Use environment variables!
```

---

## 📚 Documentation Commands

### Generate Documentation
```bash
# View current documentation
ls -la *.md

# Read specific docs
cat README.md
cat CODEBASE_ANALYSIS.md
cat QUICK_REFERENCE.md
```

### Update Documentation
```bash
# Edit README
nano README.md
# or
code README.md

# Create new documentation
echo "# New Doc" > NEW_DOC.md
```

---

## 🎓 Learning Commands

### Explore Codebase
```bash
# Count lines of code
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Find all components
find src/components -name "*.tsx"

# Find all API routes
find src/app/api -name "route.ts"

# Search for specific code
grep -r "function" src/

# Find TypeScript interfaces
grep -r "interface" src/types/
```

### Analyze Dependencies
```bash
# View dependency tree
npm list

# Check bundle size
npm run build
# Output shows .next/static/chunks/

# Analyze with Next.js bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

## 🚨 Emergency Commands

### Application Not Starting
```bash
# 1. Check Node version
node --version  # Should be 20.x

# 2. Clear everything and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Failed
```sql
-- 1. Test connection in Supabase Dashboard
SELECT 1;

-- 2. Check if tables exist
SELECT * FROM users LIMIT 1;

-- 3. Re-run migrations if needed
-- setup.sql
-- analytics_setup.sql
```

### Deployment Failed
```bash
# 1. Check build locally
npm run build

# 2. If build passes, check Vercel logs
vercel logs

# 3. Redeploy
vercel --prod --force
```

---

**Quick Reference Version:** 1.0  
**Last Updated:** February 12, 2026  
**For Full Details:** See Documentation Files

---

## 📞 Support Resources

- **Documentation:** All .md files in project root
- **Issues:** Check terminal output and browser console
- **Logs:** Vercel Dashboard → Logs
- **Database:** Supabase Dashboard → Logs
