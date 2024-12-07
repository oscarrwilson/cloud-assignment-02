# editor-reverse-proxy/Dockerfile

# Stage 1: Base Image
FROM python:3.10-slim AS base

# Set working directory
WORKDIR /app

# Install runtime dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src
COPY config/ ./config

# Stage 2: Testing Image
FROM base AS test

# Install testing dependencies
RUN pip install --no-cache-dir pytest responses

# Copy tests
COPY tests/ ./tests

# Set environment variables for testing if needed
ENV FLASK_ENV=testing

# Stage 3: Production Image
FROM base AS production

# Expose the necessary port
EXPOSE 8080

# Define health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set the entrypoint for the production container
CMD ["python", "src/proxy.py"]