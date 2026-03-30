# Listed By Feature - Admin Profile Attribution

## Overview
The "Listed By" feature allows tracking which admin created or manages each profile. This is essential when multiple admins (8+) are managing profiles, helping to distinguish and organize profiles by admin responsibility.

## Admin Names
The following admins are configured in the system:
- Mehdi
- Hmed
- Janah
- Jebbar
- Walid
- Amine
- Othman
- Youssef
- Abdo

## Database Schema

### Migration
Run the SQL migration file: `add_listed_by_migration.sql`

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS listed_by TEXT;

CREATE INDEX IF NOT EXISTS idx_users_listed_by ON users(listed_by);
```

This adds:
- `listed_by` column to store the admin name
- Index for efficient filtering by admin

## Features

### 1. Create Profile
When creating a new profile:
- **Required field**: "Listed By" dropdown
- Admins must select who is creating the profile
- Dropdown shows all configured admin names
- Value is saved to database

### 2. Edit Profile
When editing an existing profile:
- "Listed By" field is editable
- Can reassign profiles to different admins
- Shows current admin assignment
- Can be set to "Not assigned" if needed

### 3. Admin Dashboard
The dashboard table displays:
- **Listed By column**: Shows admin name in a green badge
- **Unassigned profiles**: Shows "Unassigned" in italic gray text
- **Badge styling**: Green accent color matching brand
- **Sortable**: Can be used for filtering (future enhancement)

### 4. Copy Profile
When copying a profile:
- The `listedBy` value is preserved from the original profile
- Copied profile maintains the same admin assignment

## User Interface

### Create Page
```
┌─────────────────────────────────────┐
│ Listed By *                         │
│ ┌─────────────────────────────────┐ │
│ │ Select admin...              ▼ │ │
│ └─────────────────────────────────┘ │
│ Select which admin is creating      │
│ this profile                        │
└─────────────────────────────────────┘
```

### Edit Page
```
┌─────────────────────────────────────┐
│ Listed By                           │
│ ┌─────────────────────────────────┐ │
│ │ Mehdi                        ▼ │ │
│ └─────────────────────────────────┘ │
│ Select which admin manages this     │
│ profile                             │
└─────────────────────────────────────┘
```

### Dashboard Table
```
┌──────────┬──────────┬────────────┬────────┬─────────┬─────────┐
│ Username │ Bio      │ Listed By  │ Clicks │ Created │ Actions │
├──────────┼──────────┼────────────┼────────┼─────────┼─────────┤
│ john     │ Bio...   │ [Mehdi]    │ 42     │ 1/29/26 │ [...]   │
│ jane     │ Bio...   │ [Hmed]     │ 15     │ 1/28/26 │ [...]   │
│ bob      │ Bio...   │ Unassigned │ 8      │ 1/27/26 │ [...]   │
└──────────┴──────────┴────────────┴────────┴─────────┴─────────┘
```

## Files Modified

### 1. Database
- `add_listed_by_migration.sql` - Migration script

### 2. Types
- `src/types/index.ts` - Added `listedBy?: string | null` to `UserPage`

### 3. Constants
- `src/lib/admins.ts` - Admin names configuration

### 4. Storage Layer
- `src/lib/storage.ts`:
  - Updated `saveUser()` to accept and save `listedBy`
  - Updated `readUsers()` to return `listedBy`
  - Updated `getUser()` to return `listedBy`
  - Updated `getDeletedUsers()` to return `listedBy`

### 5. API Routes
- `src/app/api/users/route.ts` - Accept `listedBy` in POST
- `src/app/api/users/copy/route.ts` - Preserve `listedBy` when copying

### 6. UI Pages
- `src/app/admin/create/page.tsx`:
  - Added "Listed By" dropdown (required)
  - Sends `listedBy` to API
  
- `src/app/admin/edit/[username]/page.tsx`:
  - Added "Listed By" dropdown (optional)
  - Loads and saves `listedBy`
  
- `src/app/admin/page.tsx`:
  - Added "Listed By" column to table
  - Displays admin name in badge or "Unassigned"

## Usage

### Creating a Profile
1. Navigate to `/admin/create`
2. Fill in username, profile picture, bio
3. **Select admin from "Listed By" dropdown** (required)
4. Add links
5. Click "Create User"

### Editing Admin Assignment
1. Navigate to `/admin`
2. Click edit icon for any profile
3. Change the "Listed By" dropdown
4. Click "Save Changes"

### Viewing Admin Assignments
1. Navigate to `/admin`
2. View the "Listed By" column
3. See which admin manages each profile

## Future Enhancements

### Possible Improvements
1. **Filter by Admin**: Add dropdown to filter profiles by admin
2. **Admin Statistics**: Show how many profiles each admin manages
3. **Bulk Assignment**: Assign multiple profiles to an admin at once
4. **Admin Dashboard**: Separate view for each admin's profiles
5. **Activity Log**: Track when admin assignments change
6. **Admin Colors**: Different badge colors for each admin
7. **Auto-assign**: Automatically assign to logged-in admin
8. **Admin Permissions**: Different permissions per admin

## Adding New Admins

To add a new admin to the list:

1. Open `src/lib/admins.ts`
2. Add the name to the `ADMIN_NAMES` array:
```typescript
export const ADMIN_NAMES = [
  'Mehdi',
  'Hmed',
  // ... existing names
  'NewAdmin', // Add here
] as const;
```
3. The new admin will automatically appear in all dropdowns

## Removing Admins

To remove an admin:

1. Remove from `src/lib/admins.ts`
2. Existing profiles with that admin will still show the name
3. Consider reassigning those profiles first

## Data Integrity

- **Nullable field**: `listedBy` can be NULL (unassigned)
- **No foreign key**: Admin names are stored as text, not IDs
- **Flexible**: Easy to add/remove admins without database changes
- **Backward compatible**: Existing profiles without `listedBy` show as "Unassigned"

## Testing

### Test Cases
- [ ] Create profile with admin selected
- [ ] Create profile without admin (should require selection)
- [ ] Edit profile and change admin
- [ ] Edit profile and set to "Not assigned"
- [ ] Copy profile (should preserve admin)
- [ ] View dashboard (should show admin badges)
- [ ] View unassigned profiles (should show "Unassigned")
- [ ] Add new admin to list
- [ ] Remove admin from list

---

**Status**: ✅ Implemented and Ready for Use
**Version**: 1.0
**Last Updated**: 2026-01-29
