-- ============================================================================
-- Soft Delete Migration for Leynk
-- Adds soft delete functionality to users table
-- ============================================================================

-- Add deleted_at column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for deleted_at to improve query performance
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Create index for active users (deleted_at IS NULL)
CREATE INDEX IF NOT EXISTS idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;

-- Update RLS policies to exclude deleted users from public access
-- Drop existing public read policy
DROP POLICY IF EXISTS "Allow public read access to users" ON users;

-- Create new policy that only shows non-deleted users
CREATE POLICY "Allow public read access to active users"
  ON users FOR SELECT
  USING (deleted_at IS NULL);

-- Keep the all operations policy for admin access
-- (Admin can see and manage deleted users)

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Soft delete migration complete!';
  RAISE NOTICE '✅ Added deleted_at column to users table';
  RAISE NOTICE '✅ Created indexes for performance';
  RAISE NOTICE '✅ Updated RLS policies to hide deleted users';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Run this SQL in Supabase SQL Editor';
END $$;
