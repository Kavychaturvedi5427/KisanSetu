@echo off
echo 🌾 Kisan Setu - Complete Setup
echo.

echo 📋 System Requirements Check...
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found!
    echo 📥 Please install Python 3.8+ from: https://python.org/downloads
    pause
    exit
)
echo ✅ Python found

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo 📥 Please install Node.js from: https://nodejs.org
    pause
    exit
)
echo ✅ Node.js found

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    echo 📥 Please install npm (comes with Node.js)
    pause
    exit
)
echo ✅ npm found

echo.
echo 📦 Installing Backend Dependencies...
cd /d "%~dp0backend"
pip install fastapi uvicorn motor pymongo python-dotenv bcrypt python-jose[cryptography] python-multipart

echo.
echo 📦 Installing Frontend Dependencies...
cd /d "%~dp0react-frontend"
npm install

echo.
echo ✅ Setup Complete!
echo 🚀 Run START.bat to launch the application
echo.
pause