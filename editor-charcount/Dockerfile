# Use a specific Node.js LTS version
FROM node:14.18

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy application source code
COPY . .

# Expose the service port
EXPOSE 4001

# Run the application as a non-root user
RUN useradd -m appuser
USER appuser

# Start the application with dynamic port support
CMD ["sh", "-c", "node src/server.js --port=${PORT}"]