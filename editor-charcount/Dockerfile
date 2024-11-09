FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the source code
COPY src/ ./src

# Expose the service port
EXPOSE 4001

# Define a health check
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost:4001 || exit 1

# Start the application
CMD ["node", "src/server.js"]
