# 🔐 Authentication System

Leynk includes a secure authentication system to protect the admin dashboard.

## Admin Credentials

**Email:** `elmahboubimehdi@gmail.com`  
**Password:** `Localserver!!2`

⚠️ **Security Note:** These are hardcoded credentials for demonstration. For production, implement a proper authentication system with hashed passwords and environment variables.

## How It Works

### Session Management
- Uses browser `sessionStorage` to maintain login state
- Session persists only during the browser session
- Automatically cleared when browser is closed

### Protected Routes
The following routes require authentication:
- `/admin` - Admin Dashboard
- `/admin/create` - Create User Page
- `/admin/edit/[username]` - Edit User Page

### Public Routes
- `/` - Home Page
- `/admin/login` - Login Page
- `/[username]` - User Profile Pages

## User Flow

### 1. Login Process
1. Navigate to `/admin` or any protected route
2. Automatically redirected to `/admin/login` if not authenticated
3. Enter credentials:
   - Email: `elmahboubimehdi@gmail.com`
   - Password: `Localserver!!2`
4. Click "Sign In"
5. Redirected to admin dashboard on success

### 2. Session Active
- Access all admin features
- Create, edit, and delete user pages
- Upload profile pictures
- Manage links

### 3. Logout Process
1. Click the "Logout" button in the admin header
2. Confirm logout
3. Session cleared and redirected to login page

## Features

### Login Page (`/admin/login`)
- ✅ Modern, clean UI design
- ✅ Email and password fields with icons
- ✅ Password visibility toggle
- ✅ Loading state during authentication
- ✅ Error messages for invalid credentials
- ✅ Responsive design
- ✅ Link back to home page

### Security Features
- ✅ Protected routes with AuthGuard component
- ✅ Automatic redirect to login if not authenticated
- ✅ Session validation on route access
- ✅ Logout confirmation dialog
- ✅ Password field masking

### Admin Dashboard
- ✅ Logout button in header
- ✅ Session persists across page refreshes
- ✅ Clean logout flow

## Technical Implementation

### Files Created/Modified

**New Files:**
- `src/lib/auth.ts` - Authentication utilities
- `src/components/AuthGuard.tsx` - Route protection component
- `src/app/admin/login/page.tsx` - Login page

**Modified Files:**
- `src/app/admin/page.tsx` - Added AuthGuard and logout
- `src/app/admin/create/page.tsx` - Added AuthGuard
- `src/app/admin/edit/[username]/page.tsx` - Added AuthGuard

### Authentication Functions

```typescript
// Validate credentials
validateCredentials(email: string, password: string): boolean

// Set session
setSession(): void

// Clear session
clearSession(): void

// Check authentication
isAuthenticated(): boolean
```

## Changing Credentials

To change the admin credentials, edit `src/lib/auth.ts`:

```typescript
const ADMIN_EMAIL = 'your-new-email@example.com';
const ADMIN_PASSWORD = 'YourNewPassword123!';
```

## Production Recommendations

For a production environment, consider:

1. **Database Authentication:** Store user credentials in Supabase with bcrypt hashing
2. **Environment Variables:** Move credentials to `.env.local`
3. **JWT Tokens:** Use JSON Web Tokens for stateless authentication
4. **Supabase Auth:** Leverage Supabase's built-in authentication
5. **Multi-Admin Support:** Allow multiple admin users with roles
6. **Password Reset:** Implement forgot password functionality
7. **2FA:** Add two-factor authentication
8. **Rate Limiting:** Prevent brute force attacks
9. **Audit Logs:** Track admin actions

## Troubleshooting

### Can't Login
- Verify email and password are correct
- Check browser console for errors
- Clear browser cache and try again

### Auto-logout
- SessionStorage is cleared when browser closes
- Normal behavior for security

### Access Denied
- Ensure you're logged in
- Try logging out and back in
- Check if sessionStorage is enabled in browser

## Security Best Practices

✅ **DO:**
- Use strong passwords
- Logout when done
- Keep credentials private
- Update credentials regularly

❌ **DON'T:**
- Share admin credentials
- Use public computers without logging out
- Store passwords in plain text
- Commit credentials to version control

---

**Current Status:** ✅ Authentication system fully implemented and operational

