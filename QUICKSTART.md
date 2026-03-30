# 🚀 Leynk Quick Start Guide

Get your Leynk application up and running in minutes!

## 📋 Prerequisites

- Node.js 18 or higher
- A Supabase account (free tier is perfect)

## ⚡ Quick Setup

### Step 1: Install Dependencies

```bash
cd "/Users/elma777boubi/Downloads/Leynk.co"
npm install
```

### Step 2: Set Up Supabase (5 minutes)

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Login and click "New Project"
   - Name it "Leynk" and wait for it to initialize

2. **Run SQL to Create Tables**
   - In your Supabase dashboard, go to **SQL Editor**
   - Copy and paste the SQL from `SUPABASE_SETUP.md` (the "Create Database Tables" section)
   - Click "Run" to create your tables

3. **Create Storage Bucket**
   - Go to **Storage** in the sidebar
   - Click "New Bucket"
   - Name: `profile-pictures`
   - Make it **Public**
   - Click "Create"

> **Note:** Supabase credentials are already hardcoded in the project. No environment variables needed!

### Step 3: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 What's Next?

1. **Visit the Home Page**: [http://localhost:3000](http://localhost:3000)
2. **Login to Admin**: Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - Email: `elmahboubimehdi@gmail.com`
   - Password: `Localserver!!2`
3. **Create Your First User**: Click "Create New User" and fill in the details
4. **View the User Page**: Visit `http://localhost:3000/yourusername`

📖 See [AUTHENTICATION.md](./AUTHENTICATION.md) for complete authentication details.

## 🎨 Creating a User Page

1. Username: Only letters, numbers, and underscores (e.g., `john_doe`)
2. Profile Picture: Upload an image or paste a URL
3. Bio: Write a short description
4. Links: Add as many links as you want with titles and URLs
5. Click "Create User"

Your page will be live at `leynk.co/username`!

## 🔧 Troubleshooting

### "Failed to upload file"
- Check that the `profile-pictures` bucket exists in Supabase Storage
- Make sure it's set to **Public**
- Verify the storage policies were created (see SUPABASE_SETUP.md)

### "User not found" or database errors
- Verify you ran the SQL to create tables
- Check the tables exist in **Database** > **Tables** in Supabase

## 📚 More Information

- Full setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Project details: [README.md](./README.md)

## 🎉 You're Ready!

Your Leynk application is now running with:
- ✅ Beautiful, modern design
- ✅ Admin dashboard for management
- ✅ Database-backed storage
- ✅ Profile picture uploads
- ✅ Dynamic user pages

Have fun building your link-in-bio pages! 🚀

