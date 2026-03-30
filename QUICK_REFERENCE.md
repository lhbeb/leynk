# 🚀 Leynk Quick Reference Guide

**Last Updated:** January 29, 2026

---

## 📱 Key URLs

### Development
```
Homepage:        http://localhost:3000
Admin Login:     http://localhost:3000/admin/login
Admin Dashboard: http://localhost:3000/admin
User Profile:    http://localhost:3000/{username}
```

### Admin Credentials
```
Email:    elmahboubimehdi@gmail.com
Password: Localserver!!2
```

---

## 🔑 Important Credentials

### Supabase
```typescript
URL: https://rwevvpdpguhincowygzx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Telegram Bot
```typescript
Bot Token: 7742080768:AAFaskpr-XCXiEWgcuJhtAsCHiffkhRfyrc
Chat ID: -1002806502052
```

---

## 📂 Key Files

### Configuration
```
src/lib/supabase.ts          # Supabase client
src/lib/auth.ts              # Authentication
src/lib/telegram.ts          # Telegram integration
tailwind.config.ts           # Tailwind config
next.config.mjs              # Next.js config
vercel.json                  # Deployment config
```

### Database
```
setup.sql                    # Main database setup
analytics_setup.sql          # Analytics tables
```

### Documentation
```
README.md                    # Main documentation
QUICKSTART.md                # Quick start guide
AUTHENTICATION.md            # Auth details
SUPABASE_SETUP.md           # Database setup
TELEGRAM_SETUP.md           # Telegram setup
DEPLOYMENT.md               # Deployment guide
CODEBASE_ANALYSIS.md        # Deep analysis (this document)
```

---

## 🗄️ Database Tables

### users
```sql
id              UUID PRIMARY KEY
username        TEXT UNIQUE NOT NULL
profile_picture TEXT
bio             TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### links
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
title       TEXT NOT NULL
url         TEXT NOT NULL
order_index INTEGER
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### page_views
```sql
id           UUID PRIMARY KEY
username     TEXT NOT NULL
ip_address   TEXT
country      TEXT
country_code TEXT
city         TEXT
user_agent   TEXT
referrer     TEXT
viewed_at    TIMESTAMP
```

---

## 🔌 API Routes Quick Reference

### User Management
```typescript
GET    /api/users                  // Get all users
POST   /api/users                  // Create/update user
DELETE /api/users?username={name}  // Delete user
GET    /api/users/{username}       // Get single user
```

### Analytics
```typescript
POST /api/analytics/track          // Track page view
POST /api/analytics/link-click     // Track link click
GET  /api/analytics/stats          // Get aggregate stats
GET  /api/analytics/{username}     // Get user analytics
```

### Other
```typescript
POST /api/upload                   // Upload profile picture
GET  /api/thumbnail?url={url}      // Get link thumbnail
POST /api/subscribe                // Email subscription
GET  /api/telegram/test            // Test Telegram bot
```

---

## 🎨 Design Tokens

### Colors
```css
--accent: #17803d        /* Primary green */
--text-primary: #374151  /* Dark gray */
--bg-primary: #e8f7ee    /* Light green */
```

### Typography
```css
Font: DM Sans
Weights: 400, 500, 600, 700
```

### Common Patterns
```css
/* Primary Button */
px-6 py-3 bg-accent text-white rounded-full

/* Card */
bg-white rounded-2xl p-8 shadow-sm

/* Input */
px-4 py-3 border border-accent/20 rounded-xl
```

---

## 🧩 Key Components

### User-Facing
```typescript
LinkCard              // Display individual links
ShareButton           // Share profile
NotificationButton    // Subscribe trigger
SubscribeModal        // Email collection
PageViewTracker       // Analytics tracking
```

### Admin
```typescript
AuthGuard            // Route protection
AnalyticsModal       // Analytics dashboard
EmojiPicker          // Emoji selector
DevTools             // Dev health check
```

---

## 📊 Analytics Flow

### Page View
```
1. User visits /{username}
2. PageViewTracker mounts
3. POST to /api/analytics/track
4. Get IP and location
5. Check for duplicates (10s window)
6. Insert to page_views table
7. Send Telegram notification
```

### Link Click
```
1. User clicks link
2. LinkCard onClick fires
3. POST to /api/analytics/link-click
4. Get IP and location
5. Send Telegram notification
6. Navigate to URL (non-blocking)
```

---

## 🔐 Authentication Flow

### Login
```
1. Navigate to /admin
2. AuthGuard checks session
3. Redirect to /admin/login if not authenticated
4. Enter credentials
5. validateCredentials() called
6. setSession() if valid
7. Redirect to /admin
```

### Session
```typescript
Storage: localStorage
Key: leynk_admin_session
Duration: 24 hours
Data: { authenticated: boolean, timestamp: number }
```

---

## 📱 Telegram Notifications

