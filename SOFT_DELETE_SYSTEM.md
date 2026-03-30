# 🗑️ Soft Delete System Documentation

**Feature:** Deleted Profiles Management  
**Version:** 1.0  
**Date:** January 29, 2026

---

## 📋 Overview

The Leynk admin dashboard now includes a **soft delete system** that prevents permanent data loss when deleting user profiles. Instead of permanently removing users from the database, deleted profiles are moved to a "Deleted Profiles" section where they can be recovered or permanently deleted by the super admin.

---

## ✨ Features

### 1. **Soft Delete (Default)**
- When admin clicks "Delete" on a user profile
- User is NOT removed from database
- `deleted_at` timestamp is set
- User page shows 404 error to public visitors
- Profile remains accessible in admin dashboard under "Deleted Profiles" tab

### 2. **Deleted Profiles Tab**
- Separate tab in admin dashboard
- Shows all deleted profiles with deletion date
- Profiles can be recovered or permanently deleted
- No analytics shown for deleted profiles

### 3. **Recovery System**
- Super admin can recover deleted profiles
- One-click recovery process
- Restores profile to active state
- User page becomes accessible again

### 4. **Permanent Delete**
- Super admin can permanently delete profiles
- Requires double confirmation
- Removes all data from database
- Deletes profile picture from storage
- Cannot be undone

---

## 🎯 User Experience

### For Public Visitors

**Active Profile:**
```
leynk.co/username → Shows user profile page
```

**Deleted Profile:**
```
leynk.co/username → Shows 404 Not Found page
```

### For Admin Users

**Active Profiles Tab:**
- View all active user profiles
- See analytics (clicks, views)
- Edit, delete, or view profiles
- Copy profile links

**Deleted Profiles Tab:**
- View all deleted profiles
- See deletion date
- Recover or permanently delete
- No analytics shown

---

## 🔧 Technical Implementation

### Database Schema

**Added Column:**
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
```

**Indexes:**
```sql
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;
```

**RLS Policy Update:**
```sql
-- Only show non-deleted users to public
CREATE POLICY "Allow public read access to active users"
  ON users FOR SELECT
  USING (deleted_at IS NULL);
```

### API Routes

#### 1. **GET /api/users**
- Returns only active users (deleted_at IS NULL)
- Used by Active Profiles tab

#### 2. **GET /api/users/deleted**
- Returns only deleted users (deleted_at IS NOT NULL)
- Used by Deleted Profiles tab

#### 3. **DELETE /api/users?username={username}**
- Soft deletes user (sets deleted_at timestamp)
- Does NOT remove from database

#### 4. **POST /api/users/recover**
- Recovers deleted user (sets deleted_at to NULL)
- Restores profile to active state

#### 5. **DELETE /api/users/permanent?username={username}**
- Permanently deletes user from database
- Removes profile picture from storage
- Requires double confirmation

### Storage Functions

```typescript
// Get active users only
readUsers(): Promise<UserPage[]>

// Get deleted users only
getDeletedUsers(): Promise<UserPage[]>

// Soft delete user
deleteUser(username: string): Promise<boolean>

// Recover deleted user
recoverUser(username: string): Promise<boolean>

// Permanently delete user
permanentlyDeleteUser(username: string): Promise<boolean>

