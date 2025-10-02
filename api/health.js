// Vercel serverless function for health check
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
}
