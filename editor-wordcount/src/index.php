<?php
declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';  // Autoload dependencies (via Composer)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow CORS for all origins

// Error messages
const MESSAGES = [
    'missingText' => 'Missing "text" parameter',
    'tooLong' => 'Input exceeds the maximum allowed length of 10,000 characters',
    'internalError' => 'Internal server error'
];

/**
 * Count the number of words in the given text.
 */
function getWordCountResponse(string $text): array
{
    try {
        $wordCount = wordcount($text);  // Assuming wordcount() is in WordCount.php
        return [
            'success' => true,
            'wordCount' => $wordCount,
            'description' => "The text contains {$wordCount} words.",
        ];
    } catch (InvalidArgumentException $e) {
        return [
            'success' => false,
            'error' => $e->getMessage(),
        ];
    }
}

/**
 * Handle the incoming API request.
 */
function handleRequest(): void
{
    // Get the "text" query parameter or POST body parameter
    $text = $_GET['text'] ?? ($_POST['text'] ?? null);

    if ($text === null) {
        http_response_code(400);  // Missing "text" parameter
        echo json_encode([
            'success' => false,
            'error' => MESSAGES['missingText'],
        ]);
        return;
    }

    // Check if the text is empty after trimming
    $text = trim($text);

    if (empty($text)) {
        http_response_code(400);  // Fixed to 400 for empty string
        echo json_encode([
            'success' => false,
            'error' => 'The "text" parameter cannot be empty.',
        ]);
        return;
    }

    // Check if the text exceeds the length limit (10,000 characters)
    if (strlen($text) > 10000) {
        http_response_code(400);  // Bad Request for too long text
        echo json_encode([
            'success' => false,
            'error' => MESSAGES['tooLong'],
        ]);
        return;
    }

    // Handle the special case where the input is 'simulate-error'
    if ($text === 'simulate-error') {
        http_response_code(500);  // Internal Server Error
        echo json_encode([
            'success' => false,
            'error' => MESSAGES['internalError'],
        ]);
        return;
    }

    // Get word count and return response
    $response = getWordCountResponse($text);
    http_response_code($response['success'] ? 200 : 400);  // 200 for success, 400 for error
    echo json_encode($response);
}

// Process the incoming request
try {
    handleRequest();
} catch (Exception $e) {
    // Catch any unexpected errors and return a 500 response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error: ' . $e->getMessage(),
    ]);
}