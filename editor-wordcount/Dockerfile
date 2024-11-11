FROM php:8.1-apache

# Copy source code to the web server root
COPY src/ /var/www/html/

# Set permissions (optional, based on your project needs)
RUN chown -R www-data:www-data /var/www/html

# Expose the service port dynamically
EXPOSE 4002

# Start the Apache server
CMD ["apache2-foreground"]
