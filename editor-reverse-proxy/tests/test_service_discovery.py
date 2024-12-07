# editor-reverse-proxy/tests/test_service_discovery.py

import json
import os
from unittest import mock
import pytest

def test_update_services_from_env(mock_config, tmp_path):
    """
    Test the update_services_from_env function updates services based on environment variables.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)), \
         mock.patch.dict(os.environ, {
             "NEW_SERVICE_URL": "http://newservice:1234",
             "CHARCOUNT_URL": "http://charcount-updated:4001"
         }):
        # Initial services
        with open(mock_config, "w") as f:
            json.dump({
                "static_folder": "/app/frontend/src",
                "services": {
                    "charcount": "http://charcount:4001",
                    "wordcount": "http://wordcount:80",
                }
            }, f, indent=4)

        # Mock time.sleep to prevent actual waiting
        with mock.patch('proxy.time.sleep', side_effect=KeyboardInterrupt):
            try:
                proxy.update_services_from_env()
            except KeyboardInterrupt:
                pass

        # Verify the services have been updated
        with open(mock_config) as f:
            config_data = json.load(f)
        assert config_data["services"]["charcount"] == "http://charcount-updated:4001"
        assert config_data["services"]["new_service"] == "http://newservice:1234"


def test_service_discovery_thread(mock_config):
    """
    Integration test to ensure that the service discovery thread updates services based on environment variables.
    """
    with mock.patch('proxy.CONFIG_PATH', str(mock_config)), \
         mock.patch('proxy.update_services_from_env') as mock_update, \
         mock.patch('proxy.threading.Thread') as mock_thread:
        # Start the app (without actually running the server)
        with pytest.raises(SystemExit):
            with mock.patch('proxy.app.run', side_effect=SystemExit):
                proxy.app.run(host="0.0.0.0", port=8080, debug=False)

        # Ensure the update_services_from_env thread is started
        mock_thread.assert_called_with(target=proxy.update_services_from_env, daemon=True)
        mock_thread.return_value.start.assert_called_once()
