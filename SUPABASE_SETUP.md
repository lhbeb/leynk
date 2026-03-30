# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details:
   - Name: `Leynk`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Wait for the project to be created

## 2. Create Database Tables and Policies

> **Note:** Supabase credentials are already hardcoded in `src/lib/supabase.ts`. No environment variables needed!

### Option 1: Run Complete Setup Script (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `setup.sql` file from the project root
3. Paste it into the SQL Editor
4. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

This script will:
- ✅ Create all tables (users, links)
- ✅ Create all indexes
- ✅ Enable Row Level Security (RLS)
- ✅ Create all RLS policies
- ✅ Create all storage policies
- ✅ Create triggers for updated_at timestamps
- ✅ Handle existing objects gracefully (no errors if run multiple times)

### Option 2: Run SQL Manually

If you prefer to run SQL manually, use the following:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_order ON links(user_id, order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to links"
  ON links FOR SELECT
  USING (true);

-- Create policies for authenticated write access
-- Note: For now, we'll allow all operations for simplicity
-- In production, you should restrict this to admin users only
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on links"
  ON links FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Create Storage Bucket for Profile Pictures

> **Important:** Storage buckets **cannot** be created with SQL. You must create them through the Supabase Dashboard UI.

### Create the Bucket (UI Method)

1. Go to **Storage** in your Supabase dashboard (left sidebar)
2. Click **"New Bucket"** button
3. **Bucket Name:** Enter exactly `profile-pictures` (case-sensitive, with hyphen)
4. **Public bucket:** Toggle this to **ON** ✅ (very important!)
5. Click **"Create Bucket"**

### Set Storage Policies

**After** the bucket is created:

- **If you used `setup.sql`:** Storage policies are already created! ✅
- **If you need to create them manually:** The `setup.sql` script includes all storage policies

> **Note:** The complete `setup.sql` script handles everything automatically. Just make sure you create the bucket in the UI first!

## 4. Test Your Setup

After completing these steps, restart your Next.js development server:

```bash
npm run dev
```

You should now be able to create users and upload profile pictures!

## Troubleshooting

- **Connection Error**: Verify your Supabase project is active and credentials are correct (hardcoded in `src/lib/supabase.ts`)
- **Upload Fails**: Ensure the `profile-pictures` bucket exists and is public
- **Database Error**: Verify all tables were created successfully in the SQL Editor
- **RLS Error**: Make sure the policies are created and enabled

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `username`: TEXT (Unique)
- `profile_picture`: TEXT (URL to Supabase storage or external URL)
- `bio`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Links Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `title`: TEXT
- `url`: TEXT
- `order_index`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

