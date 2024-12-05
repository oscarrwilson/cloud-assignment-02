import express from 'express';
import charcount from './charcount.js'; // Ensure correct path and file extension

const PORT = process.env.PORT || 4001; // Configurable via env variable
const HOST = '0.0.0.0';
const app = express();

// Centralized error messages for maintainability
const messages = {
  missingText: 'Missing "text" query parameter',
  tooLong: 'Input exceeds the maximum allowed length of 10,000 characters',
  internalError: 'Internal server error',
};

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Application is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET endpoint to count characters in a string.
 * Handles asynchronous requests and provides clear error responses.
 */
app.get('/', async (req, res) => {
  const output = { error: false, string: '', answer: 0 };

  // Set headers for response type and CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const text = req.query.text;

    // Validate 'text' parameter
    if (text === undefined) {
      return res.status(400).json({
        ...output,
        error: true,
        message: messages.missingText,
      });
    }

    // Validate input length (e.g., max 10,000 characters)
    if (text.length > 10000) {
      return res.status(400).json({
        ...output,
        error: true,
        message: messages.tooLong,
      });
    }

    // Simulate an unexpected error for testing purposes
    if (text === 'simulate-error') {
      throw new Error('Simulated unexpected error');
    }

    // Count characters using the charcount module
    const answer = charcount.counter(text);

    // Format successful response
    res.status(200).json({
      ...output,
      string: `Contains ${answer} characters`,
      answer,
    });
  } catch (err) {
    // Handle unexpected server errors
    console.error('Error occurred:', err.message || err);
    res.status(500).json({
      ...output,
      error: true,
      message: messages.internalError,
    });
  }
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

export default app; // Export app for testing