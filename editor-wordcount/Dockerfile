# Build Stage: Install dependencies, run tests, and set up the app
FROM php:8.2-apache AS build

# Set the working directory
WORKDIR /var/www/html

# Install system dependencies and Composer
RUN apt-get update && apt-get install -y \
        unzip \
        git \
        libzip-dev \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && rm -rf /var/lib/apt/lists/*

# Copy composer files first to leverage Docker cache for faster builds
COPY composer.json composer.lock ./

# Install all dependencies (including dev dependencies) in the build stage
RUN composer install --prefer-dist --no-suggest --no-interaction

# Copy only the application source code
COPY src/. /var/www/html/

# Set file ownership and permissions for the www-data user (Apache runs as www-data)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Run PHPUnit tests (if you have tests defined)
RUN composer test  # This will run "php vendor/bin/phpunit tests/" from composer.json

# Final Stage: Clean production image
FROM php:8.2-apache AS production

# Set the working directory
WORKDIR /var/www/html

# Copy the necessary files from the build stage
COPY --from=build /var/www/html /var/www/html

# Ensure production dependencies are installed (without dev dependencies)
RUN composer install --prefer-dist --no-dev --no-interaction --optimize-autoloader

# Configure Apache settings to serve from /var/www/html
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo "DirectoryIndex index.php" >> /etc/apache2/apache2.conf \
    && echo '<Directory "/var/www/html/">' \
         '\nOptions Indexes FollowSymLinks' \
         '\nAllowOverride All' \
         '\nRequire all granted' \
         '\n</Directory>' >> /etc/apache2/apache2.conf \
    && echo 'DocumentRoot /var/www/html' >> /etc/apache2/sites-available/000-default.conf

# Expose the HTTP port for the application (adjust the port if necessary)
EXPOSE 4002

# Switch to a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Add health check for the app
# Ensure you have a health check endpoint or adjust the URL here accordingly
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:4002/health || exit 1

# Start Apache in the foreground
CMD ["apache2-foreground"]