###############################################################################
# Nota Dashboard — Production Dockerfile (Coolify / Docker Compose)
#
# Multi-stage build:
#   1. builder  — installs npm deps & builds Vite assets
#   2. nginx    — production Nginx serving built static assets
#
# Coolify: point the "Dockerfile" build pack at this file in the repo root.
###############################################################################

# ── Stage 1: Build frontend assets ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Define build arguments for Vite (passed at build time by Coolify)
ARG VITE_PROJECT_NAME
ARG VITE_USER_KEY
ARG VITE_AUTH_COOKIE_NAME
ARG VITE_AUTH_COOKIE_EXPIRES_DAYS
ARG VITE_ENV_MODE
ARG VITE_API_URL

# Set environment variables for build runtime
ENV VITE_PROJECT_NAME=$VITE_PROJECT_NAME
ENV VITE_USER_KEY=$VITE_USER_KEY
ENV VITE_AUTH_COOKIE_NAME=$VITE_AUTH_COOKIE_NAME
ENV VITE_AUTH_COOKIE_EXPIRES_DAYS=$VITE_AUTH_COOKIE_EXPIRES_DAYS
ENV VITE_ENV_MODE=$VITE_ENV_MODE
ENV VITE_API_URL=$VITE_API_URL

# Copy workspace source files
COPY . .

# Build the production assets
RUN npm run build

# ── Stage 2: Production Nginx image ─────────────────────────────────────────
FROM nginx:alpine

LABEL maintainer="GOstack Solutions <dev@gostack.uk>"

# Default backend API target for the Nginx proxy (can be overridden via Docker env at runtime)
ENV BACKEND_API_URL="http://nota.31.97.177.200.sslip.io/api/"

# Only substitute BACKEND_API_URL to preserve internal Nginx variables ($uri, $proxy_host, etc.)
ENV NGINX_ENVSUBST_FILTER="BACKEND_API_URL"

# Copy custom nginx configuration as template for automatic envsubst at container start
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy build output from build stage to nginx html serving folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
