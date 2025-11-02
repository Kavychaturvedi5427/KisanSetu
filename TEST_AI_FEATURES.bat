@echo off
echo 🧪 Testing AI Features - Kisan Setu
echo ===================================
echo.

cd /d "%~dp0\backend"

echo 🔍 Testing AI Model Import...
python -c "
try:
    from app.ml_models.plant_disease_model import plant_disease_model
    print('✅ AI Model imported successfully')
    print(f'   Dependencies available: {plant_disease_model.available}')
    
    # Test image analysis
    import io
    test_result = plant_disease_model.analyze_image(b'fake_image_data', 'tomato')
    print(f'✅ Image analysis test: {test_result[\"success\"]}')
    print(f'   Health score: {test_result.get(\"overall_health_score\", \"N/A\")}')
    print(f'   Model type: {test_result.get(\"model_type\", \"N/A\")}')
    
except Exception as e:
    print(f'❌ AI Model test failed: {e}')
"

echo.
echo 🌐 Testing API Endpoints...
echo.

echo Testing crop health prediction...
curl -X POST "http://localhost:8001/api/advisory/predict?crop=wheat&season=winter&soil_type=loamy" 2>nul || echo "Backend not running - start with COMPLETE_AI_FIX.bat"

echo.
echo 📊 AI Feature Status:
echo   • Crop Health Prediction: Enhanced with AI logic
echo   • Image Analysis: Available with fallback
echo   • Weather Advisory: AI-powered recommendations  
echo   • Sustainability Metrics: Intelligent calculations
echo.
echo 🎯 To test full AI features:
echo   1. Run COMPLETE_AI_FIX.bat to start the application
echo   2. Go to http://localhost:5173/ai-analysis
echo   3. Upload a crop image or run health prediction
echo   4. Check the enhanced recommendations
echo.

pause