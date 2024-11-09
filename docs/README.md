Code Base Structure

cloud-assignment-02/
├── .env                      # Dynamic configurations for all services
├── .gitignore                # Prevents committing unnecessary files
├── README.md                 # Project documentation
├── docker-compose.yml        # Orchestration for services
├── editor-frontend/          # Frontend service
│   ├── Dockerfile
│   ├── README.md
│   ├── .gitignore
│   ├── .gitlab-ci.yml
│   ├── src/
│   │   ├── index.html
│   │   ├── indexOld.html     # Legacy files; remove or document their purpose
│   │   ├── app.js
│   │   ├── config.json       # Service-specific configuration (optional)
│   ├── tests/
│       ├── frontend.test.js
├── editor-wordcount/         # Wordcount service (PHP-based)
│   ├── Dockerfile
│   ├── README.md
│   ├── .gitignore
│   ├── .gitlab-ci.yml
│   ├── src/
│   │   ├── functions.php
│   │   ├── server.php
│   ├── tests/
│       ├── wordcount.test.php
├── editor-charcount/         # Character count service (Node.js-based)
│   ├── Dockerfile
│   ├── README.md
│   ├── .gitignore
│   ├── .gitlab-ci.yml
│   ├── package.json          # Node.js dependency management
│   ├── src/
│   │   ├── charcount.js
│   │   ├── server.js
│   ├── test/
│       ├── charcount.test.js
