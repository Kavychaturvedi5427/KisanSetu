@echo off
setlocal enabledelayedexpansion
echo 🔧 Kisan Setu - Mobile Access Fix
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4" ^| findstr "192.168"') do (
    set ip=%%i
    set ip=!ip: =!
    if not "!ip!"=="" (
        echo 📍 Detected IP: !ip!
        
        REM Update frontend .env file
        echo VITE_API_URL=http://!ip!:8001> react-frontend\.env
        echo VITE_WEATHER_API_KEY=3a680fa13cc9c4be860368ea425c7667>> react-frontend\.env
        
        echo ✅ Updated frontend configuration
        echo 🌐 Backend will be accessible at: http://!ip!:8001
        echo 📱 Frontend will be accessible at: http://!ip!:5173
        echo.
        echo 🚀 Now run START.bat to launch the application
        echo 📱 Mobile/other devices can access: http://!ip!:5173
        echo.
        
        REM Generate QR code
        echo 📱 QR Code: https://api.qrserver.com/v1/create-qr-code/?size=200x200^&data=http://!ip!:5173
        start "QR Code" "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://!ip!:5173"
        
        goto :found
    )
)

echo ❌ Could not detect IP address
echo 💡 Please manually update react-frontend\.env with your IP address
echo    Example: VITE_API_URL=http://YOUR_IP:8001

:found
echo.
pause