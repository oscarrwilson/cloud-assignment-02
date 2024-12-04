Editor-AvgWordLength Service

This microservice calculates the average word length of a given text input.

## Features
- Calculates the average word length, excluding non-alphabetic characters.
- Supports Unicode characters, emojis, and special characters.
- Exposes an HTTP endpoint for easy integration.

## Project Structure
- `cmd/`: Entry point for the application (`server.go`).
- `internal/avgwordlength/`: Core logic for calculating the average word length.
- `api/handler.go`: HTTP handler for processing requests.
- `tests/`: Unit and integration tests.

## Getting Started

### Prerequisites
- Docker installed on your system.
- Go 1.21 installed if running locally without Docker.

### Running with Docker
1. Build the Docker image:
   ```
   docker build -t editor-avgwordlength .
   ```
2. Run the container:
   ```
   docker run -p 4005:4005 editor-avgwordlength
   ```

### Testing
- Run tests locally using Go:
  ```
  go test ./... -v
  ```

### API Endpoint
- POST `/avgwordlength`
  - Request Body: `{ "text": "your input text here" }`
  - Response: `{ "averageWordLength": 4.5 }`

## CI Pipeline
- A GitHub Actions workflow is included to automate tests and builds on every push or pull request to the `main` branch.