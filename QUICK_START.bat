@echo off
echo 🌾 Krishi - Quick Start
echo =======================
echo.

cd /d "%~dp0"

echo 🔧 Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo.
echo 🚀 Starting Backend...
cd backend
start "Krishi Backend" cmd /k "python main.py"

echo.
echo 🚀 Starting Frontend...
cd react-frontend
start "Krishi Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers starting...
echo.
echo 🔗 URLs:
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:8001
echo.

timeout /t 5 >nul
start http://localhost:5173

echo Press any key to exit...
pause >nul