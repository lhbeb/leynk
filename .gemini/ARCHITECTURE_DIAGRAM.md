# 🏗️ Leynk Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Homepage   │  │ User Profile │  │    Admin     │             │
│  │  (Landing)   │  │  /[username] │  │  Dashboard   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │                 │                   │                     │
└─────────┼─────────────────┼───────────────────┼─────────────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 14 APP ROUTER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │             SERVER COMPONENTS (SSR)                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  • src/app/page.tsx            → Homepage                  │   │
│  │  • src/app/[username]/page.tsx → User Profile (Dynamic)    │   │
│  │  • src/app/layout.tsx          → Root Layout              │   │
│  │  • src/app/not-found.tsx       → 404 Page                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │           CLIENT COMPONENTS ('use client')                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  • src/app/admin/*             → Admin Pages               │   │
│  │  • src/components/LinkCard     → Link Display              │   │
│  │  • src/components/AuthGuard    → Route Protection          │   │
│  │  • src/components/Analytics    → Analytics Modal           │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   API ROUTES                               │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  /api/users                    → User CRUD                 │   │
│  │  /api/analytics/track          → Track page views          │   │
│  │  /api/analytics/link-click     → Track link clicks         │   │
│  │  /api/upload                   → Upload files              │   │
│  │  /api/subscribe                → Email subscriptions       │   │
│  │  /api/telegram/test            → Test notifications        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────┬───────────────────┬───────────────────┬────────────────────┬──┘
      │                   │                   │                    │
      ▼                   ▼                   ▼                    ▼
┌──────────┐   ┌─────────────────┐   ┌──────────────┐   ┌──────────────┐
│ Supabase │   │  IP Geolocation │   │   Telegram   │   │  Web Share   │
│ Database │   │      APIs       │   │   Bot API    │   │     API      │
└──────────┘   └─────────────────┘   └──────────────┘   └──────────────┘
```

## Data Flow Architecture

### User Profile Page Load

```
┌─────────────┐
│   Browser   │
│   Request   │
│ /john_doe   │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Next.js Server Component                 │
│  src/app/[username]/page.tsx              │
├────────────────────────────────────────────┤
│  1. Extract username from URL params      │
│  2. Call getUser(username)                │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Database Layer (src/lib/storage.ts)      │
├────────────────────────────────────────────┤
│  getUser(username) {                      │
│    • Query users table                    │
│    • Query links table (JOIN)             │
│    • Return UserPage or null              │
│  }                                        │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Supabase PostgreSQL Database             │
├────────────────────────────────────────────┤
│  SELECT * FROM users                      │
│  WHERE username = 'john_doe'              │
│  AND deleted_at IS NULL;                  │
│                                           │
│  SELECT * FROM links                      │
│  WHERE user_id = {...}                    │
│  ORDER BY order_index;                    │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Render User Profile                      │
├────────────────────────────────────────────┤
│  • Profile picture                        │
│  • Username (@john_doe)                   │
│  • Bio text                               │
│  • Links (ordered)                        │
│  • Share button                           │
│  • Subscribe button                       │
│  • PageViewTracker component (client)     │
└────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Client-Side Analytics Tracking           │
│  PageViewTracker Component                │
├────────────────────────────────────────────┤
│  useEffect(() => {                        │
│    fetch('/api/analytics/track', {        │
│      method: 'POST',                      │
│      body: JSON.stringify({               │
│        username: 'john_doe'               │
│      })                                   │
│    });                                    │
│  }, []);                                  │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Analytics API Route                      │
│  /api/analytics/track                     │
├────────────────────────────────────────────┤
│  1. Extract IP from headers               │
│  2. Check for duplicates (10s window)     │
│  3. Fetch geolocation (ipapi.co)          │
│  4. Insert into page_views table          │
│  5. Send Telegram notification            │
└──────┬─────────────────┬───────────────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌─────────────────┐
│  Supabase    │  │   Telegram API  │
│  page_views  │  │   Notification  │
│    table     │  │   Sent to Group │
└──────────────┘  └─────────────────┘
```

### Admin User Creation Flow

```
┌─────────────┐
│   Admin     │
│  Dashboard  │
│  /admin     │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  AuthGuard Component                      │
├────────────────────────────────────────────┤
│  if (!isAuthenticated()) {                │
│    router.push('/admin/login');           │
│    return null;                           │
│  }                                        │
│  return children;                         │
└──────┬─────────────────────────────────────┘
       │ ✅ Authenticated
       ▼
┌────────────────────────────────────────────┐
│  Admin Dashboard Page                     │
│  src/app/admin/page.tsx                   │
├────────────────────────────────────────────┤
│  • Display all users                      │
│  • Show analytics                         │
│  • Action buttons (Edit, Delete, Copy)    │
│  • "Create New User" button               │
└──────┬─────────────────────────────────────┘
       │ Click "Create New User"
       ▼
┌────────────────────────────────────────────┐
│  Create User Page                         │
│  src/app/admin/create/page.tsx            │
├────────────────────────────────────────────┤
│  Form Fields:                             │
│  • Username (validated)                   │
│  • Profile Picture (upload or URL)        │
│  • Bio (textarea)                         │
│  • Links (dynamic list)                   │
│  • Listed By (dropdown)                   │
│  • Theme (optional)                       │
└──────┬─────────────────────────────────────┘
       │ Submit Form
       ▼
┌────────────────────────────────────────────┐
│  File Upload (if profile pic uploaded)    │
│  POST /api/upload                         │
├────────────────────────────────────────────┤
│  1. Validate file type (image)            │
│  2. Generate unique filename              │
│  3. Upload to Supabase Storage            │
│  4. Return public URL                     │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Create User API                          │
│  POST /api/users                          │
├────────────────────────────────────────────┤
│  Request Body:                            │
│  {                                        │
│    username: 'john_doe',                  │
│    profilePicture: 'https://...',         │
│    bio: '...',                            │
│    links: [...],                          │
│    listedBy: 'Mehdi',                     │
│    theme: 'default'                       │
│  }                                        │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Database Layer                           │
│  saveUser() in src/lib/storage.ts         │
├────────────────────────────────────────────┤
│  1. Normalize username                    │
│  2. UPSERT user record                    │
│  3. DELETE old links                      │
│  4. INSERT new links                      │
│  5. Return UserPage object                │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Supabase Database                        │
├────────────────────────────────────────────┤
│  INSERT INTO users (                      │
│    username, profile_picture, bio,        │
│    listed_by, theme,                      │
│    created_at, updated_at                 │
│  ) VALUES (...);                          │
│                                           │
│  INSERT INTO links (                      │
│    user_id, title, url, order_index       │
│  ) VALUES (...);                          │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Success Response                         │
├────────────────────────────────────────────┤
│  {                                        │
│    success: true,                         │
│    user: { username: 'john_doe', ... }    │
│  }                                        │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  Redirect to /admin                       │
│  Show success message                     │
│  Revalidate page cache                    │
└────────────────────────────────────────────┘
```

## Database Schema Visual

```
┌─────────────────────────────────────────────────────────────┐
│                         users                               │
├──────────────┬──────────────────────┬──────────────────────┤
│  id          │  UUID                │  PRIMARY KEY         │
│  username    │  TEXT                │  UNIQUE NOT NULL     │
│  profile_pic │  TEXT                │  NULL (URL or path)  │
│  bio         │  TEXT                │  NULL                │
│  listed_by   │  TEXT                │  NULL (admin name)   │
│  theme       │  TEXT                │  NULL (theme key)    │
│  deleted_at  │  TIMESTAMP           │  NULL (soft delete)  │
│  created_at  │  TIMESTAMP           │  DEFAULT NOW()       │
│  updated_at  │  TIMESTAMP           │  DEFAULT NOW()       │
└──────────────┴──────────────────────┴──────────────────────┘
           │
           │ 1:N relationship
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                         links                               │
├──────────────┬──────────────────────┬──────────────────────┤
│  id          │  UUID                │  PRIMARY KEY         │
│  user_id     │  UUID                │  FK → users(id)      │
│  title       │  TEXT                │  NOT NULL            │
│  url         │  TEXT                │  NOT NULL            │
│  order_index │  INTEGER             │  DEFAULT 0           │
│  created_at  │  TIMESTAMP           │  DEFAULT NOW()       │
│  updated_at  │  TIMESTAMP           │  DEFAULT NOW()       │
└──────────────┴──────────────────────┴──────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                      page_views                             │
├──────────────┬──────────────────────┬──────────────────────┤
│  id          │  UUID                │  PRIMARY KEY         │
│  username    │  TEXT                │  NOT NULL            │
│  ip_address  │  TEXT                │  NULL                │
│  country     │  TEXT                │  NULL                │
│  country_code│  TEXT                │  NULL                │
│  city        │  TEXT                │  NULL                │
│  user_agent  │  TEXT                │  NULL                │
│  referrer    │  TEXT                │  NULL                │
│  viewed_at   │  TIMESTAMP           │  DEFAULT NOW()       │
└──────────────┴──────────────────────┴──────────────────────┘
           │
           │ username references users.username
           │ (CASCADE on delete)
           │
```

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      Root Layout                            │
│                   src/app/layout.tsx                        │
├─────────────────────────────────────────────────────────────┤
│  • HTML structure                                           │
│  • Global CSS import                                        │
│  • Font configuration (DM Sans)                             │
│  • Metadata                                                 │
└─────────┬───────────────────────────────────────────────────┘
          │
          ├─────┐ Homepage
          │     │
          │     ▼
          │   ┌────────────────────────────────────────────┐
          │   │  src/app/page.tsx                         │
          │   ├────────────────────────────────────────────┤
          │   │  • Hero section                           │
          │   │  • Features showcase                      │
          │   │  • Example profile preview                │
          │   │  • Footer                                 │
          │   └────────────────────────────────────────────┘
          │
          ├─────┐ User Profile
          │     │
          │     ▼
          │   ┌────────────────────────────────────────────┐
          │   │  src/app/[username]/page.tsx              │
          │   ├────────────────────────────────────────────┤
          │   │  ┌──────────────────────────────────────┐ │
          │   │  │  PageViewTracker                     │ │
          │   │  └──────────────────────────────────────┘ │
          │   │  ┌──────────────────────────────────────┐ │
          │   │  │  Profile Header                      │ │
          │   │  │  • Profile Picture                   │ │
          │   │  │  • Username                          │ │
          │   │  │  • Bio                               │ │
          │   │  └──────────────────────────────────────┘ │
          │   │  ┌──────────────────────────────────────┐ │
          │   │  │  Link List                           │ │
          │   │  │  ┌────────────────────────────────┐  │ │
          │   │  │  │  LinkCard (for each link)      │  │ │
          │   │  │  │  • Thumbnail                   │  │ │
          │   │  │  │  • Title                       │  │ │
          │   │  │  │  • Click tracking              │  │ │
          │   │  │  └────────────────────────────────┘  │ │
          │   │  └──────────────────────────────────────┘ │
          │   │  ┌──────────────────────────────────────┐ │
          │   │  │  Actions                             │ │
          │   │  │  • ShareButton                       │ │
          │   │  │  • NotificationButton                │ │
          │   │  │    └─→ SubscribeModal               │ │
          │   │  └──────────────────────────────────────┘ │
          │   └────────────────────────────────────────────┘
          │
          └─────┐ Admin Area
                │
                ▼
              ┌────────────────────────────────────────────┐
              │  src/app/admin/login/page.tsx             │
              ├────────────────────────────────────────────┤
              │  • Email input                            │
              │  • Password input                         │
              │  • Login button                           │
              │  • Validation                             │
              └────────────────────────────────────────────┘
                │ Authenticated ✅
                ▼
              ┌────────────────────────────────────────────┐
              │  AuthGuard Component                      │
              │  (wraps all protected routes)             │
              └───────────┬────────────────────────────────┘
                          │
                          ├─────┐ Dashboard
                          │     │
                          │     ▼
                          │   ┌────────────────────────────┐
                          │   │  src/app/admin/page.tsx   │
                          │   ├────────────────────────────┤
                          │   │  • User table             │
                          │   │  • Analytics              │
                          │   │  • Actions                │
                          │   │  ┌──────────────────────┐ │
                          │   │  │  AnalyticsModal      │ │
                          │   │  │  • 7-day chart       │ │
                          │   │  │  • Country breakdown │ │
                          │   │  │  • Recent views      │ │
                          │   │  └──────────────────────┘ │
                          │   └────────────────────────────┘
                          │
                          ├─────┐ Create User
                          │     │
                          │     ▼
                          │   ┌────────────────────────────┐
                          │   │  src/app/admin/create/    │
                          │   │  page.tsx                 │
                          │   ├────────────────────────────┤
                          │   │  • Form fields            │
                          │   │  • File upload            │
                          │   │  • EmojiPicker            │
                          │   │  • Validation             │
                          │   └────────────────────────────┘
                          │
                          └─────┐ Edit User
                                │
                                ▼
                              ┌────────────────────────────┐
                              │  src/app/admin/edit/      │
                              │  [username]/page.tsx      │
                              ├────────────────────────────┤
                              │  • Pre-populated form     │
                              │  • Same as create         │
                              │  • Update logic           │
                              └────────────────────────────┘
```

## Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
│  /admin     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│  AuthGuard Component                │
│  (Client-side check)                │
├──────────────────────────────────────┤
│  const session = localStorage        │
│    .getItem('leynk_admin_session');  │
│                                      │
│  if (!session) {                     │
│    return redirect('/admin/login');  │
│  }                                   │
│                                      │
│  const { timestamp } = JSON.parse();│
│  const age = Date.now() - timestamp;│
│                                      │
│  if (age > 24 hours) {              │
│    return redirect('/admin/login');  │
│  }                                   │
│                                      │
│  // Session valid ✅                 │
│  return children;                    │
└──────────────────────────────────────┘
```

```
┌─────────────┐
│   Login     │
│    Form     │
└──────┬──────┘
       │ Submit credentials
       ▼
┌──────────────────────────────────────┐
│  validateCredentials()              │
│  src/lib/auth.ts                    │
├──────────────────────────────────────┤
│  if (email === ADMIN_EMAIL &&       │
│      password === ADMIN_PASSWORD) { │
│    return true;                     │
│  }                                  │
│  return false;                      │
└──────┬───────────────────────────────┘
       │ ✅ Valid
       ▼
┌──────────────────────────────────────┐
│  setSession()                       │
│  src/lib/auth.ts                    │
├──────────────────────────────────────┤
│  const session = {                  │
│    authenticated: true,             │
│    timestamp: Date.now()            │
│  };                                 │
│                                      │
│  localStorage.setItem(              │
│    'leynk_admin_session',           │
│    JSON.stringify(session)          │
│  );                                 │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Redirect to /admin                 │
│  Session valid for 24 hours         │
└──────────────────────────────────────┘
```

## Analytics Flow Diagram

```
┌─────────────────┐
│ Page View Event │
│ (Profile Load)  │
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│  Client: PageViewTracker Component            │
│  POST /api/analytics/track                    │
│  Body: { username: 'john_doe' }               │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│  Server: /api/analytics/track                 │
├────────────────────────────────────────────────┤
│  1. Extract IP from request headers           │
│     const ip = headers.get('x-forwarded-for') │
│              || request.ip                    │
│                                                │
│  2. Check for duplicates                      │
│     SELECT COUNT(*) FROM page_views           │
│     WHERE username = ? AND ip = ?             │
│       AND viewed_at > NOW() - 10 seconds      │
│                                                │
│     if (count > 0) return; // Skip duplicate  │
│                                                │
│  3. Fetch geolocation                         │
│     const geo = await fetch(                  │
│       `https://ipapi.co/${ip}/json/`         │
│     );                                        │
│     // Fallback to ip-api.com if fails        │
│                                                │
│  4. Extract user agent & referrer             │
│     const userAgent = headers.get('user-agent')│
│     const referrer = headers.get('referer')   │
│                                                │
│  5. Insert page view record                   │
│     INSERT INTO page_views (                  │
│       username, ip_address, country,          │
│       city, user_agent, referrer              │
│     ) VALUES (...)                            │
│                                                │
│  6. Send Telegram notification                │
│     await sendTelegramMessage(...)            │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│  Telegram Bot API                             │
│  POST https://api.telegram.org/bot{token}/    │
│       sendMessage                             │
├────────────────────────────────────────────────┤
│  {                                            │
│    chat_id: -1002806502052,                   │
│    text: "👁️ New Page View!\n..."          │
│    parse_mode: "HTML"                         │
│  }                                            │
└────────────────────────────────────────────────┘
```

## File Structure Diagram

```
leynk-main/
│
├── 📁 public/                  # Static assets
│   ├── leynk-logo.svg
│   ├── favicon.png
│   ├── home-banner.png
│   └── medium.png
│
├── 📁 src/
│   │
│   ├── 📁 app/                 # Next.js App Router
│   │   │
│   │   ├── 📁 [username]/      # Dynamic routes
│   │   │   └── page.tsx        # User profile page (SSR)
│   │   │
│   │   ├── 📁 admin/           # Admin area
│   │   │   ├── 📁 create/
│   │   │   │   └── page.tsx    # Create user form
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📁 [username]/
│   │   │   │       └── page.tsx # Edit user form
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   └── page.tsx        # Admin dashboard
│   │   │
│   │   ├── 📁 api/             # API routes
│   │   │   ├── 📁 analytics/
│   │   │   │   ├── 📁 [username]/
│   │   │   │   │   └── route.ts  # GET user analytics
│   │   │   │   ├── 📁 link-click/
│   │   │   │   │   └── route.ts  # POST link click
│   │   │   │   ├── 📁 stats/
│   │   │   │   │   └── route.ts  # GET aggregate stats
│   │   │   │   └── 📁 track/
│   │   │   │       └── route.ts  # POST page view
│   │   │   ├── 📁 subscribe/
│   │   │   │   └── route.ts    # POST email subscription
│   │   │   ├── 📁 telegram/
│   │   │   │   └── 📁 test/
│   │   │   │       └── route.ts  # GET test notification
│   │   │   ├── 📁 thumbnail/
│   │   │   │   └── route.ts    # GET link thumbnail
│   │   │   ├── 📁 upload/
│   │   │   │   └── route.ts    # POST file upload
│   │   │   └── 📁 users/
│   │   │       ├── 📁 [username]/
│   │   │       │   └── route.ts  # GET/DELETE single user
│   │   │       ├── 📁 copy/
│   │   │       │   └── route.ts  # POST copy user
│   │   │       ├── 📁 deleted/
│   │   │       │   └── route.ts  # GET deleted users
│   │   │       ├── 📁 recover/
│   │   │       │   └── route.ts  # POST recover user
│   │   │       └── route.ts    # GET/POST all users
│   │   │
│   │   ├── 📁 cookie-preferences/
│   │   │   └── page.tsx        # Cookie settings
│   │   ├── 📁 privacy/
│   │   │   └── page.tsx        # Privacy policy
│   │   ├── 📁 report/
│   │   │   └── page.tsx        # Report form
│   │   │
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # 404 page
│   │   └── page.tsx            # Homepage
│   │
│   ├── 📁 components/          # React components
│   │   ├── AnalyticsModal.tsx  # Analytics dashboard
│   │   ├── AuthGuard.tsx       # Route protection
│   │   ├── DevTools.tsx        # Dev health check
│   │   ├── EmojiPicker.tsx     # Emoji selector
│   │   ├── LeftActionButton.tsx # Back button
│   │   ├── LinkCard.tsx        # Link display
│   │   ├── NotificationButton.tsx # Subscribe trigger
│   │   ├── PageViewTracker.tsx # Analytics tracking
│   │   ├── ShareButton.tsx     # Share functionality
│   │   ├── SubscribeModal.tsx  # Email modal
│   │   └── Tooltip.tsx         # Tooltip UI
│   │
│   ├── 📁 lib/                 # Utilities
│   │   ├── admins.ts           # Admin names
│   │   ├── auth.ts             # Authentication
│   │   ├── db-health.ts        # Health checks
│   │   ├── storage.ts          # Database CRUD
│   │   ├── supabase.ts         # Supabase client
│   │   ├── telegram.ts         # Telegram API
│   │   ├── themes.ts           # Theme system
│   │   ├── thumbnail.ts        # OG image fetching
│   │   └── username-validation.ts # Username utils
│   │
│   └── 📁 types/
│       └── index.ts            # TypeScript types
│
├── 📁 .gemini/                 # AI-generated docs
│   ├── DEEP_UNDERSTANDING.md
│   └── ARCHITECTURE_DIAGRAM.md
│
├── 📄 Documentation Files
│   ├── README.md               # Main docs
│   ├── QUICKSTART.md           # Quick setup
│   ├── CODEBASE_ANALYSIS.md    # Deep dive (1667 lines)
│   ├── QUICK_REFERENCE.md      # Cheat sheet
│   ├── AUTHENTICATION.md       # Auth details
│   ├── SUPABASE_SETUP.md       # Database setup
│   ├── TELEGRAM_SETUP.md       # Telegram setup
│   ├── DEPLOYMENT.md           # Deploy guide
│   ├── PRODUCTION_CHECKLIST.md # Pre-launch
│   ├── LISTED_BY_FEATURE.md    # Admin attribution
│   ├── THEMING_ENGINE.md       # Themes
│   ├── SOFT_DELETE_SYSTEM.md   # Soft delete
│   ├── USERNAME_CHANGE_FEATURE.md # Username changes
│   └── BUGFIX_ANALYTICS_1000_LIMIT.md # Analytics fix
│
├── 📄 Database Migration Scripts
│   ├── setup.sql               # Main schema
│   ├── analytics_setup.sql     # Analytics tables
│   ├── add_listed_by_migration.sql # Listed by column
│   ├── add_theme_migration.sql # Theme column
│   └── soft_delete_migration.sql # Soft delete
│
├── 📄 Configuration Files
│   ├── next.config.mjs         # Next.js config
│   ├── tailwind.config.ts      # Tailwind config
│   ├── tsconfig.json           # TypeScript config
│   ├── vercel.json             # Vercel deploy
│   ├── package.json            # Dependencies
│   ├── postcss.config.mjs      # PostCSS
│   └── .gitignore              # Git ignore
│
└── 📁 node_modules/            # Dependencies
```

---

**Generated by:** Gemini AI Assistant  
**Date:** February 12, 2026
