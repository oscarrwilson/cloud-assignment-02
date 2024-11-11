# Stage 1: Build dependencies
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the application source code
COPY src/ ./src

# Stage 2: Run the application
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy built dependencies and source code from the builder stage
COPY --from=builder /usr/src/app /usr/src/app

# Expose the service port
EXPOSE 4001

# Start the application with dynamic port support
CMD ["sh", "-c", "node src/server.js --port=${PORT}"]
