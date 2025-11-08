# How to Share CodeVerse with Your Friends

## What to Share

Share the **entire project folder** with your friends. They need all the files including:
- All source code (Backend, Frontend, Server folders)
- Docker files (Dockerfile, docker-compose.yml)
- Configuration files
- This guide

**Best ways to share:**
1. **GitHub/GitLab** (Recommended) - Push to a repository and share the link
2. **Zip file** - Compress the entire folder and share via email/cloud storage
3. **USB drive** - Copy the entire folder

## What Your Friend Needs

Your friend needs to have **Docker Desktop** installed on their computer:

### For Windows:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and restart the computer
3. Open Docker Desktop and wait for it to start

### For Mac:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and open Docker Desktop
3. Wait for it to start (whale icon in menu bar)

### For Linux:
```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

## Step-by-Step Instructions for Your Friend

### Step 1: Extract/Clone the Project
- If you shared a zip file: Extract it to a folder
- If you shared a Git repository: Clone it using `git clone <repository-url>`

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd` or `powershell`
- **Mac**: Press `Cmd + Space`, type `Terminal`
- **Linux**: Open Terminal

### Step 3: Navigate to Project Folder
```bash
cd "path/to/CodeVerse-main 2"
```

### Step 4: Start Docker Desktop
Make sure Docker Desktop is running (you'll see a whale icon in the system tray/menu bar).

### Step 5: Build and Start All Services
```bash
docker-compose up --build
```

**First time will take 5-10 minutes** (downloading images and building)

**To run in background (detached mode):**
```bash
docker-compose up --build -d
```

### Step 6: Wait for Services to Start
Wait until you see messages like:
- "Tomcat started on port 8081"
- "Container codeverse-frontend Started"
- All containers showing as "Up"

### Step 7: Access the Application
Open a web browser and go to:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **Code Execution Server**: http://localhost:8082

## Troubleshooting

### Port Already in Use
If you get errors about ports being in use:
1. Check what's using the port
2. Stop the conflicting service, OR
3. Edit `docker-compose.yml` and change the port numbers

### Docker Not Running
- Make sure Docker Desktop is started
- Check if Docker is running: `docker ps`

### Build Errors
- Make sure you have internet connection (needs to download images)
- Check Docker has enough resources (at least 4GB RAM allocated)

### Can't Access Frontend
- Wait a few seconds for all services to start
- Check if containers are running: `docker-compose ps`
- Check logs: `docker-compose logs frontend`

## Useful Commands for Your Friend

```bash
# View running containers
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up --build -d
```

## Quick Start Script

You can create a simple script for your friend:

### Windows (start.bat):
```batch
@echo off
echo Starting CodeVerse...
docker-compose up --build -d
echo.
echo Services are starting...
echo Open http://localhost in your browser
pause
```

### Mac/Linux (start.sh):
```bash
#!/bin/bash
echo "Starting CodeVerse..."
docker-compose up --build -d
echo ""
echo "Services are starting..."
echo "Open http://localhost in your browser"
```

Make it executable:
```bash
chmod +x start.sh
```

## What Gets Shared

✅ **Share these:**
- Entire project folder
- All source code
- Docker files
- Configuration files

❌ **Don't share these (they'll be created automatically):**
- `node_modules/` folders
- `target/` folders
- `.docker/` folders
- Docker images (will be built)

## Network Access (Optional)

If your friend wants to access it from another device on the same network:

1. Find your computer's IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. Your friend can access:
   - `http://YOUR_IP_ADDRESS` (instead of localhost)

**Note:** Make sure firewall allows connections on ports 80, 8081, 8082

## Summary

1. Friend installs Docker Desktop
2. Friend gets the project folder (zip/Git)
3. Friend runs: `docker-compose up --build`
4. Friend opens: http://localhost
5. Done! 🎉

No need to install Java, Node.js, PostgreSQL, or any other dependencies - Docker handles everything!

