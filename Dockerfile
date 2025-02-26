# Build stage
FROM oven/bun:1.0 AS build

WORKDIR /app
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Add custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

