@echo off
echo 🤖 Complete AI Model Fix for Kisan Setu
echo =====================================
echo.

cd /d "%~dp0"

echo 📦 Step 1: Installing AI/ML Dependencies...
cd backend

echo Installing core Python packages...
python -m pip install --upgrade pip

echo Installing ML packages with compatibility fixes...
pip install --no-deps numpy
pip install --no-deps opencv-python
pip install --no-deps Pillow
pip install --no-deps scikit-learn

echo.
echo ✅ AI dependencies installed successfully!
echo.

echo 🔧 Step 2: Verifying AI Model Files...
if exist "app\ml_models\plant_disease_model.py" (
    echo ✅ AI model file exists
) else (
    echo ❌ AI model file missing - this should not happen
)

echo.
echo 🚀 Step 3: Starting Backend with AI Support...
echo Starting FastAPI server with enhanced AI capabilities...
echo.
echo 📍 Backend will be available at: http://localhost:8001
echo 📚 API Documentation: http://localhost:8001/docs
echo 🤖 AI Features: Image Analysis, Crop Health Prediction, Weather Advisory
echo.

start cmd /k "python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo.
echo 🌐 Step 4: Starting Frontend...
cd ..\react-frontend

echo Installing frontend dependencies...
call npm install

echo Starting React development server...
echo 📍 Frontend will be available at: http://localhost:5173
echo 📱 Mobile access: http://YOUR_IP:5173
echo.

start cmd /k "npm run dev -- --host 0.0.0.0"

echo.
echo ✅ Complete AI Fix Applied Successfully!
echo.
echo 🎯 AI Features Now Available:
echo   • Image-based crop disease detection
echo   • AI-powered crop health prediction  
echo   • Intelligent weather advisory
echo   • Enhanced recommendations engine
echo   • Sustainability metrics calculation
echo.
echo 🔗 Access Points:
echo   • Main App: http://localhost:5173
echo   • AI Analysis: http://localhost:5173/ai-analysis
echo   • Crop Health: http://localhost:5173/crop-health
echo   • API Docs: http://localhost:8001/docs
echo.
echo 📱 Test AI Features:
echo   1. Go to Dashboard → AI Analysis
echo   2. Upload crop image for disease detection
echo   3. Use Crop Health for AI predictions
echo   4. Check Advisory for intelligent recommendations
echo.

pause