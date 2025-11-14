@echo off
echo 🌾 Krishi - Complete Setup & Start
echo ===================================
echo.

cd /d "%~dp0"

echo 🔧 Killing any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo.
echo 📦 Installing Backend Dependencies...
cd backend
pip install -r requirements.txt

echo.
echo 📦 Installing Frontend Dependencies...
cd react-frontend
call npm install

echo.
echo 🌐 Starting Backend (Port 8001)...
cd ..
start /min cmd /c "python main.py"

echo.
echo 📱 Starting Frontend (Port 5173)...
cd react-frontend
start /min cmd /c "npm run dev"

echo.
echo ✅ Application Starting...
echo.
echo 🔗 Access URLs:
echo   • Frontend: http://localhost:5173
echo   • Backend API: http://localhost:8001
echo   • API Docs: http://localhost:8001/docs
echo.
echo 📱 Mobile Access:
echo   • Find your IP: ipconfig
echo   • Use: http://YOUR_IP:5173
echo.

timeout /t 8 >nul
start http://localhost:5173

echo 🎯 Opening browser in 8 seconds...
echo Press any key to exit this window...
pause >nul