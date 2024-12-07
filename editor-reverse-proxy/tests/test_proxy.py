# editor-reverse-proxy/tests/test_proxy.py

import json
import responses
import requests

def test_proxy_existing_service(client, mock_config):
    """
    Test proxying GET requests to an existing service using a mocked response.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        target_url = "http://charcount:4001"
        responses.add(
            responses.GET,
            target_url,
            json={"count": 42},
            status=200
        )

        response = client.get("/proxy/charcount")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["count"] == 42


def test_proxy_nonexistent_service(client, mock_config):
    """
    Test proxying a non-existent service returns a 404 error.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        response = client.get("/proxy/nonexistent")
        assert response.status_code == 404
        data = json.loads(response.data)
        assert "error" in data
        assert "Service 'nonexistent' not found" in data["error"]


@responses.activate
def test_proxy_backend_failure(client, mock_config):
    """
    Test proxying when the backend service fails (e.g., connection error).
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        target_url = "http://charcount:4001"
        responses.add(
            responses.GET,
            target_url,
            body=requests.exceptions.ConnectionError("Failed to connect"),
        )

        response = client.get("/proxy/charcount")
        assert response.status_code == 500
        data = json.loads(response.data)
        assert "error" in data
        assert "Request to service 'charcount' failed" in data["error"]


@responses.activate
def test_proxy_existing_service_post(client, mock_config):
    """
    Test proxying POST requests to an existing service using a mocked response.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)):
        target_url = "http://charcount:4001"
        responses.add(
            responses.POST,
            target_url,
            json={"status": "success"},
            status=200
        )

        response = client.post("/proxy/charcount", json={"text": "hello"})
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"