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
    │   └── WordCountServer.php     # PHP server endpoint
    ├── tests/            # Consistent with Node.js service
    │   ├── unit/        # Separate unit tests
    │   └── integration/ # Separate integration tests
    ├── .dockerignore    # Docker ignore rules
    ├── .env            # Service environment variables
    ├── .gitignore     # Git ignore rules
    ├── Dockerfile     # Container configuration
    ├── composer.json  # PHP dependency management (equivalent to package.json)
    └── README.md     # Service documentation
        