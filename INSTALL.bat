@echo off
echo 🌾 Kisan Setu - Installing Dependencies...
echo.

echo 🐍 Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python installation failed
    pause
    exit /b 1
)

echo 👤 Creating admin user...
python create_admin.py

cd ..

echo 📦 Installing Node.js dependencies...
cd react-frontend
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js installation failed
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Installation complete!
echo 🚀 Run START.bat to launch the application
echo.
pause