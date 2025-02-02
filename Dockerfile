# Use Bun's official image
FROM oven/bun:1.0 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the app and build it
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default files and copy build artifacts
RUN rm -rf ./*
COPY --from=build /app/dist .

# Expose the port defined in package.json (4434)
EXPOSE 4434

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
