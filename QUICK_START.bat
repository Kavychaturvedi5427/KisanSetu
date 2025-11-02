@echo off
echo 🚀 Quick Start - Kisan Setu
echo ===========================
echo.

cd /d "%~dp0"

echo 🔧 Killing any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo.
echo 🌐 Starting Backend (Port 8001)...
cd backend
start /min cmd /c "python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo.
echo 📱 Starting Frontend (Port 5173)...
cd ..\react-frontend
start /min cmd /c "npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo ✅ Application Starting...
echo.
echo 🔗 Access URLs:
echo   • Frontend: http://localhost:5173
echo   • Backend API: http://localhost:8001
echo   • API Docs: http://localhost:8001/docs
echo.
echo ⚠️  Note: Use port 5173, NOT 5174
echo.
echo 📱 Mobile Access:
echo   • Find your IP: ipconfig
echo   • Use: http://YOUR_IP:5173
echo.

timeout /t 5 >nul
start http://localhost:5173

echo 🎯 Opening browser in 5 seconds...
echo Press any key to exit this window...
pause >nul