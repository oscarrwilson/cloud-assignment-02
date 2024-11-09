FROM php:8.1-apache

# Copy source code to the web server root
COPY src/ /var/www/html/

# Set permissions (if required)
RUN chown -R www-data:www-data /var/www/html

# Expose the default Apache port
EXPOSE 80
