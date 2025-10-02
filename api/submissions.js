// Vercel serverless function for handling submissions with KV storage
const { kv } = require('@vercel/kv');

// Key for storing submissions in Vercel KV
const SUBMISSIONS_KEY = 'wishlist_submissions';

// Helper functions for Vercel KV
const readSubmissions = async () => {
  try {
    const submissions = await kv.get(SUBMISSIONS_KEY);
    return submissions || [];
  } catch (error) {
    console.error('Error reading from KV:', error);
    return [];
  }
};

const writeSubmissions = async (submissions) => {
  try {
    await kv.set(SUBMISSIONS_KEY, submissions);
  } catch (error) {
    console.error('Error writing to KV:', error);
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
