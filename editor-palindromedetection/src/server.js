import express from 'express';
import palindromecheck from './palindromecheck.js';

const app = express();
const PORT = process.env.PORT || 4006;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Application is running smoothly!',
        timestamp: new Date().toISOString(),
    });
});

// Palindrome-checking endpoint
app.get('/', async (req, res) => {
    const output = { error: false, string: '', answer: false };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const text = req.query.text;

        if (text === undefined) {
            return res.status(400).json({
                ...output,
                error: true,
                message: 'Missing "text" query parameter',
            });
        }

        // Simulate an error for testing purposes
        if (text === 'simulate-error') {
            throw new Error('Simulated unexpected error');
        }

        const answer = palindromecheck.isPalindrome(text);

        res.status(200).json({
            ...output,
            string: `Is the text a palindrome? ${answer}`,
            answer,
        });
    } catch (err) {
        console.error('Error occurred:', err.message || err);
        res.status(500).json({
            error: true,
            message: 'Internal server error',
        });
    }
});

// Start the server if executed directly
if (import.meta.url === `file://${process.cwd()}/src/server.js`) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app and server for tests
export { app };