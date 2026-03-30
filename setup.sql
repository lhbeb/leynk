-- ============================================================================
-- Leynk Database Setup Script
-- Run this in Supabase SQL Editor to set up the complete database
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE TABLES
-- ----------------------------------------------------------------------------

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table (if not exists)
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. CREATE INDEXES
-- ----------------------------------------------------------------------------

-- Index for users table (username lookup)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index for links table (user_id lookup)
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

-- Index for links table (ordering)
CREATE INDEX IF NOT EXISTS idx_links_order ON links(user_id, order_index);

-- ----------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4. DROP EXISTING POLICIES (if any) to avoid conflicts
-- ----------------------------------------------------------------------------

-- Drop existing users table policies
DROP POLICY IF EXISTS "Allow public read access to users" ON users;
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Drop existing links table policies
DROP POLICY IF EXISTS "Allow public read access to links" ON links;
DROP POLICY IF EXISTS "Allow all operations on links" ON links;

-- ----------------------------------------------------------------------------
-- 5. CREATE RLS POLICIES FOR TABLES
-- ----------------------------------------------------------------------------

-- Users table: Allow public read access
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  USING (true);

-- Users table: Allow all operations (insert, update, delete)
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Links table: Allow public read access
CREATE POLICY "Allow public read access to links"
  ON links FOR SELECT
  USING (true);

-- Links table: Allow all operations (insert, update, delete)
CREATE POLICY "Allow all operations on links"
  ON links FOR ALL
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 6. DROP EXISTING STORAGE POLICIES (if any) to avoid conflicts
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- ----------------------------------------------------------------------------
-- 7. CREATE STORAGE POLICIES FOR profile-pictures BUCKET
-- ----------------------------------------------------------------------------

-- Allow public read access to profile pictures
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');

-- Allow public uploads to profile pictures
CREATE POLICY "Allow uploads"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'profile-pictures');

-- Allow public updates to profile pictures
CREATE POLICY "Allow updates"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'profile-pictures');

-- Allow public deletes to profile pictures
CREATE POLICY "Allow deletes"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'profile-pictures');

-- ----------------------------------------------------------------------------
-- 8. CREATE TRIGGER TO UPDATE updated_at TIMESTAMP
-- ----------------------------------------------------------------------------

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_links_updated_at ON links;

-- Create triggers for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for links table
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- SETUP COMPLETE!
-- ----------------------------------------------------------------------------

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ Tables created: users, links';
  RAISE NOTICE '✅ RLS policies enabled';
  RAISE NOTICE '✅ Storage policies created for profile-pictures bucket';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Make sure you have created the "profile-pictures" bucket in Storage (UI)';
  RAISE NOTICE '    Go to Storage → New Bucket → Name: profile-pictures → Public: ON';
END $$;

