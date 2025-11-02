@echo off
echo 🌾 Kisan Setu - Starting Application...
echo.

REM Check if Node.js is installed
node --version >NUL 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >NUL 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found! Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check MongoDB
echo 🔍 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is running
) else (
    echo ⚠️ MongoDB not running - Backend will use mock database
    echo 📝 Note: Registration will work but data won't persist
)

echo.
echo 🚀 Starting Backend...
start "Backend" cmd /k "cd /d %~dp0backend && echo Installing backend dependencies... && pip install -r requirements.txt && echo Starting backend server... && python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo 🎨 Installing Frontend Dependencies...
cd /d "%~dp0react-frontend"
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)

echo 🎨 Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0react-frontend && echo Starting frontend server... && npm run dev -- --host 0.0.0.0 --port 5173"

cd /d "%~dp0"
echo.
echo ✅ Kisan Setu is starting!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.
echo 🔑 Demo Login: admin / password
echo 📝 Registration: Works with any valid data
echo.
echo ⏳ Waiting for servers to start...
timeout /t 8 >NUL
start http://localhost:5173

pause