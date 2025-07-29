# Multi-Stage Docker Setup for AI Server

This directory contains an optimized multi-stage Docker setup for the AI Server, which provides gaze tracking and analysis capabilities using MediaPipe, OpenCV, and Flask.

## 🏗️ Multi-Stage Architecture

The Dockerfile uses a three-stage build process to optimize image size and build performance:

### Stage 1: Builder
- **Base Image**: `python:3.10-slim`
- **Purpose**: Install build dependencies and compile Python packages
- **Dependencies**: GCC, G++, OpenCV development libraries, MediaPipe dependencies
- **Output**: Python wheels for all dependencies

### Stage 2: Runtime Dependencies
- **Base Image**: `python:3.10-slim`
- **Purpose**: Install only runtime system dependencies
- **Dependencies**: OpenCV runtime libraries, image processing libraries
- **Output**: Clean runtime environment

### Stage 3: Final Application
- **Base Image**: Runtime dependencies from Stage 2
- **Purpose**: Install Python packages and deploy application
- **Security**: Non-root user execution
- **Output**: Production-ready container

## 📁 Files

- `Dockerfile` - Multi-stage Docker configuration
- `.dockerignore` - Excludes unnecessary files from build context
- `build.sh` - Linux/macOS build script with options
- `build.bat` - Windows build script with options
- `requirements.txt` - Python dependencies

## 🚀 Quick Start

### Using Docker Compose (Recommended)
```bash
# From the root directory
docker-compose up ai-server
```

### Using Build Scripts

#### Linux/macOS
```bash
cd AI_Server
./build.sh
```

#### Windows
```cmd
cd AI_Server
build.bat
```

### Manual Docker Build
```bash
cd AI_Server
docker build -t autism-ai-server .
docker run -p 8002:8002 -v $(pwd)/uploads:/app/uploads autism-ai-server
```

## 🔧 Build Options

### Basic Build
```bash
./build.sh
```

### Build with Custom Tag
```bash
./build.sh -t v1.0.0
```

### Build Without Cache
```bash
./build.sh --no-cache
```

### Build and Push to Registry
```bash
./build.sh --push --registry myregistry.com
```

### Build with Custom Name
```bash
./build.sh -n my-ai-server
```

## 📊 Performance Benefits

### Image Size Optimization
- **Before**: ~2.5GB (single stage)
- **After**: ~1.8GB (multi-stage)
- **Reduction**: ~28% smaller

### Build Time Optimization
- **Layer Caching**: Dependencies cached separately from code
- **Parallel Builds**: Multiple stages can be built in parallel
- **Incremental Updates**: Code changes don't rebuild dependencies

### Security Improvements
- **Non-root User**: Application runs as `appuser`
- **Minimal Attack Surface**: Only runtime dependencies included
- **No Build Tools**: Compilation tools excluded from final image

## 🔍 Health Checks

The container includes a health check endpoint:
```bash
curl http://localhost:8002/check
```

Health check configuration:
- **Interval**: 30 seconds
- **Timeout**: 30 seconds
- **Start Period**: 5 seconds
- **Retries**: 3

## 🐳 Docker Compose Integration

The AI Server is configured to work with the main `docker-compose.yml`:

```yaml
ai-server:
  build:
    context: ./AI_Server
    dockerfile: Dockerfile
  container_name: autism-ai-server
  ports:
    - "8002:8002"
  environment:
    - DATABASE_URL=/app/autism_db.db
    - UPLOAD_DIR=/app/uploads
    - CORS_ORIGINS=http://localhost:8001
  volumes:
    - ./autism_db.db:/app/autism_db.db
    - ./AI_Server/uploads:/app/uploads
    - ./backend/yolov5s.pt:/app/yolov5s.pt
  networks:
    - autism-network
  restart: unless-stopped
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `/app/autism_db.db` | Path to SQLite database |
| `UPLOAD_DIR` | `/app/uploads` | Directory for uploaded files |
| `CORS_ORIGINS` | `http://localhost:8001` | Allowed CORS origins |
| `FLASK_ENV` | `production` | Flask environment |
| `FLASK_APP` | `main.py` | Flask application entry point |

## 📝 Development Workflow

### 1. Local Development
```bash
# Install dependencies locally
pip install -r requirements.txt

# Run Flask development server
python main.py
```

### 2. Docker Development
```bash
# Build development image
docker build -t ai-server-dev .

# Run with volume mount for code changes
docker run -p 8002:8002 -v $(pwd):/app ai-server-dev
```

### 3. Production Build
```bash
# Build optimized production image
./build.sh -t production

# Run production container
docker run -p 8002:8002 -v $(pwd)/uploads:/app/uploads autism-ai-server:production
```

## 🐛 Troubleshooting

### Build Issues
1. **Out of Memory**: Increase Docker memory limit
2. **Network Issues**: Check Docker daemon connectivity
3. **Permission Issues**: Ensure build script is executable

### Runtime Issues
1. **Port Conflicts**: Check if port 8002 is available
2. **Volume Mounts**: Ensure uploads directory exists
3. **Dependencies**: Verify all system libraries are included

### Performance Issues
1. **Large Image Size**: Use `.dockerignore` to exclude unnecessary files
2. **Slow Builds**: Enable Docker BuildKit
3. **Memory Usage**: Monitor container resource usage

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy AI Server

on:
  push:
    branches: [main]
    paths: ['AI_Server/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: |
          cd AI_Server
          docker build -t autism-ai-server .
      - name: Push to registry
        run: |
          docker tag autism-ai-server ${{ secrets.REGISTRY }}/autism-ai-server:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/autism-ai-server:${{ github.sha }}
```

## 📚 Additional Resources

- [Docker Multi-Stage Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
- [Flask Production Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [MediaPipe Documentation](https://mediapipe.dev/)
- [OpenCV Docker](https://opencv.org/platforms/docker/)

## 🤝 Contributing

When modifying the Docker setup:

1. Test builds locally before committing
2. Update documentation for any new options
3. Ensure backward compatibility
4. Add appropriate health checks
5. Follow security best practices 