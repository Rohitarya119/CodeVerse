#!/bin/bash

echo "=========================================="
echo "  Starting CodeVerse Application"
echo "=========================================="
echo ""
echo "Building and starting all services..."
echo "This may take a few minutes on first run..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERROR: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Start services
docker-compose up --build -d

echo ""
echo "✅ Services are starting..."
echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check container status
echo ""
echo "Container Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "  Application is starting!"
echo "=========================================="
echo ""
echo "🌐 Frontend:  http://localhost"
echo "🔧 Backend:   http://localhost:8081"
echo "⚙️  Server:    http://localhost:8082"
echo ""
echo "Open http://localhost in your browser"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo ""

