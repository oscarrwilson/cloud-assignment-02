from flask import Flask, jsonify, request, send_from_directory
import requests  # Ensure this is imported for backend requests
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__, static_folder="/app/frontend/src")

# Backend services and their URLs
services = {
    "charcount": os.getenv("CHARCOUNT_URL"),
    "wordcount": os.getenv("WORDCOUNT_URL"),
    "vowelcount": os.getenv("VOWELCOUNT_URL"),
    "punctuationcount": os.getenv("PUNCTUATIONCOUNT_URL"),
    "avgwordlength": os.getenv("AVGWORDLENGTH_URL"),
    "palindromedetection": os.getenv("PALINDROMEDETECTION_URL"),
}

# Proxy route for backend services
@app.route("/proxy/<service>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy(service):
    if service not in services:
        return jsonify({"error": f"Service '{service}' not found"}), 404

    target_url = services[service]  # Get the service URL from the mapping
    try:
        # Forward the request to the corresponding backend service
        response = requests.request(
            method=request.method,
            url=target_url,
            headers={key: value for key, value in request.headers if key != "Host"},
            data=request.get_data(),
            params=request.args,
        )
        # Return the backend's response to the client
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request to service '{service}' failed: {str(e)}"}), 500

# Health check endpoint
@app.route("/health")
def health():
    return jsonify({"status": "healthy"}), 200

# Serve static frontend files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)