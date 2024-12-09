// server.js
const express = require('express');
const mongoose = require('mongoose');
const Text = require('./models/Text');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 4007;

app.set('trust proxy', true);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  headers: true,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later."
    });
  }
});
app.use(limiter);

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://mongodb:27017/editor-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

app.post('/save', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing text content' });
    }

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

app.get('/retrieve/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'ERROR', error: 'Health check failed' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;