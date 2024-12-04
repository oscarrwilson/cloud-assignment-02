# Stage 1: Build and Test
FROM gcc:12 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    libmicrohttpd-dev \
    libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy source code and tests
COPY src/ ./src/
COPY tests/ ./tests/

# Compile the integration test without running it
RUN gcc -o test_integration tests/test_integration.c -lcurl -Isrc

# Compile the application
RUN gcc -o server src/http_server.c src/palindrome.c src/main.c -lmicrohttpd -Isrc

# Stage 2: Production
FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libcurl4 \
    libmicrohttpd12 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy the compiled binary
COPY --from=builder /usr/src/app/server ./server

# Expose the default port for documentation
EXPOSE 4006

# Add a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Run the application with dynamic port support
ENV PORT=4006
CMD ["./server"]
