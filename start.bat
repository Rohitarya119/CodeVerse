@echo off
echo ==========================================
echo   Starting CodeVerse Application
echo ==========================================
echo.
echo Building and starting all services...
echo This may take a few minutes on first run...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Start services
docker-compose up --build -d

echo.
echo Services are starting...
echo.
timeout /t 5 /nobreak >nul

echo.
echo Container Status:
docker-compose ps

echo.
echo ==========================================
echo   Application is starting!
echo ==========================================
echo.
echo Frontend:  http://localhost
echo Backend:   http://localhost:8081
echo Server:    http://localhost:8082
echo.
echo Open http://localhost in your browser
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
pause

