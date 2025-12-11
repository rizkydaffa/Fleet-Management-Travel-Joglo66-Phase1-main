from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import FuelLog, FuelLogCreate, User
from auth import get_current_user


fuel_router = APIRouter(prefix="/fuel", tags=["Fuel"])

# Database will be injected from server.py
db = None

@fuel_router.get("", response_model=List[FuelLog])
async def get_fuel_logs(current_user: User = Depends(get_current_user)):
    """Get all fuel logs"""
    logs = await db.fuel_logs.find({}, {"_id": 0}).to_list(1000)
    return logs

@fuel_router.post("", response_model=FuelLog)
async def create_fuel_log(log: FuelLogCreate, current_user: User = Depends(get_current_user)):
    """Create a new fuel log"""
    log_id = f"fuel_{uuid.uuid4().hex[:12]}"
    log_doc = log.dict()
    log_doc["log_id"] = log_id
    log_doc["created_at"] = datetime.now(timezone.utc)
    
    # Calculate cost per km if not provided
    if log_doc["cost_per_km"] == 0 and log_doc["quantity"] > 0:
        log_doc["cost_per_km"] = round(log_doc["cost"] / log_doc["quantity"], 2)
    
    await db.fuel_logs.insert_one(log_doc)
    
    return FuelLog(**log_doc)

@fuel_router.get("/{log_id}", response_model=FuelLog)
async def get_fuel_log(log_id: str, current_user: User = Depends(get_current_user)):
    """Get fuel log by ID"""
    log = await db.fuel_logs.find_one({"log_id": log_id}, {"_id": 0})
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    return FuelLog(**log)

@fuel_router.delete("/{log_id}")
async def delete_fuel_log(log_id: str, current_user: User = Depends(get_current_user)):
    """Delete fuel log"""
    result = await db.fuel_logs.delete_one({"log_id": log_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    return {"message": "Fuel log deleted successfully"}
