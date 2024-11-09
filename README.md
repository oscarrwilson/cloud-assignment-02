# QUB Editor Project

A cloud-based text editor demonstrating concepts in cloud computing, including containerisation, microservices, and CI/CD pipelines. The editor supports text-based operations through backend services, with a frontend interface for user interaction.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- Docker
- Basic knowledge of Git and GitHub Flow

### Installing

1. Clone the Repository:
   ```bash
   git clone https://github.com/oscarrwilson/cloud-assignment-02.git
   cd cloud-assignment-02
   ```

2. Build Docker Containers:
   Navigate to each subdirectory and build the Docker images:
   ```bash
   cd editor-charcount
   docker build -t editor-charcount .

   cd ../editor-wordcount
   docker build -t editor-wordcount .

   cd ../editor-frontend
   docker build -t editor-frontend .
   ```

3. Run Docker Containers:
   Run the containers using the following commands:
   ```bash
   docker run -d -p 8080:80 editor-frontend
   docker run -d -p 3000:3000 editor-charcount
   docker run -d -p 8000:80 editor-wordcount

   ```

4. Access the Application:
   - Frontend: http://localhost:8080
   - Word Count API: http://localhost:8000
   - Character Count API: http://localhost:3000

## Running the Tests

### Backend Unit Tests

Each backend service includes unit tests. Run them as follows:

- **editor-charcount**:
  ```bash
  cd editor-charcount/test
  node test-charcount.js
  ```

- **editor-wordcount**:
  ```bash
  cd editor-wordcount/src
  php test.php
  ```

## Deployment

The application can be deployed on any system with Docker installed. Follow the setup instructions to build and run the Docker containers on your deployment server.

## Built With

- [Docker](https://docs.docker.com/) - Containerisation platform
- [Node.js](https://nodejs.org/) - Backend runtime for `editor-charcount`
- [PHP](https://www.php.net/) - Backend runtime for `editor-wordcount`

## Authors

- **Oscar Wilson** - Queens University Belfast, CSC3065 Cloud Computing Assignment

## License

This project is for educational purposes as part of CSC3065 at QUB and is not intended for production use.

## Acknowledgments

- **QUB** for the assignment outline.
- **Docker, Node.js, PHP** communities for their excellent documentation and resources.
- **ChatGPT** for use of assignment research and article sourcing.
