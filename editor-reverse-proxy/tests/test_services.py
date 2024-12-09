import sys
import os
import json
from unittest import mock

# Adjust path to include source directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

def test_list_services_initial(client, mock_config):
    """
    Test listing services returns the expected default services from config.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        response = client.get("/services")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "services" in data
        expected_services = {
            "charcount",
            "wordcount",
            "vowelcount",
            "punctuationcount",
            "avgwordlength",
            "palindromedetection",
            "text-service"
        }
        assert expected_services.issubset(set(data["services"]))


def test_add_service_success(client, mock_config):
    """
    Test adding a new service successfully.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        new_service = {
            "name": "testservice",
            "url": "http://testservice:9999"
        }
        response = client.post("/services", json=new_service)
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["message"] == "Service 'testservice' added successfully"

        # Verify the service now appears in the list
        response = client.get("/services")
        data = json.loads(response.data)
        assert "testservice" in data["services"]


def test_add_duplicate_service(client, mock_config):
    """
    Test adding a duplicate service.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        new_service = {
            "name": "testservice",
            "url": "http://testservice:9999"
        }
        client.post("/services", json=new_service)

        # Add the same service again
        response = client.post("/services", json=new_service)
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data
        assert "already exists" in data["error"]


def test_delete_service_success(client, mock_config):
    """
    Test deleting an existing service successfully.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        new_service = {
            "name": "testservice",
            "url": "http://testservice:9999"
        }
        client.post("/services", json=new_service)

        # Delete the service
        response = client.delete("/services", json={"name": "testservice"})
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["message"] == "Service 'testservice' removed successfully"

        # Verify the service no longer appears in the list
        response = client.get("/services")
        data = json.loads(response.data)
        assert "testservice" not in data["services"]


def test_delete_nonexistent_service(client, mock_config):
    """
    Test deleting a non-existent service.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        response = client.delete("/services", json={"name": "invalidservice"})
        assert response.status_code == 404
        data = json.loads(response.data)
        assert "error" in data
        assert "not found" in data["error"]


def test_list_services_after_env_update(client, mock_config):
    """
    Test that services updated via environment variables are reflected in /services.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        os.environ["TEXT_SERVICE_URL"] = "http://text-service:4007"

        # Trigger environment-based updates
        response = client.get("/services")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "text-service" in data["services"]
        assert data["services"]["text-service"] == "http://text-service:4007"
