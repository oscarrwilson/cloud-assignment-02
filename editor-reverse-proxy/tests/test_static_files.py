# editor-reverse-proxy/tests/test_static_files.py
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import json
from unittest import mock

def test_serve_frontend_root(client, mock_config, tmp_path):
    """
    Test serving the frontend's index.html when accessing root.
    """
    # Create a temporary index.html
    frontend_dir = tmp_path / "frontend" / "src"
    frontend_dir.mkdir(parents=True)
    index_file = frontend_dir / "index.html"
    index_content = "<html><body><h1>Home</h1></body></html>"
    index_file.write_text(index_content)

    with mock.patch('proxy.CONFIG_PATH', str(mock_config)), \
         mock.patch('proxy.STATIC_FOLDER', str(frontend_dir)):
        response = client.get("/")
        assert response.status_code == 200
        assert response.data.decode() == index_content


def test_serve_frontend_existing_file(client, mock_config, tmp_path):
    """
    Test serving an existing static file.
    """
    # Create a temporary static file
    frontend_dir = tmp_path / "frontend" / "src"
    frontend_dir.mkdir(parents=True)
    static_file = frontend_dir / "about.html"
    static_content = "<html><body><h1>About</h1></body></html>"
    static_file.write_text(static_content)

    with mock.patch('proxy.CONFIG_PATH', str(mock_config)), \
         mock.patch('proxy.STATIC_FOLDER', str(frontend_dir)):
        response = client.get("/about.html")
        assert response.status_code == 200
        assert response.data.decode() == static_content


def test_serve_frontend_nonexistent_file(client, mock_config, tmp_path):
    """
    Test serving index.html when accessing a non-existent static file.
    """
    # Create a temporary index.html
    frontend_dir = tmp_path / "frontend" / "src"
    frontend_dir.mkdir(parents=True)
    index_file = frontend_dir / "index.html"
    index_content = "<html><body><h1>Home</h1></body></html>"
    index_file.write_text(index_content)

    with mock.patch('proxy.CONFIG_PATH', str(mock_config)), \
         mock.patch('proxy.STATIC_FOLDER', str(frontend_dir)):
        response = client.get("/nonexistent.html")
        assert response.status_code == 200
        assert response.data.decode() == index_content
