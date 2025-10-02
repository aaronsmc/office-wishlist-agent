// Test endpoint to verify Vercel Blob connection
const { put, list } = require('@vercel/blob');

export default async function handler(req, res) {
  console.log('Testing Vercel Blob connection...');
  console.log('Environment check:', {
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 15) + '...',
    nodeEnv: process.env.NODE_ENV
  });

  try {
    // Test writing to Blob
    const testData = {
      message: 'Hello from Vercel Blob!',
      timestamp: new Date().toISOString(),
      test: true,
      randomId: Math.random().toString(36).substr(2, 9)
    };

    console.log('Creating test blob...');
    const blob = await put('test-connection.json', JSON.stringify(testData, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });

    console.log('Blob created:', blob.url);

    // Test reading from Blob
    console.log('Listing blobs...');
    const blobs = await list({ prefix: 'test-connection.json' });
    console.log('Found blobs:', blobs.blobs.length);
    
    res.status(200).json({
      success: true,
      message: 'Vercel Blob connection successful!',
      blobUrl: blob.url,
      blobsFound: blobs.blobs.length,
      environment: process.env.NODE_ENV,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 15) + '...'
    });
  } catch (error) {
    console.error('Blob test error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Vercel Blob connection failed. Check your BLOB_READ_WRITE_TOKEN environment variable.',
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 15) + '...'
    });
  }
}
