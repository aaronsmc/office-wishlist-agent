const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper function to read submissions
const readSubmissions = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write submissions
const writeSubmissions = (submissions) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
};

// Routes

// Get all submissions
app.get('/api/submissions', (req, res) => {
  try {
    const submissions = readSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// Add new submission
app.post('/api/submissions', (req, res) => {
  try {
    const submissions = readSubmissions();
    const newSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...req.body
    };
    
    submissions.push(newSubmission);
    writeSubmissions(submissions);
    
    res.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// Delete a submission
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const submissions = readSubmissions();
    const filteredSubmissions = submissions.filter(sub => sub.id !== req.params.id);
    
    if (filteredSubmissions.length < submissions.length) {
      writeSubmissions(filteredSubmissions);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Submission not found' });
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// Clear all submissions
app.delete('/api/submissions', (req, res) => {
  try {
    writeSubmissions([]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing submissions:', error);
    res.status(500).json({ error: 'Failed to clear submissions' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📁 Data stored in: ${DATA_FILE}`);
});
