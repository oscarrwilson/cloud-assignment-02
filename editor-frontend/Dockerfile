# Stage 1: Build dependencies
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the application source code
COPY ./src ./src

# Stage 2: Run the application
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy dependencies and source code from the builder stage
COPY --from=builder /usr/src/app /usr/src/app

# Expose the frontend port
EXPOSE 4000

# Start the application dynamically
CMD ["sh", "-c", "npm start -- -l ${FRONTEND_PORT}"]