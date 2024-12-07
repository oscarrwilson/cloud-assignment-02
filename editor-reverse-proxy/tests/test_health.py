# editor-reverse-proxy/tests/test_health.py

import json

def test_health_endpoint(client):
    """
    Test the /health endpoint returns a healthy status.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "healthy"