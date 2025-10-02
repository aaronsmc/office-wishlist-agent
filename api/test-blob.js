// Test endpoint to verify Vercel Blob connection
const { put, list } = require('@vercel/blob');

export default async function handler(req, res) {
  try {
    // Test writing to Blob
    const testData = {
      message: 'Hello from Vercel Blob!',
      timestamp: new Date().toISOString(),
      test: true
    };

    const blob = await put('test-connection.json', JSON.stringify(testData, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });

    // Test reading from Blob
    const blobs = await list({ prefix: 'test-connection.json' });
    
    res.status(200).json({
      success: true,
      message: 'Vercel Blob connection successful!',
      blobUrl: blob.url,
      blobsFound: blobs.blobs.length,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Blob test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Vercel Blob connection failed. Check your BLOB_READ_WRITE_TOKEN environment variable.'
    });
  }
}
