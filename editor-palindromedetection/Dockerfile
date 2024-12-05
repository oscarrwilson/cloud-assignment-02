# Stage 1: Build environment with dev dependencies
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install all dependencies (including dev dependencies)
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Run tests
RUN npm test

# Stage 2: Production environment (No dev dependencies)
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json (not the dev dependencies)
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --production  # Only install production dependencies

# Copy application source code from build stage
COPY --from=build /usr/src/app ./

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Expose the port that the app listens on
EXPOSE 4005

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Add health check for the app
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:4005/health || exit 1

# Start the application
CMD ["sh", "-c", "node src/server.js --port=${PORT:-4005}"]