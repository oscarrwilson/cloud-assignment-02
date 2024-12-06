# First Stage: Build and Test
FROM python:3.11-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev

# Upgrade pip and install build tools
RUN pip install --upgrade pip
RUN pip install --no-cache-dir build setuptools

# Copy pyproject.toml and install all dependencies including testing
COPY pyproject.toml ./
RUN pip install --no-cache-dir .[testing]

# Copy the application source code and tests
COPY src/ src/
COPY test/ test/

# Run unit and integration tests
RUN pytest

# Second Stage: Production Image
FROM python:3.11-alpine

WORKDIR /usr/src/app

# Install only necessary runtime dependencies
RUN apk add --no-cache libffi openssl

# Copy the application from the builder stage
COPY --from=builder /usr/src/app /usr/src/app

# Install only production dependencies
RUN pip install --no-cache-dir .

# Expose the dynamic service port
EXPOSE 4003

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the application with dynamic port support
CMD ["sh", "-c", "python src/app.py --port=${PORT:-4003}"]