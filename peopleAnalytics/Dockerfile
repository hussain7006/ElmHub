# Development Dockerfile for People Analytics React Application
FROM node:20.13.1-alpine

# Set working directory
WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache curl

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies for the target platform
RUN npm cache clean --force && \
    npm install --force && \
    npm install @rollup/rollup-linux-x64-musl --force

# Copy source code
COPY . .

# Expose development port
EXPOSE 8006

# Set environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=8006


# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8006/ || exit 1

# Start development server
CMD ["npm", "run", "dev"] 