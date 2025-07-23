# Use Python 3.10 slim image for smaller size and security
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set work directory
WORKDIR /app

# Install system dependencies including those needed for Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies in layers for better caching
COPY requirements.txt .

# Upgrade pip first
RUN pip install --no-cache-dir --upgrade pip

# Install core dependencies first (FastAPI, uvicorn)
RUN pip install --no-cache-dir fastapi uvicorn

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright dependencies as root (since --with-deps requires root)
RUN playwright install-deps

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Create necessary directories and set ownership
RUN mkdir -p generated_reports uploads /home/appuser/.cache
RUN chown -R appuser:appuser /app /home/appuser

# Switch to appuser to install Playwright browsers
USER appuser

# Install Playwright browsers as appuser (without --with-deps since deps are already installed)
RUN playwright install

# Copy application code (as root first, then change ownership)
USER root
COPY .env .
COPY . .
RUN chown -R appuser:appuser /app

# Switch back to appuser for running the application
USER appuser

# Expose port
EXPOSE 7000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7000/docs || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7000", "--reload"] 