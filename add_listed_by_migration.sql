-- ============================================================================
-- Add "listed_by" column to track which admin created each profile
-- ============================================================================

-- Add the listed_by column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS listed_by TEXT;

-- Add index for filtering by admin
CREATE INDEX IF NOT EXISTS idx_users_listed_by ON users(listed_by);

-- Add comment to document the column
COMMENT ON COLUMN users.listed_by IS 'Name of the admin who created/listed this profile';

-- ============================================================================
-- Migration Complete!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE '✅ Added listed_by column to users table';
  RAISE NOTICE '✅ Created index on listed_by column';
  RAISE NOTICE '';
  RAISE NOTICE 'ℹ️  Existing profiles will have NULL for listed_by';
  RAISE NOTICE 'ℹ️  You can update them manually or they will be set when edited';
END $$;
