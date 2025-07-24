# Development Dockerfile for People Analytics React Application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install --force

# Copy source code
COPY . .

# Expose development port
EXPOSE 8001

# Set environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=8001

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8001/ || exit 1

# Start development server
CMD ["npm", "run", "dev"] 