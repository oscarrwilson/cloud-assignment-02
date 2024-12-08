# Use an official Node.js image as the base
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the application's port
EXPOSE 4007

# Define the command to run the application
CMD ["node", "server.js"]