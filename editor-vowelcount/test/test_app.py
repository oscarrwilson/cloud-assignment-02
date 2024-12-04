"""
Integration tests for app.py
"""
import os
import pytest
from src.app import app  # Corrected import

# Set environment variables for testing
os.environ["PORT"] = "5000"  # Avoid conflicts with other services

@pytest.fixture
def client():
    """
    Pytest fixture to provide a test client for the Flask app.
    """
    with app.test_client() as client:
        yield client


def test_valid_input(client):
    """
    Test the API with valid input.
    """
    response = client.get("/", query_string={"text": "hello world"})
    assert response.status_code == 200
    assert response.json == {
        "error": False,
        "string": "Contains 3 vowels",
        "answer": 3,
    }


def test_empty_string(client):
    """
    Test the API with an empty string.
    """
    response = client.get("/", query_string={"text": ""})
    assert response.status_code == 200
    assert response.json == {
        "error": False,
        "string": "Contains 0 vowels",
        "answer": 0,
    }


def test_missing_input(client):
    """
    Test the API with missing 'text' query parameter.
    """
    response = client.get("/")
    assert response.status_code == 400
    assert response.json["message"] == 'Missing "text" query parameter'


def test_exceeding_length(client):
    """
    Test the API with input exceeding the length limit.
    """
    long_text = "a" * 10001
    response = client.get("/", query_string={"text": long_text})
    assert response.status_code == 400
    assert response.json["message"] == "Input exceeds the maximum allowed length of 10,000 characters"


def test_maximum_length(client):
    """
    Test the API with input at the maximum allowed length.
    """
    max_length_text = "a" * 10000
    response = client.get("/", query_string={"text": max_length_text})
    assert response.status_code == 200
    assert response.json["answer"] == 10000


def test_invalid_query_parameters(client):
    """
    Test the API with invalid query parameters.
    """
    response = client.get("/", query_string={"invalidParam": "test"})
    assert response.status_code == 400
    assert response.json["message"] == 'Missing "text" query parameter'


def test_simulated_error(client):
    """
    Test the API for an unexpected server error.
    """
    response = client.get("/", query_string={"text": "simulate-error"})
    assert response.status_code == 500
    assert response.json["message"] == "Internal server error"


def test_cors_headers(client):
    """
    Test if the response includes CORS headers.
    """
    response = client.get("/", query_string={"text": "hello"})
    assert response.headers["Access-Control-Allow-Origin"] == "*"


def test_nonexistent_endpoint(client):
    """
    Test a non-existent endpoint.
    """
    response = client.get("/nonexistent")
    assert response.status_code == 404


def test_sequential_requests(client):
    """
    Test handling of sequential requests without delays.
    """
    request_count = 5
    text = "sequential test"
    expected_vowels = 6  # Vowels in "sequential test"

    responses = [client.get("/", query_string={"text": text}) for _ in range(request_count)]

    for response in responses:
        assert response.status_code == 200
        assert response.json["answer"] == expected_vowels