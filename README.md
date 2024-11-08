
Cloud Assignment: QUB Editor Project

This project is the QUB Editor, a cloud-based text editor designed to demonstrate 
concepts in cloud computing, including containerisation, microservices, and CI/CD 
pipelines. The editor supports text-based operations through backend services, with 
a frontend interface for user interaction.

================================================================================
                              Table of Contents
================================================================================

- Project Structure
- Features
- Prerequisites
- Setup Instructions
- Usage
- Testing
- Improvements (Task B)
- Author
- License
- Additional Resources

================================================================================
                              Project Structure
================================================================================

The project consists of the following components:

1. editor-frontend: A static HTML/JavaScript frontend for user interaction.
2. editor-wordcount: A PHP-based backend service that calculates the word count 
   of a given text.
3. editor-charcount: A Node.js-based backend service that calculates the 
   character count of a given text.

Directory Overview:
-------------------
root/
├── README.md            # Main project documentation (this file)
├── editor-charcount/    # Character count service
├── editor-frontend/     # Frontend interface
├── editor-wordcount/    # Word count service

================================================================================
                                 Features
================================================================================

1. Word Count Service:
   - Counts the number of words in a given text.
   - Implemented in PHP.

2. Character Count Service:
   - Counts the number of characters in a given text.
   - Implemented in Node.js.

3. Frontend:
   - Provides a user interface for submitting text to the backend services.
   - Implemented in static HTML and JavaScript.

================================================================================
                               Prerequisites
================================================================================

- Docker installed and running.
- Basic knowledge of Git and GitHub Flow.

================================================================================
                            Setup Instructions
================================================================================

1. Clone the Repository:
   git clone <repository_url>
   cd cloud-assignment-02

2. Build Docker Containers:
   Navigate to each subdirectory and build the Docker images:
   cd editor-charcount
   docker build -t editor-charcount .
   
   cd ../editor-wordcount
   docker build -t editor-wordcount .
   
   cd ../editor-frontend
   docker build -t editor-frontend .

3. Run Docker Containers:
   Run the containers using the following commands:
   docker run -p 3000:3000 editor-charcount
   docker run -p 4000:4000 editor-wordcount
   docker run -p 5000:5000 editor-frontend

4. Access the Application:
   - Frontend: http://localhost:5000
   - Word Count API: http://localhost:4000
   - Character Count API: http://localhost:3000

================================================================================
                                 Usage
================================================================================

1. Open the frontend in your browser.
2. Enter text in the input box and click the corresponding button to:
   - Count words.
   - Count characters.
3. Results will be displayed in the frontend interface.

================================================================================
                                Testing
================================================================================

Each backend service includes unit tests. Run the tests as follows:

- editor-charcount:
  cd editor-charcount/test
  node test-charcount.js

- editor-wordcount:
  cd editor-wordcount/src
  php test.php

================================================================================
                           Improvements (Task B)
================================================================================

The following improvements are being implemented:
- Improved error handling for frontend and backend.
- Dynamic route configuration for backend services.
- Enhanced CI testing with end-to-end tests.

================================================================================
                                 Author
================================================================================

Oscar Wilson - University of Bristol, CSC3065 Cloud Computing Assignment.

================================================================================
                                License
================================================================================

This project is for educational purposes as part of CSC3065 at QUB and is not 
intended for production use.

================================================================================
                           Additional Resources
================================================================================

- Docker Documentation: https://docs.docker.com
- Node.js Documentation: https://nodejs.org
- PHP Documentation: https://www.php.net
