-- ========================================================================
-- QUICK: Replace happydeel.com with hoodfair.com
-- ========================================================================

-- Preview what will change
SELECT 
  COUNT(*) AS links_to_update,
  COUNT(DISTINCT user_id) AS users_affected
FROM links
WHERE url LIKE '%happydeel.com%';

-- Run the update
BEGIN;

UPDATE links
SET 
  url = REPLACE(url, 'happydeel.com', 'hoodfair.com'),
  updated_at = NOW()
WHERE url LIKE '%happydeel.com%';

-- Verify
SELECT 
  COUNT(*) AS updated_links,
  'Success' AS status
FROM links
WHERE url LIKE '%hoodfair.com%';

-- Check none remain
SELECT COUNT(*) AS happydeel_remaining FROM links WHERE url LIKE '%happydeel.com%';

COMMIT;
