# AI Server Troubleshooting Guide

## 🚨 Issue: AI Server Not Responding to Requests

If your AI server is running but not responding to requests, follow these steps:

## 🔍 Step 1: Check Container Status

```bash
# Check if containers are running
docker ps

# Check AI server logs
docker logs autism-ai-server

# Check if port 8002 is exposed
docker port autism-ai-server
```

## 🔍 Step 2: Test Connectivity

### Using the Test Script
```bash
cd AI_Server
python test_server.py
```

### Manual Testing
```bash
# Test health check
curl http://localhost:8002/check

# Test status endpoint
curl http://localhost:8002/status

# Test reset endpoint
curl http://localhost:8002/reset
```

## 🔍 Step 3: Common Issues and Solutions

### Issue 1: Flask Development Server
**Problem**: Flask running in debug mode in production
**Solution**: ✅ Fixed - Now using Gunicorn production server

### Issue 2: Health Check Endpoint
**Problem**: Health check expected POST with form data
**Solution**: ✅ Fixed - Added GET health check endpoint

### Issue 3: Network Connectivity
**Problem**: Container not accessible from host
**Solution**: Check docker-compose.yml port mapping

### Issue 4: CORS Issues
**Problem**: Frontend can't connect due to CORS
**Solution**: Verify CORS_ORIGINS environment variable

## 🔧 Step 4: Debug Commands

### Check Container Logs
```bash
# Real-time logs
docker logs -f autism-ai-server

# Last 50 lines
docker logs --tail 50 autism-ai-server
```

### Check Network
```bash
# Check if port is listening
netstat -an | grep 8002

# Test from inside container
docker exec -it autism-ai-server curl http://localhost:8002/check
```

### Check Environment Variables
```bash
docker exec autism-ai-server env | grep -E "(FLASK|CORS|DATABASE)"
```

## 🔧 Step 5: Rebuild and Restart

```bash
# Stop containers
docker-compose down

# Rebuild AI server
docker-compose build ai-server

# Start with logs
docker-compose up ai-server

# Or start all services
docker-compose up --build
```

## 🔧 Step 6: Manual Container Testing

```bash
# Run container manually for testing
docker run -p 8002:8002 -v $(pwd)/uploads:/app/uploads autism-ai-server

# Test from another terminal
curl http://localhost:8002/status
```

## 📋 Expected Behavior

### ✅ Working AI Server Should:
1. **Start successfully** with Gunicorn
2. **Respond to health checks** at `/check` (GET)
3. **Show status** at `/status` (GET)
4. **Accept POST requests** for gaze analysis
5. **Log requests** in container logs

### ❌ Common Failure Signs:
1. **Container exits immediately** - Check logs for startup errors
2. **Port not accessible** - Check port mapping and firewall
3. **Requests timeout** - Check if Flask/Gunicorn is running
4. **CORS errors** - Check CORS_ORIGINS configuration

## 🔧 Step 7: Configuration Check

### Verify docker-compose.yml
```yaml
ai-server:
  ports:
    - "8002:8002"  # Should be this
  environment:
    - CORS_ORIGINS=http://localhost:8001  # Should match frontend
```

### Verify Dockerfile
- ✅ Multi-stage build
- ✅ Gunicorn production server
- ✅ Non-root user
- ✅ Health check endpoint

## 🆘 Step 8: Emergency Debug

If nothing works, try this minimal setup:

```bash
# Create minimal test container
docker run -d --name test-ai \
  -p 8002:8002 \
  -e FLASK_ENV=production \
  autism-ai-server

# Check if it's running
docker logs test-ai

# Test connectivity
curl http://localhost:8002/check
```

## 📞 Still Having Issues?

1. **Check Docker Desktop** - Ensure it's running
2. **Check Windows Firewall** - Port 8002 might be blocked
3. **Check antivirus** - Some antivirus software blocks Docker
4. **Restart Docker** - Sometimes Docker needs a restart
5. **Check system resources** - Ensure enough RAM/CPU

## 🔄 Quick Fix Commands

```bash
# Complete reset
docker-compose down
docker system prune -f
docker-compose up --build

# Test immediately
curl http://localhost:8002/status
``` 