# Vercel Deployment Guide for office-wishlist-agent

## 🚀 Step-by-Step Vercel Deployment

### 1. Push to GitHub (Manual Step)
Since GitHub authentication is needed, please run these commands in your terminal:

```bash
# Push your code to GitHub
git push -u origin main
```

If you get authentication errors, you can either:
- Use GitHub CLI: `gh auth login`
- Use personal access token
- Or create the repository manually on GitHub first

### 2. Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**: `aaronsmc/office-wishlist-agent`
5. **Configure the project**:
   - Framework Preset: **Vite**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

### 3. Add Environment Variables

In the Vercel project settings, add these environment variables:

**Environment Variables to Add:**
```
VITE_SUPABASE_URL = https://ripfwvogosrfcrvreoby.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_iLJ6JQChZ6vdxUf8CP98rQ_UP8Z5gvd
```

**How to add them:**
1. Go to your project dashboard on Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in the sidebar
4. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://ripfwvogosrfcrvreoby.supabase.co`
   - Environment: Production, Preview, Development (select all)
5. Repeat for the anon key
6. Click **Save**

### 4. Deploy!

1. **Click "Deploy"** in Vercel
2. **Wait for deployment** (usually 1-2 minutes)
3. **Get your live URL** (e.g., `https://office-wishlist-agent.vercel.app`)

### 5. Test Your Deployment

1. **Visit your live URL**
2. **Submit a wishlist form**
3. **Check the Dashboard** - should show data from Supabase
4. **Test on different devices** - data should sync

## 🎯 What You'll Get

- ✅ **Live URL** - Share with your office team
- ✅ **Cross-device sync** - Works on any device
- ✅ **Data persistence** - Stored in Supabase
- ✅ **Automatic deployments** - Updates when you push to GitHub
- ✅ **Production optimized** - Fast loading times

## 🔧 Troubleshooting

**If deployment fails:**
- Check that environment variables are set correctly
- Ensure GitHub repository is public or you've granted Vercel access
- Check Vercel build logs for any errors

**If app doesn't work:**
- Verify Supabase database schema is created
- Check browser console for errors
- Ensure environment variables are set in Vercel

## 📱 Your App Features

- **Office Wishlist Form** - Submit must-have items, nice-to-haves, etc.
- **Dashboard** - View all submissions from your team
- **Cross-device sync** - Access from phone, tablet, computer
- **Real-time updates** - Changes appear immediately
- **Data persistence** - No data loss

Your office wishlist app will be live and ready for your team to use! 🎉
