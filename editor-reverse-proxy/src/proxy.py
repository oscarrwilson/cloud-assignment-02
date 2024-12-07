from flask import Flask, jsonify, request, send_from_directory
import requests
import os
import json
import threading
import time

# Load configuration from config/config.json
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "../config/config.json")
try:
    with open(CONFIG_PATH) as config_file:
        config = json.load(config_file)
except FileNotFoundError:
    raise RuntimeError("config.json file not found at expected location")

# Static folder configuration
STATIC_FOLDER = config.get("static_folder", "../frontend/src")

# Initialize Flask app
app = Flask(__name__, static_folder=STATIC_FOLDER)

# Backend services and their URLs
services = config.get("services", {})

# Dynamic service discovery endpoint
@app.route("/services", methods=["GET"])
def list_services():
    """List all available services."""
    return jsonify({"services": services}), 200

# Dynamic addition of services
@app.route("/services", methods=["POST"])
def add_service():
    """Add a new service dynamically."""
    data = request.get_json()
    if not data or "name" not in data or "url" not in data:
        return jsonify({"error": "Service 'name' and 'url' are required"}), 400
    
    services[data["name"]] = data["url"]
    # Persist to config.json
    try:
        with open(CONFIG_PATH, "w") as config_file:
            config["services"] = services
            json.dump(config, config_file, indent=4)
    except Exception as e:
        return jsonify({"error": f"Failed to save service: {str(e)}"}), 500
    
    return jsonify({"message": f"Service '{data['name']}' added successfully"}), 201

# Dynamic deletion of services
@app.route("/services", methods=["DELETE"])
def delete_service():
    """Remove a service dynamically."""
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Service 'name' is required"}), 400
    if data["name"] not in services:
        return jsonify({"error": f"Service '{data['name']}' not found"}), 404

    del services[data["name"]]
    # Persist to config.json
    try:
        with open(CONFIG_PATH, "w") as config_file:
            config["services"] = services
            json.dump(config, config_file, indent=4)
    except Exception as e:
        return jsonify({"error": f"Failed to delete service: {str(e)}"}), 500

    return jsonify({"message": f"Service '{data['name']}' removed successfully"}), 200

# Periodically update services from environment variables
def update_services_from_env():
    """Periodically scan environment variables for service URLs and update the registry."""
    while True:
        updated = False
        for key, value in os.environ.items():
            if key.endswith("_URL"):
                service_name = key[:-4].lower()  # Strip '_URL' suffix and lowercase
                if service_name not in services or services[service_name] != value:
                    services[service_name] = value
                    updated = True
        # Persist updates to config.json if there are changes
        if updated:
            try:
                with open(CONFIG_PATH, "w") as config_file:
                    config["services"] = services
                    json.dump(config, config_file, indent=4)
            except Exception as e:
                print(f"Error saving services to config.json: {e}")
        time.sleep(30)  # Check every 30 seconds

# Proxy route for backend services
@app.route("/proxy/<service>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy(service):
    """Forward requests to the appropriate backend service."""
    if service not in services:
        return jsonify({"error": f"Service '{service}' not found"}), 404

    target_url = services[service]
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
        return response.text, response.status_code, response.headers.items()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request to service '{service}' failed: {str(e)}"}), 500

# Health check endpoint
@app.route("/health")
def health():
    """Health check endpoint for the proxy."""
    return jsonify({"status": "healthy"}), 200

# Serve static frontend files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve static files for the frontend."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Start the service discovery thread and Flask app
if __name__ == "__main__":
    threading.Thread(target=update_services_from_env, daemon=True).start()
    app.run(host="0.0.0.0", port=8080)