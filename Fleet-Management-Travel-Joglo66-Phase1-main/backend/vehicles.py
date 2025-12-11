from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Vehicle, VehicleCreate, User
from auth import get_current_user

vehicles_router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

# Database will be injected from server.py
db = None

@vehicles_router.get("", response_model=List[Vehicle])
async def get_vehicles(current_user: User = Depends(get_current_user)):
    """Get all vehicles"""
    vehicles = await db.vehicles.find({}, {"_id": 0}).to_list(1000)
    return vehicles

@vehicles_router.post("", response_model=Vehicle)
async def create_vehicle(vehicle: VehicleCreate, current_user: User = Depends(get_current_user)):
    """Create a new vehicle"""
    vehicle_id = f"veh_{uuid.uuid4().hex[:12]}"
    vehicle_doc = vehicle.dict()
    vehicle_doc["vehicle_id"] = vehicle_id
    vehicle_doc["created_by"] = current_user.user_id
    vehicle_doc["created_at"] = datetime.now(timezone.utc)
    vehicle_doc["photos"] = []
    vehicle_doc["documents"] = []
    
    await db.vehicles.insert_one(vehicle_doc)
    
    return Vehicle(**vehicle_doc)

@vehicles_router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, current_user: User = Depends(get_current_user)):
    """Get vehicle by ID"""
    vehicle = await db.vehicles.find_one({"vehicle_id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return Vehicle(**vehicle)

@vehicles_router.put("/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: str, vehicle: VehicleCreate, current_user: User = Depends(get_current_user)):
    """Update vehicle"""
    existing = await db.vehicles.find_one({"vehicle_id": vehicle_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    await db.vehicles.update_one(
        {"vehicle_id": vehicle_id},
        {"$set": vehicle.dict()}
    )
    
    updated_vehicle = await db.vehicles.find_one({"vehicle_id": vehicle_id}, {"_id": 0})
    return Vehicle(**updated_vehicle)

@vehicles_router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, current_user: User = Depends(get_current_user)):
    """Delete vehicle"""
    result = await db.vehicles.delete_one({"vehicle_id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}
