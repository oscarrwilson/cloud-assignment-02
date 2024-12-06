from flask import Flask, request, jsonify, make_response
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load initial configuration from file
CONFIG_FILE = "config.json"
try:
    with open(CONFIG_FILE, "r") as f:
        endpoints = json.load(f)
except FileNotFoundError:
    endpoints = {}


# Health Check Endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


# Dynamic Proxy Endpoint
@app.route("/proxy/<service>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy(service):
    if service not in endpoints:
        return jsonify({"error": f"Service '{service}' not found"}), 404

    # Get target URL from config
    target_url = endpoints[service]

    # Forward the request to the backend service
    try:
        response = requests.request(
            method=request.method,
            url=target_url,
            headers=request.headers,
            params=request.args,
            data=request.data,
        )
        # Pass the backend response back to the client
        return make_response((response.content, response.status_code, response.headers.items()))
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to reach service '{service}': {str(e)}"}), 500


# Service Discovery Endpoint
@app.route("/discovery", methods=["GET"])
def service_discovery():
    return jsonify(list(endpoints.keys()))


# Dynamic Configuration Endpoint
@app.route("/config", methods=["POST"])
def update_config():
    global endpoints
    new_config = request.json
    endpoints.update(new_config)

    # Save updated configuration to file
    with open(CONFIG_FILE, "w") as f:
        json.dump(endpoints, f)

    return jsonify({"message": "Configuration updated successfully", "config": endpoints})


# Add CORS Headers for All Responses
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response


# Main
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)