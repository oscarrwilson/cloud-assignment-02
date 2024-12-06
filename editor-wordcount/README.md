## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- Docker
- PHP
- Basic knowledge of Git and GitHub Flow

### Installing

1. Clone the Repository:
  ```bash
  git clone https://github.com/oscarrwilson/cloud-assignment-02.git
  cd cloud-assignment-02/editor-wordcount
  ```

2. Build Docker Image:
  ```bash
  docker build -t editor-wordcount .
  ```

3. Run Docker Container:
  ```bash
  docker run -d -p 8000:80 editor-wordcount
  ```

## Running the Tests

### Unit Tests

Run the unit tests using the following command:
```bash
php test.php
```

## Deployment

The application can be deployed on any system with Docker installed. Follow the setup instructions to build and run the Docker containers on your deployment server.

## Built With

- [Docker](https://docs.docker.com/) - Containerization platform
- [PHP](https://www.php.net/) - Backend runtime

## Authors

- **Oscar Wilson** - Queens University Belfast, CSC3065 Cloud Computing Assignment

## License

This project is for educational purposes as part of CSC3065 at QUB and is not intended for production use.

## Acknowledgments

- **QUB** for the assignment outline.
- **Docker, PHP** communities for their excellent documentation and resources.
- **ChatGPT** for use of assignment research and article sourcing.
- **David Cutting** for original source code.