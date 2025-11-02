@echo off
echo 📱 Kisan Setu - Mobile Access Setup
echo.
echo 🔍 Finding your computer's IP address...
echo.

for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%i
    set ip=!ip: =!
    if not "!ip!"=="" (
        echo 📍 Your IP Address: !ip!
        echo.
        echo 📱 Access on Mobile:
        echo    Frontend: http://!ip!:5173
        echo    Backend:  http://!ip!:8001
        echo.
    )
)

echo 🔥 Make sure your mobile and computer are on the same WiFi network!
echo.
pause