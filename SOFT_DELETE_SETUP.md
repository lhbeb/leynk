# 🚀 Soft Delete Setup Guide

**Quick setup instructions for implementing the soft delete feature**

---

## Step 1: Run Database Migration

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `soft_delete_migration.sql`
4. Click **Run**
5. Wait for success message

**Expected Output:**
```
✅ Soft delete migration complete!
✅ Added deleted_at column to users table
✅ Created indexes for performance
✅ Updated RLS policies to hide deleted users
```

---

## Step 2: Verify Migration

Run this query in Supabase SQL Editor:

```sql
-- Check if deleted_at column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'deleted_at';
```

**Expected Result:**
```
column_name | data_type
deleted_at  | timestamp with time zone
```

---

## Step 3: Test the Feature

### Test Soft Delete

1. Go to `http://localhost:3000/admin`
2. Click on **Active Profiles** tab
3. Find a test user
4. Click the 🗑️ delete icon
5. Confirm deletion
6. User should move to **Deleted Profiles** tab
7. Visit the user's page: `http://localhost:3000/username`
8. Should show **404 Not Found**

### Test Recovery

1. Go to **Deleted Profiles** tab
2. Find the deleted user
3. Click the 🔄 recover icon
4. Confirm recovery
5. User should move back to **Active Profiles** tab
6. Visit the user's page: `http://localhost:3000/username`
7. Should show the **user profile** again

### Test Permanent Delete

1. Delete a test user (soft delete)
2. Go to **Deleted Profiles** tab
3. Click the ⚠️ permanent delete icon
4. Read the warning
5. Type "DELETE" to confirm
6. User should be **permanently removed**
7. Cannot be recovered

---

## Step 4: Verify Database State

### Check Active Users

```sql
SELECT username, deleted_at 
FROM users 
WHERE deleted_at IS NULL;
```

### Check Deleted Users

```sql
SELECT username, deleted_at 
FROM users 
WHERE deleted_at IS NOT NULL;
```

---

## ✅ Checklist

- [ ] SQL migration completed successfully
- [ ] `deleted_at` column exists in users table
- [ ] Indexes created for performance
- [ ] RLS policies updated
- [ ] Soft delete works (user moves to Deleted tab)
- [ ] User page shows 404 for deleted users
- [ ] Recovery works (user moves back to Active tab)
- [ ] User page accessible after recovery
- [ ] Permanent delete works
- [ ] Profile picture deleted on permanent delete
- [ ] Tab switching works in admin dashboard

---

## 🐛 Common Issues

### Issue: Migration fails with "column already exists"

**Solution:** The column already exists. Skip the migration or run:
```sql
-- Check if column exists first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
END $$;
```

### Issue: User page still shows after deletion

**Solution:** 
1. Clear browser cache
2. Verify `deleted_at` is set in database
3. Check RLS policies are active
4. Restart dev server

### Issue: Cannot see Deleted Profiles tab

**Solution:**
1. Refresh the admin dashboard
2. Check browser console for errors
3. Verify API route `/api/users/deleted` exists
4. Check network tab for failed requests

---

## 📚 Documentation

- **Full Documentation:** `SOFT_DELETE_SYSTEM.md`
- **Migration SQL:** `soft_delete_migration.sql`
- **API Routes:** `src/app/api/users/deleted/`, `recover/`, `permanent/`
- **Storage Functions:** `src/lib/storage.ts`

---

**Setup Version:** 1.0  
**Estimated Time:** 5-10 minutes
