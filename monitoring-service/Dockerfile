# Base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the application files
COPY . .

# Expose the port used by the monitoring service
EXPOSE 4008

# Default command to run the service
CMD ["node", "monitoring-service.js"]