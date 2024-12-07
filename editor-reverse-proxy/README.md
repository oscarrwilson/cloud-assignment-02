
# Editor Reverse Proxy

## Overview
This is a custom reverse proxy for the editor system. It dynamically routes requests to backend services and supports service discovery.

## Setup and Run
1. Clone the repository.
2. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
3. Access the proxy at `http://localhost:8080`.

## API Endpoints
- **/services**:
  - `GET`: List all services.
  - `POST`: Add a new service.
  - `DELETE`: Remove a service.
- **/proxy/<service_name>**:
  - Routes requests to the specified backend service.

## Dynamic Configuration Test with Curl
1. **Add a new service**:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "charcount_4008", "url": "http://charcount:4008"}' http://localhost:8080/services
   ```
2. **List all services**:
   ```bash
   curl http://localhost:8080/services
   ```
3. **Route a request to the new service**:
   ```bash
   curl http://localhost:8080/proxy/charcount_4008?text=Hello
   ```
4. **Delete the service**:
   ```bash
   curl -X DELETE -H "Content-Type: application/json" -d '{"name": "charcount_4008"}' http://localhost:8080/services
   ```

## Tests
Run the test suite with:
```bash
pytest
```

## CI Pipeline
Tests are automated using GitHub Actions. See `.github/workflows/ci.yml` for details.