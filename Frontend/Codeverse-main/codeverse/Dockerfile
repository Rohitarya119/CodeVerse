# Multi-stage build for React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_BACKEND_BASE=http://localhost:8081
ARG VITE_API_BASE=http://localhost:8081/api

# Set environment variables for Vite build
ENV VITE_BACKEND_BASE=$VITE_BACKEND_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


