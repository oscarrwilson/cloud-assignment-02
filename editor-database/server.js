const express = require('express');
const mongoose = require('mongoose');
const Text = require('./models/Text');

const app = express();
const port = 4007;

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/editor-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Endpoint to save text
app.post('/save', async (req, res) => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing text content' });
    }

    // Check length limits
    if (content.length > 5000) {
      return res.status(400).json({ error: 'Text content exceeds maximum length of 5000 characters' });
    }

    const newText = new Text({ content });
    await newText.save();

    res.status(201).json({
      message: 'Text saved successfully',
      id: newText.numericId,
    });
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to retrieve text by ID
app.get('/retrieve/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format (check for numeric ID)
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const text = await Text.findOne({ numericId });
    if (!text) {
      return res.status(404).json({ error: 'Text not found' });
    }

    res.json({
      message: 'Text retrieved successfully',
      content: text.content,
    });
  } catch (error) {
    console.error('Error retrieving text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});