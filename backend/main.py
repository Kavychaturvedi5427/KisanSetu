from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, farmers, marketplace, advisory, admin, location
from app.database import connect_to_mongo, close_mongo_connection, get_database
from datetime import datetime
import os

app = FastAPI(title="Kisan Setu API", version="1.0.0", description="AI-Powered Agricultural Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
async def startup_event():
    print("🌾 Starting Kisan Setu API...")
    await connect_to_mongo()
    print("✅ Kisan Setu API started successfully!")
    print("🌐 Server running at: http://localhost:8001")
    print("📚 API docs at: http://localhost:8001/docs")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(farmers.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(advisory.router, prefix="/api/advisory", tags=["Advisory"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(location.router, prefix="/api/location", tags=["Location"])

@app.get("/")
async def root():
    return {
        "message": "🌾 Kisan Setu API is running",
        "version": "1.0.0",
        "status": "healthy",
        "endpoints": {
            "auth": "/auth",
            "farmers": "/api/farmers", 
            "marketplace": "/api/marketplace",
            "advisory": "/api/advisory",
            "admin": "/api/admin",
            "location": "/api/location"
        }
    }

@app.get("/health")
async def health_check():
    try:
        db = get_database()
        db_status = "connected" if db and hasattr(db, 'users') else "mock"
    except:
        db_status = "mock"
    return {
        "status": "healthy", 
        "service": "Kisan Setu API",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)