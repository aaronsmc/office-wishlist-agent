# Environment Variable Setup

## Your Vercel Blob Token
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_wjdVz5quuxFty1gU_qG7PktGXWUT0eQiKFzcYONLm1gB5Sk
```

## Setup Steps

### 1. Add to Vercel Dashboard
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: `vercel_blob_rw_wjdVz5quuxFty1gU_qG7PktGXWUT0eQiKFzcYONLm1gB5Sk`
   - **Environment**: Production, Preview, Development (select all)

### 2. Add to Local Development
Create a `.env.local` file in your project root with:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_wjdVz5quuxFty1gU_qG7PktGXWUT0eQiKFzcYONLm1gB5Sk
```

### 3. Deploy
1. Push your code to GitHub
2. Vercel will automatically deploy with the environment variable
3. Your app will now use Vercel Blob for data persistence

## Test the Setup
1. Deploy to Vercel
2. Submit a wishlist on one device
3. Open the dashboard on another device
4. Data should appear immediately!

## Troubleshooting
- **Token not working?** Make sure it's added to all environments in Vercel
- **Data not persisting?** Check the Vercel function logs
- **API errors?** Verify the token is correct and has proper permissions
