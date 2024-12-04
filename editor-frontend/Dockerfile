# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy application source code
COPY ./src ./src

# Move `config.json` and `index.html` to the root for easier access
RUN cp ./src/config.json ./config.json && cp ./src/index.html ./index.html

# Install a static file server for serving frontend
RUN npm install -g http-server

# Expose the application port
EXPOSE 4000

# Serve static files using http-server
CMD ["http-server", ".", "-p", "4000"]
