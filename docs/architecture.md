<<<<<<< HEAD
Code Base Structure

cloud-assignment-02/
├── .env                      # Dynamic configurations for all services
├── .gitignore                # Prevents committing unnecessary files
├── README.md                 # Project documentation
├── docker-compose.yml        # Orchestration for services
├── docs/                     # Documentation
│   └── architecture.md       # Architecture documentation
├── editor-frontend/          # Frontend service
│   ├── Dockerfile           # Frontend container configuration
│   ├─��� README.md            # Frontend documentation
│   ├── .gitignore          # Frontend-specific git ignores
│   ├── package.json        # Frontend dependencies
│   └── src/
│       ├── index.html      # Main frontend interface
│       ├── app.js          # Frontend application logic
│       └── config.json     # Frontend configuration
├── editor-charcount/        # Character count service (Node.js)
│   ├── .github/            # GitHub Actions configuration
│   │   └── workflows/
│   │       └── ci.yml      # CI Github pipeline configuration
│   ├── src/
│   │   ├── charcount.js    # Character counting logic
│   │   └── server.js       # Express server implementation
│   ├── test/
│   │   ├── charcount.test.js  # Unit tests
│   │   └── server.test.js     # Integration tests
│   ├── .dockerignore       # Docker ignore rules
│   ├── .env               # Service environment variables
│   ├── .gitignore        # Git ignore rules
│   ├── Dockerfile        # Container configuration
│   ├── package.json      # Node.js dependencies
│   └── README.md         # Service documentation
└── editor-wordcount/      # Word count service (PHP)
    ├── .github/           # GitHub Actions (if using GitHub)
    │   └── workflows/
    │       └── ci.yml    # CI pipeline configuration
    ├── src/
    │   ├── WordCount.php # Word counting logic
    │   └── index.php     # PHP server endpoint
    ├── tests/            # Consistent with Node.js service
    │   ├── WordCountTest        # Separate unit tests
    │   └── indexTest # Separate integration tests
    ├── .dockerignore    # Docker ignore rules
    ├── .env            # Service environment variables
    ├── .gitignore     # Git ignore rules
    ├── Dockerfile     # Container configuration
    ├── composer.json  # PHP dependency management (equivalent to package.json)
    └── README.md     # Service documentation
        
=======
# Code Base Structure

cloud-assignment-02/
├── docs/                     # Documentation
│   └── architecture.md       # Architecture documentation
├── editor-frontend/          # Frontend service
│   ├── Dockerfile            # Frontend container configuration
│   ├── README.md             # Frontend documentation
│   ├── .gitignore            # Frontend-specific git ignores
│   ├── package.json          # Frontend dependencies
│   └── src/
│       ├── index.html        # Main frontend interface
│       ├── app.js            # Frontend application logic
│       └── config.json       # Frontend configuration
├── editor-charcount/         # Character count service (Node.js)
│   ├── .github/              # GitHub Actions configuration
│   │   └── workflows/
│   │       └── ci.yml        # CI Github pipeline configuration
│   ├── src/
│   │   ├── charcount.js      # Character counting logic
│   │   └── server.js         # Express server implementation
│   ├── test/
│   │   ├── charcount.test.js # Unit tests
│   │   └── server.test.js    # Integration tests
│   ├── .dockerignore         # Docker ignore rules
│   ├── .env                  # Service environment variables
│   ├── .gitignore            # Git ignore rules
│   ├── Dockerfile            # Container configuration
│   ├── package.json          # Node.js dependencies
│   └── README.md             # Service documentation
├── editor-wordcount/         # Word count service (PHP)
│   ├── .github/              # GitHub Actions (if using GitHub)
│   │   └── workflows/
│   │       └── ci.yml        # CI pipeline configuration
│   ├── src/
│   │   ├── WordCount.php     # Word counting logic
│   │   └── index.php         # PHP server endpoint
│   ├── tests/                # Consistent with Node.js service
│   │   ├── WordCountTest.php # Separate unit tests
│   │   └── indexTest.php     # Separate integration tests
│   ├── .dockerignore         # Docker ignore rules
│   ├── .env                  # Service environment variables
│   ├── .gitignore            # Git ignore rules
│   ├── Dockerfile            # Container configuration
│   ├── composer.json         # PHP dependency management (equivalent to package.json)
│   └── README.md             # Service documentation
└── editor-vowelcount/        # Vowel count service (Python)
    ├── .github/              # GitHub Actions configuration
    │   └── workflows/
    │       └── ci.yml        # CI pipeline configuration
    ├── src/
    │   ├── vowelcount.py     # Vowel counting logic
    │   └── app.py            # Flask server implementation
    ├── tests/                # Unit and integration tests
    │   ├── test_vowelcount.py # Unit tests
    │   └── test_app.py       # Integration tests
    ├── .dockerignore         # Docker ignore rules
    ├── .env                  # Service environment variables
    ├── .gitignore            # Git ignore rules
    ├── Dockerfile            # Container configuration
    ├── requirements.txt      # Python dependencies
    └── README.md             # Service documentation

# Adding More Backend Functions as Microservices

To add more backend functions as microservices, follow these steps:

1. **Create a New Directory for the Service**:
   - Create a new directory under the root of the project, similar to `editor-charcount` or `editor-wordcount`.

2. **Set Up the Service**:
   - Depending on the language and framework you choose, set up the necessary files and structure. For example, if using Node.js, create `src/`, `test/`, `Dockerfile`, `package.json`, etc.

3. **Implement the Logic**:
   - Implement the core logic of the service in the `src/` directory. For example, if creating a service to count vowels, implement the logic in a file like `vowelcount.js` or `vowelcount.py`.

4. **Create Tests**:
   - Write unit and integration tests for the service in the `test/` directory. Ensure you cover all edge cases and scenarios.

5. **Set Up Docker**:
   - Create a `Dockerfile` to containerize the service. Ensure it installs all necessary dependencies and exposes the correct port.

6. **Configure CI/CD**:
   - Set up GitHub Actions or another CI/CD tool to automate testing and deployment. Create a workflow file under `.github/workflows/` to define the CI/CD pipeline.

7. **Update Documentation**:
   - Update the `README.md` and `architecture.md` files to include information about the new service. Provide instructions for setting up, running, and testing the service.

### Example Directory Structure for a New Service
>>>>>>> f02dabc (added the shell for last 2 functions and finished editor-punctuationcount)
