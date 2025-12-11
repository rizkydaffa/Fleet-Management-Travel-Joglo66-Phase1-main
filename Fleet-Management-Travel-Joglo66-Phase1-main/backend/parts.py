from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Part, PartCreate, User
from auth import get_current_user


parts_router = APIRouter(prefix="/parts", tags=["Parts"])

# Database will be injected from server.py
db = None

@parts_router.get("", response_model=List[Part])
async def get_parts(current_user: User = Depends(get_current_user)):
    """Get all parts"""
    parts = await db.parts_inventory.find({}, {"_id": 0}).to_list(1000)
    return parts

@parts_router.post("", response_model=Part)
async def create_part(part: PartCreate, current_user: User = Depends(get_current_user)):
    """Create a new part"""
    part_id = f"prt_{uuid.uuid4().hex[:12]}"
    part_doc = part.dict()
    part_doc["part_id"] = part_id
    part_doc["created_at"] = datetime.now(timezone.utc)
    part_doc["updated_at"] = datetime.now(timezone.utc)
    
    await db.parts_inventory.insert_one(part_doc)
    
    return Part(**part_doc)

@parts_router.get("/{part_id}", response_model=Part)
async def get_part(part_id: str, current_user: User = Depends(get_current_user)):
    """Get part by ID"""
    part = await db.parts_inventory.find_one({"part_id": part_id}, {"_id": 0})
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return Part(**part)

@parts_router.put("/{part_id}", response_model=Part)
async def update_part(part_id: str, part: PartCreate, current_user: User = Depends(get_current_user)):
    """Update part"""
    existing = await db.parts_inventory.find_one({"part_id": part_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Part not found")
    
    update_data = part.dict()
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.parts_inventory.update_one(
        {"part_id": part_id},
        {"$set": update_data}
    )
    
    updated_part = await db.parts_inventory.find_one({"part_id": part_id}, {"_id": 0})
    return Part(**updated_part)

@parts_router.delete("/{part_id}")
async def delete_part(part_id: str, current_user: User = Depends(get_current_user)):
    """Delete part"""
    result = await db.parts_inventory.delete_one({"part_id": part_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": "Part deleted successfully"}
