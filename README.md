# Leynk.co

A modern, clean link-in-bio application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Modern Design**: Clean and beautiful UI with custom color scheme
- 🔗 **Unlimited Links**: Add as many links as you want for each user
- 👤 **User Management**: Admin dashboard to create and manage user pages
- 🔐 **Secure Authentication**: Protected admin area with login system
- 📱 **Responsive**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast**: Built with Next.js 14 for optimal performance
- 🎯 **Simple**: Easy to use admin interface
- 📦 **Supabase Integration**: Database and file storage powered by Supabase
- 🖼️ **Image Upload**: Upload profile pictures directly or use URLs

## Design Specifications

- **Font**: DM Sans
- **Accent Color**: #17803d (Green)
- **Text Color**: #374151 (Dark Gray)
- **Background Color**: #e8f7ee (Light Green)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

Follow the comprehensive guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up database tables
- Create storage bucket for profile pictures

> **Note:** Supabase credentials are already hardcoded in the project. No environment variables needed!

3. **Run the development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
Leynk.co/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── create/           # Create new user page
│   │   │   ├── edit/[username]/  # Edit user page
│   │   │   └── page.tsx          # Admin dashboard home
│   │   ├── api/
│   │   │   └── users/            # User management API
│   │   ├── [username]/           # Dynamic user profile pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── lib/
│   │   └── storage.ts            # Data storage utilities
│   └── types/
│       └── index.ts              # TypeScript types
└── public/                       # Static assets
```

## Usage

### Admin Login

1. Navigate to `/admin` or click "Admin Dashboard" on the home page
2. You'll be redirected to `/admin/login`
3. Enter your admin credentials (see [AUTHENTICATION.md](./AUTHENTICATION.md))
4. Click "Sign In" to access the dashboard

### Admin Dashboard

1. After logging in, you'll see the admin dashboard
2. Click "Create New User" to add a new user page
3. Fill in:
   - Username (will be the URL: leynk.co/username)
   - Profile picture URL
   - Bio
   - Links (title and URL)
4. Save to create the user page

### User Pages

User pages are accessible at `/{username}` (e.g., leynk.co/renebachmeier776)

Each user page displays:
- Round profile picture
- Username
- Bio
- Clickable links that open in new tabs

### Editing Users

1. From the admin dashboard, click the edit icon next to any user
2. Update profile picture, bio, or links
3. Save changes

### Deleting Users

1. From the admin dashboard, click the delete icon next to any user
2. Confirm deletion

## Data Storage

This application uses **Supabase** for all data storage:

- **PostgreSQL Database**: Stores user profiles and links
- **Storage Buckets**: Stores uploaded profile pictures
- **Real-time**: Built on Supabase's real-time infrastructure
- **Secure**: Row Level Security (RLS) policies protect your data

### Database Schema

**Users Table:**
- `id`: UUID (Primary Key)
- `username`: TEXT (Unique)
- `profile_picture`: TEXT
- `bio`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**Links Table:**
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `title`: TEXT
- `url`: TEXT
- `order_index`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Development Tools

When running in development mode, the app automatically performs a database health check and logs the results to the browser console. Open your browser's developer tools (F12) to see:

- ✅ Connection status to Supabase
- 📊 Database tables status (users, links)
- 📦 Storage bucket status (profile-pictures)
- ⚠️  Any setup issues or errors
- 🔧 Debug information

This helps you verify your Supabase setup is correct and troubleshoot any configuration issues.

## Building for Production

```bash
npm run build
npm start
```

> **Note:** Dev tools are automatically disabled in production builds.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: DM Sans (Google Fonts)

## License

All rights reserved © 2025 Leynk.co

