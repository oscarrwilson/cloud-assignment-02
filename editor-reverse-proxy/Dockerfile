# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy dependencies first (leverage Docker caching)
COPY requirements.txt ./

# Install dependencies
RUN pip install -r requirements.txt

# Copy application and configuration files
COPY src/ ./src
COPY config/ ./config

# Expose the port the app runs on
EXPOSE 8080

# Add a health check to verify container readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:8080/health || exit 1

# Set the entry point for the container
CMD ["python", "src/proxy.py"]