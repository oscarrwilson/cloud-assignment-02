# First Stage: Build and Test
FROM golang:1.21-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies and tools
COPY go.mod go.sum ./
RUN go mod download

# Copy application files
COPY . ./

# Run tests
RUN go test ./... -v

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd

# Second Stage: Production
FROM alpine:3.18

WORKDIR /usr/src/app

# Copy built binary from builder
COPY --from=builder /usr/src/app/server /usr/src/app/server

# Set up a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the service port
EXPOSE 4005

# Dynamic port support
ENV PORT=4005

# Run the server
CMD ["./server"]