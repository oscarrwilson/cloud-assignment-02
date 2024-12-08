import sys
import os
import unittest
import json

# Ensure the src directory is in the import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from proxy import app  # Import the Flask app

class TestHealthEndpoint(unittest.TestCase):
    """
    Unit tests for the /health endpoint.
    """

    @classmethod
    def setUpClass(cls):
        """
        Set up the Flask test client.
        """
        app.testing = True
        cls.client = app.test_client()

    def test_health_endpoint(self):
        """
        Test the /health endpoint to ensure the service reports healthy status.
        """
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200, "Expected status code 200 for /health")
        data = json.loads(response.data)
        self.assertEqual(data.get("status"), "healthy", "Expected status 'healthy' in response data")

if __name__ == "__main__":
    unittest.main()