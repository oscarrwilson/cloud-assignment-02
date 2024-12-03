# Editor Vowel Count Service

This service provides an API to count characters in a given text. It is part of the QUB Editor Project, which demonstrates cloud computing concepts such as containerization, microservices, and CI/CD pipelines.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- Docker
- Node.js
- Basic knowledge of Git and GitHub Flow

### Installing

1. Clone the Repository:
  ```bash
  git clone https://github.com/oscarrwilson/cloud-assignment-02.git
  cd cloud-assignment-02/editor-vowelcount
  ```

2. Install Dependencies:
  ```bash
  npm ci
  ```

3. Build Docker Image:
  ```bash
  docker build -t editor-vowelcount .
  ```

4. Run Docker Container:
  ```bash
  docker run -d -p 4001:4001 editor-vowelcount
  ```

## Running the Tests

### Unit Tests

Run the unit tests using Mocha:
```bash
npm test
```

### Integration Tests

Integration tests are included to ensure the service works as expected with other components. Run them as follows:
```bash
npm run test:integration
```

## Deployment

The application can be deployed on any system with Docker installed. Follow the setup instructions to build and run the Docker containers on your deployment server.

## Built With

- [Docker](https://docs.docker.com/) - Containerization platform
- [Node.js](https://nodejs.org/) - Backend runtime

## Authors

- **Oscar Wilson** - Queens University Belfast, CSC3065 Cloud Computing Assignment

## License

This project is for educational purposes as part of CSC3065 at QUB and is not intended for production use.

## Acknowledgments

- **QUB** for the assignment outline.
- **Docker, Node.js** communities for their excellent documentation and resources.
- **ChatGPT** for use of assignment research and article sourcing.
- **David Cutting** for original source code.