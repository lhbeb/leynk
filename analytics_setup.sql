-- ============================================================================
-- Leynk Analytics Setup Script
-- Run this in Supabase SQL Editor to add analytics tracking
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE ANALYTICS TABLE
-- ----------------------------------------------------------------------------

-- Create page_views table to track user page visits
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  city TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_username FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 2. CREATE INDEXES FOR ANALYTICS
-- ----------------------------------------------------------------------------

-- Index for username lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_page_views_username ON page_views(username);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- Index for country analysis
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);

-- Composite index for username and date
CREATE INDEX IF NOT EXISTS idx_page_views_username_date ON page_views(username, viewed_at DESC);

-- ----------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4. DROP EXISTING POLICIES (if any)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow public inserts for page views" ON page_views;
DROP POLICY IF EXISTS "Allow authenticated read access to analytics" ON page_views;

-- ----------------------------------------------------------------------------
-- 5. CREATE RLS POLICIES
-- ----------------------------------------------------------------------------

-- Allow anyone to insert page views (for tracking)
CREATE POLICY "Allow public inserts for page views"
  ON page_views FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read their own analytics
-- Note: In practice, we'll use the anon key but check authentication in the API
CREATE POLICY "Allow authenticated read access to analytics"
  ON page_views FOR SELECT
  TO public
  USING (true);

-- ----------------------------------------------------------------------------
-- SETUP COMPLETE!
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '✅ Analytics table created: page_views';
  RAISE NOTICE '✅ Indexes created for optimal query performance';
  RAISE NOTICE '✅ RLS policies enabled';
END $$;

