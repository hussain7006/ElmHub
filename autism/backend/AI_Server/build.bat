@echo off
setlocal enabledelayedexpansion

REM Multi-stage Docker Build Script for AI Server (Windows)
REM Usage: build.bat [options]

REM Default values
set IMAGE_NAME=autism-ai-server
set TAG=latest
set BUILD_ARGS=
set NO_CACHE=false
set PUSH=false
set REGISTRY=

REM Parse command line arguments
:parse_args
if "%~1"=="" goto :end_parse
if "%~1"=="-t" (
    set TAG=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--tag" (
    set TAG=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="-n" (
    set IMAGE_NAME=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--name" (
    set IMAGE_NAME=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--no-cache" (
    set NO_CACHE=true
    shift
    goto :parse_args
)
if "%~1"=="--push" (
    set PUSH=true
    shift
    goto :parse_args
)
if "%~1"=="--registry" (
    set REGISTRY=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="-h" (
    goto :show_usage
)
if "%~1"=="--help" (
    goto :show_usage
)
echo [ERROR] Unknown option: %~1
goto :show_usage

:end_parse

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build command
set BUILD_CMD=docker build

if "%NO_CACHE%"=="true" (
    set BUILD_CMD=%BUILD_CMD% --no-cache
)

if not "%BUILD_ARGS%"=="" (
    set BUILD_CMD=%BUILD_CMD% %BUILD_ARGS%
)

REM Set full image name
if not "%REGISTRY%"=="" (
    set FULL_IMAGE_NAME=%REGISTRY%/%IMAGE_NAME%:%TAG%
) else (
    set FULL_IMAGE_NAME=%IMAGE_NAME%:%TAG%
)

echo [INFO] Building multi-stage Docker image...
echo [INFO] Image: %FULL_IMAGE_NAME%
echo [INFO] Build command: %BUILD_CMD% -t %FULL_IMAGE_NAME% .

REM Build the image
%BUILD_CMD% -t "%FULL_IMAGE_NAME%" .
if errorlevel 1 (
    echo [ERROR] Failed to build Docker image
    exit /b 1
)

echo [SUCCESS] Docker image built successfully!

REM Show image size
for /f "tokens=*" %%i in ('docker images "%FULL_IMAGE_NAME%" --format "table {{.Size}}" ^| findstr /v "SIZE"') do (
    echo [INFO] Image size: %%i
)

REM Show image layers
echo [INFO] Image layers:
docker history "%FULL_IMAGE_NAME%" --format "table {{.CreatedBy}}\t{{.Size}}" | findstr /v "CREATED BY" | head -10

REM Push if requested
if "%PUSH%"=="true" (
    if "%REGISTRY%"=="" (
        echo [ERROR] Registry must be specified when using --push option
        exit /b 1
    )
    
    echo [INFO] Pushing image to registry...
    docker push "%FULL_IMAGE_NAME%"
    if errorlevel 1 (
        echo [ERROR] Failed to push image
        exit /b 1
    )
    echo [SUCCESS] Image pushed successfully!
)

REM Show run command
echo.
echo [INFO] To run the container:
echo docker run -p 8003:8003 -v %cd%/uploads:/app/uploads %FULL_IMAGE_NAME%

exit /b 0

:show_usage
echo Usage: %~nx0 [options]
echo.
echo Options:
echo   -t, --tag TAG           Set image tag (default: latest)
echo   -n, --name NAME         Set image name (default: autism-ai-server)
echo   --no-cache              Build without using cache
echo   --push                  Push image to registry after build
echo   --registry REGISTRY     Docker registry URL
echo   --build-arg KEY=VALUE   Add build argument
echo   -h, --help              Show this help message
echo.
echo Examples:
echo   %~nx0                                    # Build with default settings
echo   %~nx0 -t v1.0.0                          # Build with specific tag
echo   %~nx0 --no-cache                         # Build without cache
echo   %~nx0 --push --registry myregistry.com   # Build and push to registry
exit /b 0 