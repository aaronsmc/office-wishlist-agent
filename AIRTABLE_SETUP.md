# Airtable Database Setup Guide

## Why Airtable?
Airtable is a free, reliable database service that will ensure your wishlist data persists across all devices and users.

## Setup Steps

### 1. Create Airtable Account
1. Go to [airtable.com](https://airtable.com)
2. Sign up for a free account
3. Create a new base called "Office Wishlist"

### 2. Create the Table
1. In your new base, create a table called "WishlistSubmissions"
2. Add these columns:
   - `userName` (Single line text)
   - `mustHaveItems` (Long text)
   - `niceToHaveItems` (Long text)
   - `preposterousWishes` (Long text)
   - `snackPreferences` (Long text)
   - `additionalComments` (Long text)

### 3. Get API Credentials
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a new personal access token
3. Copy the token (starts with `pat...`)
4. Go to [airtable.com/api](https://airtable.com/api)
5. Find your base ID (starts with `app...`)

### 4. Update the Code
Replace these values in `/src/services/AirtableService.tsx`:

```typescript
this.baseId = 'appYourBaseId'; // Replace with your base ID
this.apiKey = 'keyYourApiKey'; // Replace with your token
```

### 5. Test the Setup
1. Deploy to Vercel
2. Submit a wishlist
3. Check your Airtable base - you should see the data
4. Open the dashboard on a different device - data should appear

## Benefits
- ✅ **Free** - No cost for basic usage
- ✅ **Reliable** - Professional database service
- ✅ **Cross-device** - Works on all devices
- ✅ **Real-time** - Data updates immediately
- ✅ **Persistent** - Data never gets lost

## Alternative: Quick Test
If you want to test immediately without Airtable setup, the service will fall back to localStorage for now, but this won't work across devices.
