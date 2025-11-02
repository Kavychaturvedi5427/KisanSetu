# 🌾 Kisan Setu - Setup Guide

## 🚀 Quick Setup

### Step 1: Install Dependencies
```bash
INSTALL.bat
```

### Step 2: Start Application
```bash
START.bat
```

### Step 3: Access
- Frontend: http://localhost:5173
- Backend: http://localhost:8001

## 🔧 Manual Setup

### Backend:
```bash
cd backend
pip install -r requirements.txt
python create_admin.py
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend:
```bash
cd react-frontend
npm install
npm run dev
```

## 🔑 Login
- Username: admin
- Password: password

## ❌ Common Issues

### MongoDB not running:
```bash
docker run -d -p 27017:27017 --name mongodb-kisansetu mongo
```

### Port already in use:
- Kill processes on ports 8001 and 5173
- Or change ports in .env files

### Dependencies fail:
- Ensure Python 3.8+ and Node.js 16+ are installed
- Run as administrator if needed

---
**🌾 Kisan Setu - Ready to Demo!**