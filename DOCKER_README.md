# Docker Setup for CodeVerse

This guide explains how to build and run the CodeVerse application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Start services in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **View running containers:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f server
   docker-compose logs -f postgres
   ```

5. **Stop all services:**
   ```bash
   docker-compose down
   ```

6. **Stop and remove volumes (clears database data):**
   ```bash
   docker-compose down -v
   ```

## Services

The application consists of 4 services:

1. **PostgreSQL Database** (port 5432)
   - Database: `codeverse`
   - User: `postgres`
   - Password: `0000`

2. **Spring Boot Backend** (port 8081)
   - API endpoint: `http://localhost:8081`
   - Health check: `http://localhost:8081/actuator/health`

3. **Node.js Code Execution Server** (port 8082)
   - Proxy server for Judge0 API
   - Endpoint: `http://localhost:8082`

4. **React Frontend** (port 80)
   - Web application: `http://localhost`
   - Served via Nginx

## Building Individual Images

You can build individual Docker images:

### Backend
```bash
cd Backend/codeverse-backend
docker build -t codeverse-backend .
```

### Frontend
```bash
cd Frontend/Codeverse-main/codeverse
docker build -t codeverse-frontend .
```

### Server
```bash
cd server
docker build -t codeverse-server .
```

## Environment Variables

You can customize environment variables by creating a `.env` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

The docker-compose.yml will automatically use these values if provided.

## Troubleshooting

### Port Already in Use
If you get port conflicts, you can modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8081:8081"  # Change first number to available port
```

### Database Connection Issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Wait for database to be ready before starting backend

### Frontend Not Loading
- Check if backend is running: `docker-compose ps`
- Verify frontend build completed: `docker-compose logs frontend`
- Check browser console for API connection errors

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all services
docker-compose up --build
```

## Sharing with Friends

To share your Docker setup:

1. **Share the entire project folder** (including Docker files)
2. **Or create a Docker image and push to Docker Hub:**

   ```bash
   # Tag images
   docker tag codeverse-backend yourusername/codeverse-backend:latest
   docker tag codeverse-frontend yourusername/codeverse-frontend:latest
   docker tag codeverse-server yourusername/codeverse-server:latest
   
   # Push to Docker Hub
   docker push yourusername/codeverse-backend:latest
   docker push yourusername/codeverse-frontend:latest
   docker push yourusername/codeverse-server:latest
   ```

3. **Update docker-compose.yml** to use your Docker Hub images instead of building locally

## Production Considerations

For production deployment:

1. **Change default passwords** in docker-compose.yml
2. **Use environment variables** for sensitive data (don't hardcode secrets)
3. **Set up proper SSL/TLS** certificates
4. **Configure proper CORS** settings
5. **Use production database** settings
6. **Set up proper logging** and monitoring
7. **Configure resource limits** for containers

## Accessing the Application

Once all services are running:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **Code Execution Server**: http://localhost:8082

