# Use Bun as the base image for building the frontend
FROM oven/bun:1.2.3 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb to install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the entire project into the container
COPY . .

# Copy .env file to ensure environment variables are available at build time
COPY .env .env

# Build the Vite application
RUN bun run build

# Use nginx as the base image to serve the built application
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./

# Copy the nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the application port
EXPOSE 4434

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
