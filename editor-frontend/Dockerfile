FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the application source code
COPY ./src ./src

# Expose the frontend port
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]
