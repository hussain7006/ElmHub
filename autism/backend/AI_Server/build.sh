#!/bin/bash

# Multi-stage Docker Build Script for AI Server
# Usage: ./build.sh [options]

set -e

# Default values
IMAGE_NAME="autism-ai-server"
TAG="latest"
BUILD_ARGS=""
NO_CACHE=false
PUSH=false
REGISTRY=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -t, --tag TAG           Set image tag (default: latest)"
    echo "  -n, --name NAME         Set image name (default: autism-ai-server)"
    echo "  --no-cache              Build without using cache"
    echo "  --push                  Push image to registry after build"
    echo "  --registry REGISTRY     Docker registry URL"
    echo "  --build-arg KEY=VALUE   Add build argument"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Build with default settings"
    echo "  $0 -t v1.0.0                          # Build with specific tag"
    echo "  $0 --no-cache                         # Build without cache"
    echo "  $0 --push --registry myregistry.com   # Build and push to registry"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        --registry)
            REGISTRY="$2"
            shift 2
            ;;
        --build-arg)
            BUILD_ARGS="$BUILD_ARGS --build-arg $2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build command
BUILD_CMD="docker build"

if [ "$NO_CACHE" = true ]; then
    BUILD_CMD="$BUILD_CMD --no-cache"
fi

if [ -n "$BUILD_ARGS" ]; then
    BUILD_CMD="$BUILD_CMD $BUILD_ARGS"
fi

# Set full image name
if [ -n "$REGISTRY" ]; then
    FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
else
    FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"
fi

print_status "Building multi-stage Docker image..."
print_status "Image: $FULL_IMAGE_NAME"
print_status "Build command: $BUILD_CMD -t $FULL_IMAGE_NAME ."

# Build the image
if $BUILD_CMD -t "$FULL_IMAGE_NAME" .; then
    print_success "Docker image built successfully!"
    
    # Show image size
    IMAGE_SIZE=$(docker images "$FULL_IMAGE_NAME" --format "table {{.Size}}" | tail -n 1)
    print_status "Image size: $IMAGE_SIZE"
    
    # Show image layers
    print_status "Image layers:"
    docker history "$FULL_IMAGE_NAME" --format "table {{.CreatedBy}}\t{{.Size}}" | head -10
    
    # Push if requested
    if [ "$PUSH" = true ]; then
        if [ -z "$REGISTRY" ]; then
            print_error "Registry must be specified when using --push option"
            exit 1
        fi
        
        print_status "Pushing image to registry..."
        if docker push "$FULL_IMAGE_NAME"; then
            print_success "Image pushed successfully!"
        else
            print_error "Failed to push image"
            exit 1
        fi
    fi
    
    # Show run command
    echo ""
    print_status "To run the container:"
    echo "docker run -p 7001:7001 -v \$(pwd)/uploads:/app/uploads $FULL_IMAGE_NAME"
    
else
    print_error "Failed to build Docker image"
    exit 1
fi 