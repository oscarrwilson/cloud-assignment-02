FROM python:3.9-slim

# Install curl for debugging
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY proxy.py config.json /app/

# Install necessary Python packages
RUN pip install flask requests flask_cors

EXPOSE 8080
CMD ["python", "proxy.py"]
