# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy only package files for better caching
COPY calculator-frontend/package*.json ./

# Use npm install instead of npm ci since package-lock may be out of sync
RUN npm install

# Stage 2: Build
FROM dependencies AS build
WORKDIR /app

# Copy the rest of the application code
COPY calculator-frontend/ ./

# Build the application
RUN npm run build

# Stage 3: Production
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built static files from build stage
COPY --from=build /app/build ./

# Add custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]