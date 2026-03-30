-- ========================================================================
-- Replace happydeel.com with hoodfair.com in all links
-- ========================================================================
-- This script updates all links in the database that contain "happydeel.com"
-- and replaces it with "hoodfair.com" while preserving the path/slug.
--
-- Example:
--   https://happydeel.com/product/xyz → https://hoodfair.com/product/xyz
--   http://happydeel.com/item123 → http://hoodfair.com/item123
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
  REPLACE(url, 'happydeel.com', 'hoodfair.com') AS new_url,
  created_at
FROM links
WHERE url LIKE '%happydeel.com%'
ORDER BY created_at DESC;

-- Review this list carefully before proceeding!

-- ========================================================================
-- STEP 2: COUNT - See how many links will be affected
-- ========================================================================

SELECT 
  COUNT(*) AS total_links_to_update,
  COUNT(DISTINCT user_id) AS affected_users
FROM links
WHERE url LIKE '%happydeel.com%';

-- ========================================================================
-- STEP 3: UPDATE - Replace happydeel.com with hoodfair.com
-- ========================================================================

BEGIN;

UPDATE links
SET 
  url = REPLACE(url, 'happydeel.com', 'hoodfair.com'),
  updated_at = NOW()
WHERE url LIKE '%happydeel.com%';

-- Check the results
SELECT 
  COUNT(*) AS updated_links,
  'Links updated successfully' AS status
FROM links
WHERE url LIKE '%hoodfair.com%';

-- ========================================================================
-- STEP 4: VERIFY - Ensure no happydeel.com links remain
-- ========================================================================

SELECT 
  COUNT(*) AS remaining_happydeel_links,
  'Should be 0' AS expected
FROM links
WHERE url LIKE '%happydeel.com%';

-- ========================================================================
-- STEP 5: COMMIT
-- ========================================================================

-- If everything looks good, COMMIT the transaction:
COMMIT;

-- If something looks wrong, ROLLBACK instead:
-- ROLLBACK;

-- ========================================================================
-- FINAL SUMMARY
-- ========================================================================

SELECT 
  'Migration Complete' AS status,
  COUNT(*) AS total_hoodfair_links,
  NOW() AS completed_at
FROM links
WHERE url LIKE '%hoodfair.com%';