### Page View
```
👁️ New Page View!
👤 User Page: @username
🔗 Page: leynk.co/username
🌍 IP: 123.45.67.89
📍 Location: 🇺🇸 City, Country
⏰ Time: 1/29/2026, 2:30:00 PM
```

### Link Click
```
🔔 New Link Click!
👤 User: @username
🔗 Link: Link Title
🌐 URL: https://example.com
🌍 IP: 123.45.67.89
📍 Location: 🇺🇸 City, Country
⏰ Time: 1/29/2026, 2:30:00 PM
```

### Subscription
```
📧 New Subscription!
👤 User Page: @username
📬 Email: user@example.com
🔗 Page: leynk.co/username
🌍 IP: 123.45.67.89
📍 Location: 🇺🇸 City, Country
⏰ Time: 1/29/2026, 2:30:00 PM
```

---

## 🚀 Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

### Database Setup
```sql
-- Run in Supabase SQL Editor
-- 1. Create main tables
\i setup.sql

-- 2. Create analytics tables
\i analytics_setup.sql

-- 3. Create storage bucket (via UI)
-- Name: profile-pictures
-- Public: ON
```

### Deployment
```bash
# Via Vercel CLI
npm i -g vercel
vercel

# Or push to Git and deploy via Vercel dashboard
git add .
git commit -m "Deploy"
git push
```

---

## 🔍 Debugging Tips

### Check Database Connection
```typescript
// DevTools component runs automatically in dev mode
// Check browser console for health check results
```

### Test Telegram Bot
```bash
curl http://localhost:3000/api/telegram/test
```

### View Supabase Logs
```
1. Go to Supabase Dashboard
2. Navigate to Logs
3. Filter by table/function
```

### Check API Routes
```bash
# Test user creation
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","bio":"Test user","links":[]}'

# Test analytics
curl -X POST http://localhost:3000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}'
```

---

## ⚠️ Common Issues

### "Failed to upload file"
```
✓ Check profile-pictures bucket exists
✓ Verify bucket is set to Public
✓ Check storage policies are created
```

### "User not found"
```
✓ Verify tables exist in Supabase
✓ Check RLS policies allow read access
✓ Verify username format is valid
```

### "Telegram notifications not working"
```
✓ Verify bot token is correct
✓ Check chat ID is correct (negative for groups)
✓ Ensure bot is in the group
✓ Verify bot has send message permissions
✓ Test with /api/telegram/test endpoint
```

### "Build fails"
```
✓ Run npm install
✓ Check TypeScript errors: npm run build
✓ Verify all dependencies are installed
✓ Check Node.js version (>= 20.0.0)
```

---

## 📝 Quick Workflows

### Create New User
```
1. Go to /admin/login
2. Login with admin credentials
3. Click "Create New User"
4. Enter username (lowercase, alphanumeric, underscores)
5. Upload or paste profile picture URL
6. Enter bio
7. Add links (title + URL)
8. Click "Create User"
9. Visit /{username} to view
```

### Edit Existing User
```
1. Go to /admin
2. Find user in list
3. Click edit icon
4. Modify fields
5. Click "Update User"
6. Changes reflect immediately
```

### View Analytics
```
1. Go to /admin
2. Click "View Analytics" on any user
3. See total views, 7-day chart, countries, recent views
4. Modal shows real-time data
```

### Test Deployment
```
1. npm run build (verify builds successfully)
2. npm start (test production build locally)
3. Visit http://localhost:3000
4. Test all features
5. Deploy to Vercel
```

---

## 🎯 Feature Checklist

### Core Features
- [x] User profile pages
- [x] Admin dashboard
- [x] Create/edit/delete users
- [x] Profile picture upload
- [x] Link management
- [x] Analytics tracking
- [x] Telegram notifications
- [x] Share functionality
- [x] Email subscriptions

### Pages
- [x] Homepage
- [x] User profiles (/{username})
- [x] Admin login
- [x] Admin dashboard
- [x] Create user
- [x] Edit user
- [x] Cookie preferences
- [x] Privacy policy
- [x] Report page
- [x] 404 page

### APIs
- [x] User CRUD operations
- [x] File upload
- [x] Analytics tracking
- [x] Link click tracking
- [x] Subscription handling
- [x] Telegram integration
- [x] Thumbnail fetching

---

## 🔮 Next Steps

### Immediate (Production)
1. Move credentials to environment variables
2. Implement proper authentication
3. Add rate limiting
4. Tighten RLS policies
5. Set up error monitoring

### Short-term (Features)
1. Add custom themes
2. Implement link scheduling
3. Add bulk operations
4. Create API documentation
5. Add export functionality

### Long-term (Scaling)
1. Implement caching (Redis)
2. Add CDN for images
3. Optimize database queries
4. Set up monitoring
5. Plan multi-region deployment

---

**Quick Reference Version:** 1.0  
**For Full Details:** See `CODEBASE_ANALYSIS.md`
