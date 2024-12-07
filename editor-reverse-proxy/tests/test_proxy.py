# editor-reverse-proxy/tests/test_proxy.py

import json
import os
import sys
import pytest
import responses
from flask import Flask

# Adjust the path to import from src.proxy
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from proxy import app  # Import the Flask app from proxy.py


@pytest.fixture
def client():
    """
    Pytest fixture to create a test client for the Flask app.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint(client):
    """
    Test the /health endpoint returns a healthy status.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "healthy"


def test_list_services_initial(client):
    """
    Test listing services returns the expected default services from config.
    """
    response = client.get("/services")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "services" in data
    # Expected services as per the provided config.json
    expected_services = {
        "charcount",
        "wordcount",
        "vowelcount",
        "punctuationcount",
        "avgwordlength",
        "palindromedetection"
    }
    assert expected_services.issubset(set(data["services"]))


def test_add_service(client):
    """
    Test adding a new service dynamically.
    """
    new_service = {
        "name": "testservice",
        "url": "http://testservice:9999"
    }
    response = client.post("/services", json=new_service)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["message"] == "Service 'testservice' added successfully"

    # Verify the new service appears in the services list
    response = client.get("/services")
    data = json.loads(response.data)
    assert "testservice" in data["services"]


@responses.activate
def test_proxy_existing_service(client):
    """
    Test proxying requests to an existing service using a mocked response.
    """
    # Mock the response from the target service
    target_url = "http://charcount:4001"
    responses.add(
        responses.GET,
        target_url,
        json={"count": 42},
        status=200
    )

    # Make a request to the proxy
    response = client.get("/proxy/charcount")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["count"] == 42


def test_proxy_nonexistent_service(client):
    """
    Test proxying a non-existent service returns a 404 error.
    """
    response = client.get("/proxy/nonexistent")
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "error" in data
    assert "Service 'nonexistent' not found" in data["error"]