# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key

## 3. Set Up Environment Variables

Create a `.env` file in your project root with:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Create the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-wishlist-schema.sql`
3. Click "Run" to execute the SQL

This will create the `wishlist_submissions` table with the proper structure and permissions.

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Submit a wishlist form to test the database integration
3. Check the Dashboard to see if submissions are being stored and retrieved from Supabase

## Database Schema

The `wishlist_submissions` table includes:
- `id` (UUID, primary key)
- `created_at` (timestamp)
- `user_name` (text)
- `must_have_items` (text)
- `nice_to_have_items` (text)
- `preposterous_wishes` (text)
- `snack_preferences` (text array)
- `additional_comments` (text)

## Features

✅ **Cross-device sync**: Submissions are stored in Supabase and accessible from any device
✅ **Real-time updates**: Changes are immediately reflected across all connected devices
✅ **Data persistence**: No more data loss when clearing browser storage
✅ **Scalable**: Can handle multiple users and large amounts of data
✅ **Secure**: Row Level Security (RLS) policies protect your data

## Troubleshooting

- Make sure your environment variables are correctly set
- Check that the database schema has been created successfully
- Verify your Supabase project is active and accessible
- Check the browser console for any error messages
