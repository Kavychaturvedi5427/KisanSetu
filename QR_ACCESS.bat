@echo off
setlocal enabledelayedexpansion
echo 📱 Kisan Setu - QR Code Access
echo.

for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4" ^| findstr "192.168"') do (
    set ip=%%i
    set ip=!ip: =!
    if not "!ip!"=="" (
        echo 📍 IP: !ip!
        echo 📱 QR Code: https://api.qrserver.com/v1/create-qr-code/?size=200x200^&data=http://!ip!:5173
        echo.
        echo 🌐 Open this URL on any device to get QR code:
        echo https://api.qrserver.com/v1/create-qr-code/?size=200x200^&data=http://!ip!:5173
        echo.
        start "QR Code" "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://!ip!:5173"
    )
)

echo.
pause