# editor-reverse-proxy/tests/test_services.py

import json
from unittest import mock

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
            "palindromedetection"
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

        # Verify persistence to config.json
        with open(mock_config) as f:
            config_data = json.load(f)
        assert "testservice" in config_data["services"]
        assert config_data["services"]["testservice"] == "http://testservice:9999"


def test_add_service_missing_fields(client, mock_config):
    """
    Test adding a new service with missing 'name' or 'url' fields.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        # Missing 'name'
        new_service = {
            "url": "http://testservice:9999"
        }
        response = client.post("/services", json=new_service)
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data
        assert "Service 'name' and 'url' are required" in data["error"]

        # Missing 'url'
        new_service = {
            "name": "testservice"
        }
        response = client.post("/services", json=new_service)
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data
        assert "Service 'name' and 'url' are required" in data["error"]