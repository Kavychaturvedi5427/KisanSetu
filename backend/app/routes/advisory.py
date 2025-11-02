from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from app.utils.auth import verify_token
import requests
import os
from typing import Dict, Any

router = APIRouter()
security = HTTPBearer()

@router.post("/predict", response_model=dict)
async def predict_crop_health(crop_name: str, symptoms: str, image_url: str = None, token: str = Depends(security)):
    username = verify_token(token.credentials)
    
    # Enhanced ML prediction simulation
    predictions = {
        "rice": {
            "blight": {"treatment": "Apply copper-based fungicide (Bordeaux mixture)", "severity": "High", "prevention": "Improve field drainage and avoid overhead irrigation"},
            "yellowing": {"treatment": "Apply nitrogen fertilizer (Urea 46%)", "severity": "Medium", "prevention": "Regular soil testing and balanced fertilization"},
            "brown_spots": {"treatment": "Use Tricyclazole fungicide", "severity": "High", "prevention": "Use disease-resistant varieties"}
        },
        "wheat": {
            "rust": {"treatment": "Apply Propiconazole fungicide", "severity": "High", "prevention": "Plant rust-resistant varieties like HD-3086"},
            "wilting": {"treatment": "Improve drainage and reduce irrigation", "severity": "Medium", "prevention": "Ensure proper field preparation and drainage"},
            "leaf_spots": {"treatment": "Use Mancozeb fungicide", "severity": "Medium", "prevention": "Avoid dense planting"}
        },
        "corn": {
            "spots": {"treatment": "Apply neem oil or Carbendazim", "severity": "Medium", "prevention": "Maintain proper plant spacing"},
            "stunting": {"treatment": "Check and adjust soil pH (6.0-7.0)", "severity": "High", "prevention": "Regular soil testing and lime application"},
            "yellowing": {"treatment": "Apply nitrogen and zinc fertilizers", "severity": "Medium", "prevention": "Balanced fertilization program"}
        },
        "tomato": {
            "blight": {"treatment": "Apply Metalaxyl + Mancozeb", "severity": "High", "prevention": "Avoid overhead watering, ensure good air circulation"},
            "wilting": {"treatment": "Check for bacterial wilt, remove affected plants", "severity": "High", "prevention": "Crop rotation and soil sterilization"},
            "leaf_curl": {"treatment": "Control whiteflies, apply imidacloprid", "severity": "Medium", "prevention": "Use yellow sticky traps"}
        }
    }
    
    crop_lower = crop_name.lower()
    symptoms_lower = symptoms.lower()
    
    # Default response
    result = {
        "crop": crop_name,
        "symptoms": symptoms,
        "prediction": "Healthy",
        "recommendation": "Continue regular care: proper watering, fertilization, and monitoring",
        "severity": "Low",
        "prevention": "Maintain good agricultural practices",
        "confidence": 0.75,
        "next_steps": ["Monitor crop regularly", "Maintain proper nutrition", "Ensure adequate water supply"]
    }
    
    # Check for disease symptoms
    if crop_lower in predictions:
        for symptom, details in predictions[crop_lower].items():
            if symptom in symptoms_lower or any(word in symptoms_lower for word in symptom.split('_')):
                result.update({
                    "prediction": f"{symptom.replace('_', ' ').title()} Detected",
                    "recommendation": details["treatment"],
                    "severity": details["severity"],
                    "prevention": details["prevention"],
                    "confidence": 0.87,
                    "next_steps": [
                        "Apply recommended treatment immediately",
                        "Monitor crop response after 3-5 days",
                        "Consult local agricultural expert if symptoms persist",
                        "Implement prevention measures for future crops"
                    ]
                })
                break
    
    return result

@router.get("/weather", response_model=dict)
async def get_weather_info(city: str = "Delhi", token: str = Depends(security)):
    username = verify_token(token.credentials)
    
    try:
        # Try to get real weather data
        weather_api_key = os.getenv("WEATHER_API_KEY")
        if weather_api_key and weather_api_key != "your-weather-api-key":
            weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={weather_api_key}&units=metric"
            response = requests.get(weather_url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "city": city,
                    "temperature": round(data["main"]["temp"]),
                    "humidity": data["main"]["humidity"],
                    "description": data["weather"][0]["description"].title(),
                    "wind_speed": round(data["wind"]["speed"] * 3.6),  # Convert m/s to km/h
                    "pressure": data["main"]["pressure"],
                    "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                    "forecast": [
                        {"day": "Today", "temp_max": 32, "temp_min": 24, "condition": "Sunny", "advice": "Good day for field work"},
                        {"day": "Tomorrow", "temp_max": 30, "temp_min": 22, "condition": "Cloudy", "advice": "Monitor for rain"},
                        {"day": "Day 3", "temp_max": 28, "temp_min": 20, "condition": "Rain", "advice": "Avoid irrigation"}
                    ],
                    "farming_advice": generate_weather_advice(data)
                }
    except Exception as e:
        print(f"Weather API error: {e}")
    
    # Fallback mock data
    weather_data = {
        "city": city,
        "temperature": 28,
        "humidity": 65,
        "description": "Partly Cloudy",
        "wind_speed": 12,
        "pressure": 1013,
        "visibility": 10,
        "forecast": [
            {"day": "Today", "temp_max": 32, "temp_min": 24, "condition": "Sunny", "advice": "Good day for field work"},
            {"day": "Tomorrow", "temp_max": 30, "temp_min": 22, "condition": "Cloudy", "advice": "Monitor for rain"},
            {"day": "Day 3", "temp_max": 28, "temp_min": 20, "condition": "Rain", "advice": "Avoid irrigation"}
        ],
        "farming_advice": "Moderate weather conditions. Good for most farming activities."
    }
    
    return weather_data

def generate_weather_advice(weather_data):
    temp = weather_data["main"]["temp"]
    humidity = weather_data["main"]["humidity"]
    
    if temp > 35:
        return "Very hot weather. Increase irrigation frequency and provide shade for crops."
    elif temp < 10:
        return "Cold weather. Protect crops from frost and reduce watering."
    elif humidity > 80:
        return "High humidity. Watch for fungal diseases and ensure good ventilation."
    elif humidity < 30:
        return "Low humidity. Increase irrigation and consider mulching."
    else:
        return "Favorable weather conditions for most farming activities."

@router.get("/recommendations", response_model=dict)
async def get_farming_recommendations(season: str = "current", token: str = Depends(security)):
    username = verify_token(token.credentials)
    
    recommendations = {
        "current": [
            "Monitor soil moisture levels regularly",
            "Apply organic fertilizer for better yield",
            "Check for pest infestations weekly"
        ],
        "summer": [
            "Increase irrigation frequency",
            "Use mulching to retain soil moisture",
            "Plant heat-resistant varieties"
        ],
        "winter": [
            "Protect crops from frost",
            "Reduce watering frequency",
            "Apply winter fertilizers"
        ],
        "monsoon": [
            "Ensure proper drainage",
            "Watch for fungal diseases",
            "Harvest before heavy rains"
        ]
    }
    
    return {
        "season": season,
        "recommendations": recommendations.get(season, recommendations["current"]),
        "updated_at": "2025-01-27"
    }