// Get user (returns null if deleted)
getUser(username: string): Promise<UserPage | null>
```

---

## 📊 Admin Dashboard

### Layout

```
┌─────────────────────────────────────────────────┐
│  Active Users: 25  │  Deleted: 3  │  + Create  │
├─────────────────────────────────────────────────┤
│  [Active Profiles]  │  [Deleted Profiles]       │
├─────────────────────────────────────────────────┤
│  Username  │  Bio  │  Clicks  │  Created  │ ⚙️  │
│  john_doe  │  ...  │   150    │  Jan 15   │ ⚙️  │
│  jane_doe  │  ...  │   200    │  Jan 20   │ ⚙️  │
└─────────────────────────────────────────────────┘
```

### Actions

**Active Profiles:**
- 📊 View Analytics
- 📋 Copy Link
- 👁️ View Page
- ✏️ Edit Profile
- 🗑️ Delete (soft delete)

**Deleted Profiles:**
- 🔄 Recover Profile
- ⚠️ Permanently Delete

---

## 🔒 Security & Permissions

### Public Access
- ❌ Cannot see deleted profiles
- ❌ Deleted profiles return 404
- ✅ Can only access active profiles

### Admin Access
- ✅ Can see all profiles (active + deleted)
- ✅ Can soft delete profiles
- ✅ Can recover deleted profiles
- ✅ Can permanently delete profiles

### Database Level
- RLS policies enforce deleted_at filtering
- Public queries automatically exclude deleted users
- Admin queries can access all users

---

## 🚀 Usage Guide

### Deleting a Profile

1. Go to Admin Dashboard
2. Click **Active Profiles** tab
3. Find the user to delete
4. Click the 🗑️ delete icon
5. Confirm deletion
6. User moves to **Deleted Profiles** tab
7. User page shows 404 to public

### Recovering a Profile

1. Go to Admin Dashboard
2. Click **Deleted Profiles** tab
3. Find the user to recover
4. Click the 🔄 recover icon
5. Confirm recovery
6. User moves back to **Active Profiles** tab
7. User page becomes accessible again

### Permanently Deleting a Profile

1. Go to Admin Dashboard
2. Click **Deleted Profiles** tab
3. Find the user to permanently delete
4. Click the ⚠️ permanent delete icon
5. Read the warning carefully
6. Type "DELETE" to confirm
7. User is permanently removed
8. **This action cannot be undone!**

---

## ⚠️ Important Notes

### Soft Delete Behavior

**What Happens:**
- ✅ User record stays in database
- ✅ All links preserved
- ✅ All analytics preserved
- ✅ Profile picture preserved
- ❌ User page returns 404
- ❌ Not shown in active users list
- ❌ Not included in analytics stats

**What Doesn't Happen:**
- ❌ Data is NOT deleted
- ❌ Profile picture NOT removed
- ❌ Links NOT removed
- ❌ Analytics NOT removed

### Permanent Delete Behavior

**What Happens:**
- ✅ User record removed from database
- ✅ All links deleted (CASCADE)
- ✅ All analytics deleted (CASCADE)
- ✅ Profile picture deleted from storage
- ❌ **Cannot be recovered**
- ❌ **All data lost forever**

---

## 🔄 Migration Guide

### For Existing Installations

1. **Run SQL Migration:**
   ```bash
   # In Supabase SQL Editor, run:
   soft_delete_migration.sql
   ```

2. **Verify Migration:**
   ```sql
   -- Check if column exists
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'users' 
   AND column_name = 'deleted_at';
   ```

3. **Test Functionality:**
   - Delete a test user
   - Verify 404 on user page
   - Check Deleted Profiles tab
   - Recover the user
   - Verify user page works again

---

## 📈 Analytics Impact

### Active Users
- ✅ Analytics tracked normally
- ✅ Page views counted
- ✅ Link clicks counted
- ✅ Stats shown in dashboard

### Deleted Users
- ❌ No new analytics tracked
- ✅ Historical analytics preserved
- ❌ Not included in total stats
- ❌ Page views return 404

---

## 🐛 Troubleshooting

### User page still shows after deletion
- Check if deleted_at is set in database
- Verify RLS policies are active
- Clear browser cache
- Check getUser() function returns null

### Cannot recover user
- Verify user exists in deleted users
- Check deleted_at is not null
- Verify API route is accessible
- Check browser console for errors

### Permanent delete fails
- Verify user exists in database
- Check profile picture URL is valid
- Verify storage permissions
- Check cascade delete is working

---

## 📝 Code Examples

### Check if User is Deleted

```typescript
const user = await getUser('username');
if (!user) {
  // User is deleted or doesn't exist
  return <NotFoundPage />;
}
```

### Get Deleted Users

```typescript
const deletedUsers = await getDeletedUsers();
console.log(`Found ${deletedUsers.length} deleted profiles`);
```

### Soft Delete User

```typescript
const success = await deleteUser('username');
if (success) {
  console.log('User soft deleted');
}
```

### Recover User

```typescript
const success = await recoverUser('username');
if (success) {
  console.log('User recovered');
}
```

### Permanent Delete

```typescript
const success = await permanentlyDeleteUser('username');
if (success) {
  console.log('User permanently deleted');
}
```

---

## 🎨 UI Components

### Tab Styling

**Active Tab:**
- Green background (#17803d)
- White text
- Users icon

**Deleted Tab:**
- Red background (#dc2626)
- White text
- Trash icon

### Action Buttons

**Recover:**
- Green hover state
- Refresh icon
- "Recover user profile" tooltip

**Permanent Delete:**
- Red hover state
- Trash icon
- "Permanently delete (cannot be undone)" tooltip

---

## 🔮 Future Enhancements

### Potential Features

1. **Auto-Purge:**
   - Automatically permanently delete profiles after X days
   - Configurable purge period
   - Email notification before purge

2. **Bulk Operations:**
   - Recover multiple profiles at once
   - Permanently delete multiple profiles
   - Export deleted profiles data

3. **Audit Log:**
   - Track who deleted profiles
   - Track who recovered profiles
   - Track permanent deletions

4. **Deletion Reason:**
   - Add reason field for deletion
   - Show reason in Deleted Profiles tab
   - Filter by deletion reason

5. **Scheduled Deletion:**
   - Schedule profile deletion for future date
   - Cancel scheduled deletions
   - Email reminders

---

## ✅ Testing Checklist

- [ ] SQL migration runs successfully
- [ ] Deleted users show 404 on public pages
- [ ] Deleted users appear in Deleted Profiles tab
- [ ] Active users appear in Active Profiles tab
- [ ] Soft delete moves user to Deleted tab
- [ ] Recover moves user back to Active tab
- [ ] Permanent delete removes user completely
- [ ] Profile picture deleted on permanent delete
- [ ] Analytics preserved on soft delete
- [ ] RLS policies work correctly
- [ ] Confirmation dialogs work
- [ ] Tab switching works smoothly

---

**Documentation Version:** 1.0  
**Last Updated:** January 29, 2026  
**Status:** ✅ Implemented and Ready for Use
