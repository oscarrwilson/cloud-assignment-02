FROM php:7.2-apache
COPY src/ /var/www/html/


FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the frontend source code
COPY src/ ./src

# Expose the frontend port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]