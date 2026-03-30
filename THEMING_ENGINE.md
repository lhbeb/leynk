# Theming Engine Feature

## Overview
The Theming Engine allows admins to select distinct visual themes for each user profile. This transforms the look and feel of the profile page without any code changes.

## Available Themes

| Theme | ID | Description |
|-------|----|-------------|
| **Standard** | `standard` | The classic Leynk look with mint green accents. |
| **Minimalist** | `minimal` | Clean, stark white and black. High contrast. |
| **Midnight** | `dark` | Sleek dark mode for night owls. |
| **Neon Night** | `neon` | Cyberpunk inspired with glowing pink/purple effects. |
| **Glassmorphism** | `glass` | Modern frosted glass effect over a colorful gradient. |

## How to Use

### 1. Database Migration (Required)
You must run the migration script to add the `theme` column to your database:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'standard';
```

Or run the included file: `add_theme_migration.sql`

### 2. Creating a Profile
1. Go to **Create User**.
2. Fill in details as usual.
3. Select a **Profile Theme** from the dropdown.
4. Create.

### 3. Editing a Profile
1. Go to **Edit** for any user.
2. Change the **Profile Theme** dropdown.
3. Save changes.
4. View the public profile to see the new look!

## Technical Details

- **Storage**: Theme ID is stored in the `users` table as a string.
- **Styling**: Tailwind CSS classes are dynamically injected based on the theme configuration in `src/lib/themes.ts`.
- **Extensibility**: To add a new theme, simply add a new entry to the `THEMES` object in `src/lib/themes.ts`.

## Files Modified
- `src/lib/themes.ts` (New)
- `src/types/index.ts`
- `src/lib/storage.ts`
- `src/app/api/users/route.ts` & `copy/route.ts`
- `src/app/admin/create/page.tsx`
- `src/app/admin/edit/[username]/page.tsx`
- `src/app/[username]/page.tsx`
- `src/components/LinkCard.tsx`
