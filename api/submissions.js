// Vercel serverless function for handling submissions with Blob storage
const { put, del, list } = require('@vercel/blob');

// Blob filename for storing submissions
const BLOB_FILENAME = 'wishlist-submissions.json';

// Helper functions for Vercel Blob
const readSubmissions = async () => {
  try {
    // Try to get the blob
    const blobs = await list({ prefix: BLOB_FILENAME });
    if (blobs.blobs.length === 0) {
      return [];
    }
    
    const response = await fetch(blobs.blobs[0].url);
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error reading from Blob:', error);
    return [];
  }
};

const writeSubmissions = async (submissions) => {
  try {
    const blob = await put(BLOB_FILENAME, JSON.stringify(submissions, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    console.log('Saved to Blob:', blob.url);
  } catch (error) {
    console.error('Error writing to Blob:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const submissions = await readSubmissions();
        res.status(200).json(submissions);
        break;

      case 'POST':
        const newSubmission = {
          id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          ...req.body
        };
        
        const allSubmissions = await readSubmissions();
        allSubmissions.push(newSubmission);
        await writeSubmissions(allSubmissions);
        
        res.status(200).json({ success: true, submission: newSubmission });
        break;

      case 'DELETE':
        if (req.query.id) {
          // Delete specific submission
          const submissions = await readSubmissions();
          const filteredSubmissions = submissions.filter(sub => sub.id !== req.query.id);
          await writeSubmissions(filteredSubmissions);
          res.status(200).json({ success: true });
        } else {
          // Clear all submissions
          await writeSubmissions([]);
          res.status(200).json({ success: true });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
