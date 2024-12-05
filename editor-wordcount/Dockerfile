# Use a lightweight PHP image with Apache
FROM php:8.2-apache AS base

# Set the working directory
WORKDIR /var/www/html

# Install system dependencies and Composer in one step
RUN apt-get update && apt-get install -y \
        unzip \
        git \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && rm -rf /var/lib/apt/lists/*

# Copy composer files first to leverage Docker cache (important for faster rebuilds)
COPY composer.json composer.lock ./

# Install Composer dependencies (this will generate the vendor directory)
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && ls -l /var/www/html/vendor  # Verify vendor directory is created

# Copy only the application source code (this assumes index.php is inside /src)
COPY src/. /var/www/html/

# Verify that the source code is copied correctly into /var/www/html
RUN ls -l /var/www/html  # Check the contents of /var/www/html

# Set file ownership and permissions for the www-data user
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache settings to serve from /var/www/html (default directory)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo "DirectoryIndex index.php" >> /etc/apache2/apache2.conf \
    && echo '<Directory "/var/www/html/">' \
         '\nOptions Indexes FollowSymLinks' \
         '\nAllowOverride All' \
         '\nRequire all granted' \
         '\n</Directory>' >> /etc/apache2/apache2.conf \
    && echo 'DocumentRoot /var/www/html' >> /etc/apache2/sites-available/000-default.conf  # Force correct DocumentRoot

# Expose the default HTTP port
EXPOSE 4002

# Switch to a non-root user for better security
USER www-data

# Start Apache in the foreground
CMD ["apache2-foreground"]