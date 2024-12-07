FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN npm run build

# This image just builds the frontend. You don't need to expose ports or serve it here.
# The built files end up in /app/build