-- ============================================================================
-- Add "theme" column to users table
-- ============================================================================

-- Add the theme column with a default value of 'standard'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'standard';

-- Add comment to document the column
COMMENT ON COLUMN users.theme IS 'The visual theme ID for the user profile (standard, minimal, dark, neon, glass)';

-- ============================================================================
-- Migration Complete!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE '✅ Added theme column to users table';
END $$;
