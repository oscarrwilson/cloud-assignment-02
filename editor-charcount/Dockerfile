# Use a specific Node.js LTS version
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application source code
COPY . .

# Expose the service port for documentation
EXPOSE 4001

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the application with dynamic port support
CMD ["sh", "-c", "node src/server.js --port=${PORT:-4001}"]
