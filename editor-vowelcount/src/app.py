"""
app.py

A Flask-based server for vowel counting functionality.
Handles dynamic port assignment, error responses, and input validation.
"""

from flask import Flask, request, jsonify
from vowelcount import count_vowels  # Ensure correct path and file import
import os

# Configurable via environment variables
PORT = int(os.getenv("PORT", 4003))  # Increment port dynamically
HOST = "0.0.0.0"

# Create Flask app
app = Flask(__name__)

# Centralized error messages for maintainability
messages = {
    "missing_text": 'Missing "text" query parameter',
    "too_long": "Input exceeds the maximum allowed length of 10,000 characters",
    "internal_error": "Internal server error",
}


@app.route("/", methods=["GET"])
def count_vowels_endpoint():
    """
    GET endpoint to count vowels in a string.
    Handles asynchronous requests and provides clear error responses.

    Query Parameters:
        text (str): The input string to analyse.

    Returns:
        JSON: The response with the vowel count or error message.
    """
    output = {"error": False, "string": "", "answer": 0}

    try:
        # Set headers for response type and CORS
        response_headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }

        # Get query parameter
        text = request.args.get("text")

        # Validate 'text' parameter
        if text is None:
            return (
                jsonify(
                    {
                        **output,
                        "error": True,
                        "message": messages["missing_text"],
                    }
                ),
                400,
                response_headers,
            )

        # Validate input length (e.g., max 10,000 characters)
        if len(text) > 10000:
            return (
                jsonify(
                    {
                        **output,
                        "error": True,
                        "message": messages["too_long"],
                    }
                ),
                400,
                response_headers,
            )

        # Simulate an unexpected error for testing purposes
        if text == "simulate-error":
            raise Exception("Simulated unexpected error")

        # Count vowels using the vowelcount module
        answer = count_vowels(text)

        # Format successful response
        return (
            jsonify(
                {
                    **output,
                    "string": f"Contains {answer} vowels",
                    "answer": answer,
                }
            ),
            200,
            response_headers,
        )

    except Exception as err:
        # Handle unexpected server errors
        app.logger.error(f"Error occurred: {str(err)}")
        return (
            jsonify(
                {
                    **output,
                    "error": True,
                    "message": messages["internal_error"],
                }
            ),
            500,
        )


# Start the server
if __name__ == "__main__":
    app.run(host=HOST, port=PORT)