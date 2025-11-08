# CodeVerse - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Install Docker Desktop
- **Windows/Mac**: Download from https://www.docker.com/products/docker-desktop/
- **Linux**: Install Docker and Docker Compose

### Step 2: Run the Start Script
- **Windows**: Double-click `start.bat`
- **Mac/Linux**: Run `./start.sh` in terminal

**OR manually run:**
```bash
docker-compose up --build
```

### Step 3: Open in Browser
Go to: **http://localhost**

That's it! 🎉

---

## 📋 What You Need

- **Docker Desktop** installed and running
- **Internet connection** (first time only - to download images)
- **5-10 minutes** for first build

## 🌐 Access Points

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **Code Execution**: http://localhost:8082

## 🛠️ Common Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

## ❓ Troubleshooting

**Port already in use?**
- Stop other services using ports 80, 8081, 8082
- Or edit `docker-compose.yml` to change ports

**Docker not running?**
- Make sure Docker Desktop is started
- Check the whale icon in system tray/menu bar

**Can't access frontend?**
- Wait 30 seconds for all services to start
- Check logs: `docker-compose logs frontend`

## 📚 More Help

See `SHARING_GUIDE.md` for detailed instructions.

---

**No need to install Java, Node.js, PostgreSQL, or any other dependencies!**
Docker handles everything automatically. 🐳

