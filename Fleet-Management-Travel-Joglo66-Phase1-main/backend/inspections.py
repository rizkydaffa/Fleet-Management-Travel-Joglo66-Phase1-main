from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Inspection, InspectionCreate, User
from auth import get_current_user


inspections_router = APIRouter(prefix="/inspections", tags=["Inspections"])

# Database will be injected from server.py
db = None

@inspections_router.get("", response_model=List[Inspection])
async def get_inspections(current_user: User = Depends(get_current_user)):
    """Get all inspections"""
    inspections = await db.inspections.find({}, {"_id": 0}).to_list(1000)
    return inspections

@inspections_router.post("", response_model=Inspection)
async def create_inspection(inspection: InspectionCreate, current_user: User = Depends(get_current_user)):
    """Create a new inspection"""
    inspection_id = f"insp_{uuid.uuid4().hex[:12]}"
    inspection_doc = inspection.dict()
    inspection_doc["inspection_id"] = inspection_id
    inspection_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.inspections.insert_one(inspection_doc)
    
    return Inspection(**inspection_doc)

@inspections_router.get("/{inspection_id}", response_model=Inspection)
async def get_inspection(inspection_id: str, current_user: User = Depends(get_current_user)):
    """Get inspection by ID"""
    inspection = await db.inspections.find_one({"inspection_id": inspection_id}, {"_id": 0})
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return Inspection(**inspection)

@inspections_router.put("/{inspection_id}", response_model=Inspection)
async def update_inspection(inspection_id: str, inspection: InspectionCreate, current_user: User = Depends(get_current_user)):
    """Update inspection"""
    existing = await db.inspections.find_one({"inspection_id": inspection_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    await db.inspections.update_one(
        {"inspection_id": inspection_id},
        {"$set": inspection.dict()}
    )
    
    updated_inspection = await db.inspections.find_one({"inspection_id": inspection_id}, {"_id": 0})
    return Inspection(**updated_inspection)

@inspections_router.post("/{inspection_id}/approve")
async def approve_inspection(inspection_id: str, current_user: User = Depends(get_current_user)):
    """Approve inspection"""
    inspection = await db.inspections.find_one({"inspection_id": inspection_id})
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    await db.inspections.update_one(
        {"inspection_id": inspection_id},
        {"$set": {
            "status": "Approved",
            "approved_by": current_user.user_id
        }}
    )
    
    return {"message": "Inspection approved successfully"}
