FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Install Redis
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install redis-server \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# Configure Redis to listen on all interfaces (for development only)
RUN sed -i 's/bind 127.0.0.1/bind 0.0.0.0/g' /etc/redis/redis.conf

# Expose Redis port
EXPOSE 6379

# Start Redis when container starts
CMD ["redis-server", "--daemonize", "yes"]
