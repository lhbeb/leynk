# Deployment Guide - Leynk

This guide will help you deploy Leynk to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub/GitLab/Bitbucket account (to connect your repository)
- Supabase project set up (see `SUPABASE_SETUP.md`)

## Step 1: Prepare Your Repository

1. Make sure all your code is committed to git:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project

## Step 3: Environment Variables (Optional)

Since all credentials are hardcoded in this project, you don't need to set environment variables. However, if you want to use environment variables in the future, you can set them in:

- **Vercel Dashboard**: Project Settings → Environment Variables

## Step 4: Configure Node.js Version

Vercel will automatically use Node.js 20.x based on the `engines` field in `package.json`. If you need to specify a different version, you can:

1. Go to Project Settings → General
2. Set Node.js Version to 20.x

## Step 5: Verify Deployment

1. After deployment, visit your Vercel URL
2. Test the home page
3. Test the admin login:
   - Go to `https://your-domain.vercel.app/admin/login`
   - Login with: `elmahboubimehdi@gmail.com` / `Localserver!!2`
4. Test creating a user page
5. Test viewing a user page

## Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `leynk.co`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 24 hours)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation: `npm run build`

### API Routes Not Working

- Check that API routes are in `src/app/api/` directory
- Verify function timeout settings in `vercel.json`
- Check Vercel function logs for errors

### Database Connection Issues

- Verify Supabase URL and anon key are correct in `src/lib/supabase.ts`
- Check Supabase dashboard for connection issues
- Verify RLS policies are set correctly

### Image Upload Issues

- Verify storage bucket exists in Supabase
- Check bucket is set to Public
- Verify storage policies allow public uploads

## Production Checklist

- [x] Build completes without errors
- [x] All TypeScript types are correct
- [x] API routes are properly configured
- [x] Environment variables are set (if needed)
- [x] Custom domain is configured (if needed)
- [x] SSL certificate is active (automatic with Vercel)
- [x] Database is properly set up
- [x] Storage bucket is configured
- [x] Admin login works
- [x] User pages are accessible
- [x] Analytics tracking works
- [x] Telegram notifications work

## Performance Tips

1. **Enable Edge Functions** (optional): For better performance, you can use Vercel Edge Functions for API routes
2. **Image Optimization**: Next.js automatically optimizes images
3. **Caching**: Vercel automatically caches static pages
4. **CDN**: All assets are served via Vercel's global CDN

## Monitoring

- **Vercel Analytics**: Enable in Project Settings → Analytics
- **Logs**: View function logs in Vercel Dashboard → Logs
- **Performance**: Monitor in Vercel Dashboard → Analytics

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

