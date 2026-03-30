-- ========================================================================
-- QUICK VERSION: Replace revibee.com with hoodfair.com
-- ========================================================================
-- This is a simplified version that does everything in one go.
-- Use this if you're confident and want to run it quickly.
-- ========================================================================

-- Preview what will change
SELECT 
  COUNT(*) AS links_to_update,
  COUNT(DISTINCT user_id) AS users_affected
FROM links
WHERE url LIKE '%revibee.com%';

-- Perform the update with transaction safety
BEGIN;

UPDATE links
SET 
  url = REPLACE(url, 'revibee.com', 'hoodfair.com'),
  updated_at = NOW()
WHERE url LIKE '%revibee.com%';

-- Verify the update
SELECT 
  COUNT(*) AS updated_links,
  COUNT(DISTINCT user_id) AS users_updated
FROM links
WHERE url LIKE '%hoodfair.com%';

-- Check no revibee links remain
SELECT COUNT(*) AS revibee_remaining
FROM links
WHERE url LIKE '%revibee.com%';

-- If everything looks good, commit:
COMMIT;

-- Show summary
SELECT 
  'Update Complete' AS status,
  COUNT(*) AS total_hoodfair_links
FROM links
WHERE url LIKE '%hoodfair.com%';
