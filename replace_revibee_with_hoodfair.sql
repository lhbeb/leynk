-- ========================================================================
-- Replace revibee.com with hoodfair.com in all links
-- ========================================================================
-- This script updates all links in the database that contain "revibee.com"
-- and replaces it with "hoodfair.com" while preserving the path/slug.
--
-- Example:
--   https://revibee.com/product/xyz → https://hoodfair.com/product/xyz
--   http://revibee.com/item123 → http://hoodfair.com/item123
--
-- Created: 2026-02-12
-- ========================================================================

-- ========================================================================
-- STEP 1: PREVIEW - Check what will be changed
-- ========================================================================

SELECT 
  id,
  user_id,
  title,
  url AS current_url,
  REPLACE(url, 'revibee.com', 'hoodfair.com') AS new_url,
  created_at
FROM links
WHERE url LIKE '%revibee.com%'
ORDER BY created_at DESC;

-- This shows you all the links that will be affected.
-- Review this list carefully before proceeding!

-- ========================================================================
-- STEP 2: COUNT - See how many links will be affected
-- ========================================================================

SELECT 
  COUNT(*) AS total_links_to_update,
  COUNT(DISTINCT user_id) AS affected_users
FROM links
WHERE url LIKE '%revibee.com%';

-- ========================================================================
-- STEP 3: BACKUP - Create a backup of affected links (optional but recommended)
-- ========================================================================

-- Create a temporary backup table
CREATE TEMP TABLE links_backup AS
SELECT * FROM links
WHERE url LIKE '%revibee.com%';

-- Verify backup was created
SELECT COUNT(*) AS backed_up_links FROM links_backup;

-- ========================================================================
-- STEP 4: UPDATE - Replace revibee.com with hoodfair.com
-- ========================================================================

-- Start transaction for safety
BEGIN;

-- Perform the update
UPDATE links
SET 
  url = REPLACE(url, 'revibee.com', 'hoodfair.com'),
  updated_at = NOW()
WHERE url LIKE '%revibee.com%';

-- Check the results
SELECT 
  id,
  user_id,
  title,
  url AS updated_url,
  updated_at
FROM links
WHERE url LIKE '%hoodfair.com%'
ORDER BY updated_at DESC;

-- ========================================================================
-- STEP 5: VERIFY - Ensure no revibee.com links remain
-- ========================================================================

SELECT COUNT(*) AS remaining_revibee_links
FROM links
WHERE url LIKE '%revibee.com%';

-- This should return 0 if successful

-- ========================================================================
-- STEP 6: COMMIT OR ROLLBACK
-- ========================================================================

-- If everything looks good, COMMIT the transaction:
COMMIT;

-- If something looks wrong, ROLLBACK instead:
-- ROLLBACK;

-- ========================================================================
-- STEP 7: FINAL VERIFICATION
-- ========================================================================

-- Count of hoodfair links (should match the original revibee count)
SELECT COUNT(*) AS total_hoodfair_links
FROM links
WHERE url LIKE '%hoodfair.com%';

-- Show sample of updated links
SELECT 
  id,
  user_id,
  title,
  url,
  updated_at
FROM links
WHERE url LIKE '%hoodfair.com%'
ORDER BY updated_at DESC
LIMIT 10;

-- ========================================================================
-- CLEANUP (Optional)
-- ========================================================================

-- Drop the temporary backup table if no longer needed
-- DROP TABLE IF EXISTS links_backup;

-- ========================================================================
-- SUMMARY REPORT
-- ========================================================================

SELECT 
  'Migration Complete' AS status,
  (SELECT COUNT(*) FROM links WHERE url LIKE '%hoodfair.com%') AS hoodfair_links,
  (SELECT COUNT(*) FROM links WHERE url LIKE '%revibee.com%') AS revibee_links_remaining,
  NOW() AS completed_at;
