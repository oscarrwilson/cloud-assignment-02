<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class IndexTest extends TestCase
{
    private $url = "http://localhost:4002";  // Replace with your correct server URL

    /**
     * Helper method to make API requests and return the response
     */
    private function makeRequest(string $url, string $method = 'GET', array $data = []): array
    {
        $ch = curl_init($url);
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);  // Get header information
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);  // Set request method (GET or POST)

        // For POST, attach the data
        if ($method === 'POST' && !empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }

        $response = curl_exec($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Extract the body from the response
        $body = substr($response, strpos($response, "\r\n\r\n") + 4);
        return [
            'status_code' => $status_code,
            'body' => json_decode($body, true),
        ];
    }

    /**
     * Test that valid text returns the correct word count.
     */
    public function testValidTextReturnsWordCount(): void
    {
        $response = $this->makeRequest("{$this->url}/?text=Hello+world");

        $this->assertEquals(200, $response['status_code']);
        $this->assertTrue($response['body']['success']);
        $this->assertEquals(2, $response['body']['wordCount']);
    }

    /**
     * Test that missing 'text' parameter returns an error.
     */
    public function testMissingTextParameter(): void
    {
        $response = $this->makeRequest("{$this->url}/");

        $this->assertEquals(400, $response['status_code']);
        $this->assertFalse($response['body']['success']);
        $this->assertEquals('Missing "text" parameter', $response['body']['error']);
    }

    /**
     * Test that empty text returns an error.
     */
    public function testEmptyTextParameter(): void
    {
        $response = $this->makeRequest("{$this->url}/?text=");

        $this->assertEquals(400, $response['status_code']);  // Fixed to 400 for empty text
        $this->assertFalse($response['body']['success']);
        $this->assertEquals('The "text" parameter cannot be empty.', $response['body']['error']);
    }

    /**
     * Test that text exceeding the 10,000 character limit returns an error.
     */
    public function testTextExceedsLengthLimit(): void
    {
        $text = str_repeat('a', 10001);
    
        // Send as POST request to handle the long text properly
        $response = $this->makeRequest("{$this->url}/", 'POST', ['text' => $text]);
    
        // Ensure the server returns the correct error response for long input
        $this->assertEquals(400, $response['status_code']);
        $this->assertFalse($response['body']['success']);
        $this->assertEquals('Input exceeds the maximum allowed length of 10,000 characters', $response['body']['error']);
    }    

    /**
     * Test that the special case 'simulate-error' returns an internal server error.
     */
    public function testSimulateError(): void
    {
        $response = $this->makeRequest("{$this->url}/?text=simulate-error");

        $this->assertEquals(500, $response['status_code']);
        $this->assertFalse($response['body']['success']);
        $this->assertEquals('Internal server error', $response['body']['error']);
    }

    /**
     * Test that a valid, but different text returns the correct word count.
     */
    public function testValidDifferentText(): void
    {
        $response = $this->makeRequest("{$this->url}/?text=This+is+a+test");

        $this->assertEquals(200, $response['status_code']);
        $this->assertTrue($response['body']['success']);
        $this->assertEquals(4, $response['body']['wordCount']);
    }
}
