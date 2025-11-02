from fastapi import APIRouter, HTTPException, Depends, status, Form
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
from app.schemas.user import UserCreate, UserResponse, Token
from app.utils.auth import get_password_hash, verify_password, create_access_token, verify_token
from app.database import get_database
from bson import ObjectId

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=dict)
async def register_user(user: UserCreate):
    db = get_database()
    
    # Check if username exists
    existing_username = await db.users.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists. Please choose a different username.")
    
    # Check if email exists
    existing_email = await db.users.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or login with existing account.")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "user_type": user.user_type,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.users.insert_one(user_doc)
    return {
        "message": "Registration successful! You can now login with your credentials.",
        "user_id": str(result.inserted_id),
        "username": user.username
    }

@router.post("/login", response_model=Token)
async def login_user(username: str = Form(), password: str = Form()):
    db = get_database()
    
    # Find user by username
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="Username not found. Please check your username or register a new account.")
    
    # Verify password
    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="Account is deactivated. Please contact support.")
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=dict)
async def get_user_profile(token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "full_name": user["full_name"],
        "user_type": user["user_type"],
        "created_at": user["created_at"]
    }

@router.put("/profile", response_model=dict)
async def update_user_profile(full_name: str = None, email: str = None, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    update_data = {}
    if full_name:
        update_data["full_name"] = full_name
    if email:
        update_data["email"] = email
    
    if update_data:
        await db.users.update_one({"username": username}, {"$set": update_data})
    
    return {"message": "Profile updated successfully"}