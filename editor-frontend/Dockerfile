# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy application source code and config files explicitly
COPY ./src/index.html ./index.html
COPY ./src/app.js ./app.js
COPY ./src/config.json ./config.json

# Install a static file server for serving the frontend
RUN npm install -g http-server

# Set up a non-root user for security
RUN adduser -D appuser
USER appuser

# Expose the application port
EXPOSE 4000

# Serve static files using http-server
CMD ["http-server", ".", "-p", "4000"]

# (Optional) Add a basic health check
HEALTHCHECK --interval=30s --timeout=5s \
    CMD curl -f http://localhost:4000 || exit 1