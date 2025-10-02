// Vercel serverless function for handling submissions with Blob storage
const { put, del, list } = require('@vercel/blob');

// Blob filename for storing submissions
const BLOB_FILENAME = 'wishlist-submissions.json';

// Helper functions for Vercel Blob
const readSubmissions = async () => {
  try {
    console.log('Reading submissions from Blob...');
    
    // List all blobs with our filename
    const blobs = await list({ prefix: BLOB_FILENAME });
    console.log('Found blobs:', blobs.blobs.length);
    
    if (blobs.blobs.length === 0) {
      console.log('No existing submissions found');
      return [];
    }
    
    // Get the most recent blob
    const latestBlob = blobs.blobs[0];
    console.log('Fetching blob from:', latestBlob.url);
    
    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      console.error('Failed to fetch blob:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log('Retrieved submissions:', data.length);
    return data || [];
  } catch (error) {
    console.error('Error reading from Blob:', error);
    return [];
  }
};

const writeSubmissions = async (submissions) => {
  try {
    console.log('Writing submissions to Blob:', submissions.length);
    
    const blob = await put(BLOB_FILENAME, JSON.stringify(submissions, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    
    console.log('Successfully saved to Blob:', blob.url);
    console.log('Blob size:', JSON.stringify(submissions).length, 'bytes');
    
    return blob;
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

  console.log(`API Request: ${req.method} ${req.url}`);
  console.log('Environment check:', {
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 10) + '...'
  });

  try {
    switch (req.method) {
      case 'GET':
        console.log('Getting all submissions...');
        const submissions = await readSubmissions();
        console.log('Returning submissions:', submissions.length);
        res.status(200).json(submissions);
        break;

      case 'POST':
        console.log('Creating new submission:', req.body);
        const newSubmission = {
          id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          ...req.body
        };
        
        console.log('New submission created:', newSubmission.id);
        
        const allSubmissions = await readSubmissions();
        console.log('Current submissions count:', allSubmissions.length);
        
        allSubmissions.push(newSubmission);
        console.log('Updated submissions count:', allSubmissions.length);
        
        const blob = await writeSubmissions(allSubmissions);
        console.log('Blob created successfully:', blob.url);
        
        res.status(200).json({ success: true, submission: newSubmission, blobUrl: blob.url });
        break;

      case 'DELETE':
        if (req.query.id) {
          console.log('Deleting submission:', req.query.id);
          const submissions = await readSubmissions();
          const filteredSubmissions = submissions.filter(sub => sub.id !== req.query.id);
          await writeSubmissions(filteredSubmissions);
          res.status(200).json({ success: true });
        } else {
          console.log('Clearing all submissions');
          await writeSubmissions([]);
          res.status(200).json({ success: true });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}
