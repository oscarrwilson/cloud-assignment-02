# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy application code to the working directory
COPY . .

# Install dependencies
RUN pip install flask requests flask-cors python-dotenv

# Expose the port the app runs on
EXPOSE 8080

# Set the entry point for the container
CMD ["python", "proxy.py"]