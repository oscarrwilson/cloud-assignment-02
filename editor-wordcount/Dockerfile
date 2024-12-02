FROM php:7.2-apache

# Install necessary PHP extensions
RUN docker-php-ext-install mysqli && \
    apt-get update && apt-get install -y libzip-dev && \
    docker-php-ext-install zip

# Set ServerName to suppress warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Enable necessary Apache modules and configure permissions
RUN a2enmod rewrite
RUN echo '<Directory "/var/www/html">\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/sites-available/000-default.conf

# Set DirectoryIndex to server.php
RUN echo "DirectoryIndex index.php" >> /etc/apache2/apache2.conf

# Copy application files to /var/www/html
COPY ./src/ /var/www/html/

# Set ownership and permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose the service port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
