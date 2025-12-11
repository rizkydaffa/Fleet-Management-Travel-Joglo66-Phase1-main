from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Tire, TireCreate, User
from auth import get_current_user


tires_router = APIRouter(prefix="/tires", tags=["Tires"])

# Database will be injected from server.py
db = None

@tires_router.get("", response_model=List[Tire])
async def get_tires(current_user: User = Depends(get_current_user)):
    """Get all tires"""
    tires = await db.tires.find({}, {"_id": 0}).to_list(1000)
    return tires

@tires_router.post("", response_model=Tire)
async def create_tire(tire: TireCreate, current_user: User = Depends(get_current_user)):
    """Create a new tire record"""
    tire_id = f"tire_{uuid.uuid4().hex[:12]}"
    tire_doc = tire.dict()
    tire_doc["tire_id"] = tire_id
    tire_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.tires.insert_one(tire_doc)
    
    return Tire(**tire_doc)

@tires_router.get("/{tire_id}", response_model=Tire)
async def get_tire(tire_id: str, current_user: User = Depends(get_current_user)):
    """Get tire by ID"""
    tire = await db.tires.find_one({"tire_id": tire_id}, {"_id": 0})
    if not tire:
        raise HTTPException(status_code=404, detail="Tire not found")
    return Tire(**tire)

@tires_router.put("/{tire_id}", response_model=Tire)
async def update_tire(tire_id: str, tire: TireCreate, current_user: User = Depends(get_current_user)):
    """Update tire"""
    existing = await db.tires.find_one({"tire_id": tire_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Tire not found")
    
    await db.tires.update_one(
        {"tire_id": tire_id},
        {"$set": tire.dict()}
    )
    
    updated_tire = await db.tires.find_one({"tire_id": tire_id}, {"_id": 0})
    return Tire(**updated_tire)

@tires_router.delete("/{tire_id}")
async def delete_tire(tire_id: str, current_user: User = Depends(get_current_user)):
    """Delete tire"""
    result = await db.tires.delete_one({"tire_id": tire_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tire not found")
    return {"message": "Tire deleted successfully"}
