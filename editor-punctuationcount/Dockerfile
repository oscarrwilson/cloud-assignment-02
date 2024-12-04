# Stage 1: Builder
FROM rust:1.83.0 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy the project files
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY test ./test

# Build dependencies to cache them
RUN cargo fetch --locked

# Run tests in the build phase
RUN cargo test --release --locked

# Build the project in release mode
RUN cargo build --release --locked

# Stage 2: Runtime
FROM debian:bookworm-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the built binary from the builder stage
COPY --from=builder /usr/src/app/target/release/editor-punctuationcount ./editor-punctuationcount

# Expose the application port
EXPOSE 4004

# Set environment variables
ENV APP_ENV=production
ENV PORT=4004

# Run the service
CMD ["./editor-punctuationcount"]