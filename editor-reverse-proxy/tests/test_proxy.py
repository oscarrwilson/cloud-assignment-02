import sys
import os
import json
import responses
import requests
import unittest
from unittest.mock import patch
from flask import Flask
from proxy import app

# Adjust the path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))


class TestProxy(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up shared test client and mock configuration path."""
        app.testing = True
        cls.client = app.test_client()
        cls.mock_config = os.path.abspath(
            os.path.join(os.path.dirname(__file__), '../config/config.json')
        )

    @responses.activate
    def test_proxy_existing_service(self):
        """Test proxying GET requests to an existing service."""
        target_url = "http://charcount:4001"
        responses.add(
            responses.GET,
            target_url,
            json={"count": 42},
            status=200
        )

        with patch('proxy.CONFIG_PATH', self.mock_config):
            response = self.client.get("/proxy/charcount")
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertEqual(data["count"], 42)

    def test_proxy_nonexistent_service(self):
        """Test proxying a non-existent service returns a 404 error."""
        with patch('proxy.CONFIG_PATH', self.mock_config):
            response = self.client.get("/proxy/nonexistent")
            self.assertEqual(response.status_code, 404)
            data = json.loads(response.data)
            self.assertIn("error", data)
            self.assertIn("Service 'nonexistent' not found", data["error"])

    @responses.activate
    def test_proxy_backend_failure(self):
        """Test proxying when the backend service fails."""
        target_url = "http://charcount:4001"
        responses.add(
            responses.GET,
            target_url,
            body=requests.exceptions.ConnectionError("Failed to connect"),
        )

        with patch('proxy.CONFIG_PATH', self.mock_config):
            response = self.client.get("/proxy/charcount")
            self.assertEqual(response.status_code, 500)
            data = json.loads(response.data)
            self.assertIn("error", data)
            self.assertIn("Request to service 'charcount' failed", data["error"])

    @responses.activate
    def test_proxy_existing_service_post(self):
        """Test proxying POST requests to an existing service."""
        target_url = "http://charcount:4001"
        responses.add(
            responses.POST,
            target_url,
            json={"status": "success"},
            status=200
        )

        with patch('proxy.CONFIG_PATH', self.mock_config):
            response = self.client.post("/proxy/charcount", json={"text": "hello"})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertEqual(data["status"], "success")


if __name__ == "__main__":
    unittest.main()