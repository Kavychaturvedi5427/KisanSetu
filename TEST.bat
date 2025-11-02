@echo off
echo 🧪 Testing Kisan Setu Setup...
echo.

echo 🐍 Checking Python...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found
    goto :end
)

echo 📦 Checking Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found
    goto :end
)

echo 🔍 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is running
) else (
    echo ⚠️ MongoDB not running - will start with Docker
)

echo 🔧 Testing Backend...
cd backend
python -c "import fastapi, uvicorn, pymongo; print('✅ Backend dependencies OK')"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend dependencies missing
    goto :end
)
cd ..

echo 🎨 Testing Frontend...
cd react-frontend
if exist node_modules (
    echo ✅ Frontend dependencies OK
) else (
    echo ⚠️ Frontend dependencies not installed
)
cd ..

echo.
echo ✅ System check complete!
echo 🚀 Run INSTALL.bat then START.bat

:end
pause