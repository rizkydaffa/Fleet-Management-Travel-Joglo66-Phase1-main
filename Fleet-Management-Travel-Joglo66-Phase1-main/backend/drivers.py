from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Driver, DriverCreate, DriverAssignment, DriverAssignmentCreate, User
from auth import get_current_user


drivers_router = APIRouter(prefix="/drivers", tags=["Drivers"])

# Database will be injected from server.py
db = None

@drivers_router.get("", response_model=List[Driver])
async def get_drivers(current_user: User = Depends(get_current_user)):
    """Get all drivers"""
    drivers = await db.drivers.find({}, {"_id": 0}).to_list(1000)
    return drivers

@drivers_router.post("", response_model=Driver)
async def create_driver(driver: DriverCreate, current_user: User = Depends(get_current_user)):
    """Create a new driver"""
    driver_id = f"drv_{uuid.uuid4().hex[:12]}"
    driver_doc = driver.dict()
    driver_doc["driver_id"] = driver_id
    driver_doc["documents"] = []
    driver_doc["performance_notes"] = []
    driver_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.drivers.insert_one(driver_doc)
    
    return Driver(**driver_doc)

@drivers_router.get("/{driver_id}", response_model=Driver)
async def get_driver(driver_id: str, current_user: User = Depends(get_current_user)):
    """Get driver by ID"""
    driver = await db.drivers.find_one({"driver_id": driver_id}, {"_id": 0})
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return Driver(**driver)

@drivers_router.put("/{driver_id}", response_model=Driver)
async def update_driver(driver_id: str, driver: DriverCreate, current_user: User = Depends(get_current_user)):
    """Update driver"""
    existing = await db.drivers.find_one({"driver_id": driver_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    await db.drivers.update_one(
        {"driver_id": driver_id},
        {"$set": driver.dict()}
    )
    
    updated_driver = await db.drivers.find_one({"driver_id": driver_id}, {"_id": 0})
    return Driver(**updated_driver)

@drivers_router.delete("/{driver_id}")
async def delete_driver(driver_id: str, current_user: User = Depends(get_current_user)):
    """Delete driver"""
    result = await db.drivers.delete_one({"driver_id": driver_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"message": "Driver deleted successfully"}

# Driver Assignments
@drivers_router.get("/{driver_id}/assignments", response_model=List[DriverAssignment])
async def get_driver_assignments(driver_id: str, current_user: User = Depends(get_current_user)):
    """Get all assignments for a driver"""
    assignments = await db.driver_assignments.find({"driver_id": driver_id}, {"_id": 0}).to_list(1000)
    return assignments

@drivers_router.post("/{driver_id}/assignments", response_model=DriverAssignment)
async def create_driver_assignment(driver_id: str, assignment: DriverAssignmentCreate, current_user: User = Depends(get_current_user)):
    """Assign driver to vehicle"""
    assignment_id = f"asn_{uuid.uuid4().hex[:12]}"
    assignment_doc = assignment.dict()
    assignment_doc["assignment_id"] = assignment_id
    assignment_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.driver_assignments.insert_one(assignment_doc)
    
    return DriverAssignment(**assignment_doc)
