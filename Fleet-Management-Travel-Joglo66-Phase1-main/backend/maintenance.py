from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import MaintenanceRecord, MaintenanceRecordCreate, WorkOrder, WorkOrderCreate, User
from auth import get_current_user


maintenance_router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

# Database will be injected from server.py
db = None
work_orders_router = APIRouter(prefix="/work-orders", tags=["Work Orders"])

# Database will be injected from server.py
db = None

# Maintenance Records
@maintenance_router.get("", response_model=List[MaintenanceRecord])
async def get_maintenance_records(current_user: User = Depends(get_current_user)):
    """Get all maintenance records"""
    records = await db.maintenance_records.find({}, {"_id": 0}).to_list(1000)
    return records

@maintenance_router.post("", response_model=MaintenanceRecord)
async def create_maintenance_record(record: MaintenanceRecordCreate, current_user: User = Depends(get_current_user)):
    """Create a new maintenance record"""
    record_id = f"mnt_{uuid.uuid4().hex[:12]}"
    record_doc = record.dict()
    record_doc["record_id"] = record_id
    record_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.maintenance_records.insert_one(record_doc)
    
    return MaintenanceRecord(**record_doc)

@maintenance_router.get("/{record_id}", response_model=MaintenanceRecord)
async def get_maintenance_record(record_id: str, current_user: User = Depends(get_current_user)):
    """Get maintenance record by ID"""
    record = await db.maintenance_records.find_one({"record_id": record_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return MaintenanceRecord(**record)

@maintenance_router.delete("/{record_id}")
async def delete_maintenance_record(record_id: str, current_user: User = Depends(get_current_user)):
    """Delete maintenance record"""
    result = await db.maintenance_records.delete_one({"record_id": record_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return {"message": "Maintenance record deleted successfully"}

# Work Orders
@work_orders_router.get("", response_model=List[WorkOrder])
async def get_work_orders(current_user: User = Depends(get_current_user)):
    """Get all work orders"""
    orders = await db.work_orders.find({}, {"_id": 0}).to_list(1000)
    return orders

@work_orders_router.post("", response_model=WorkOrder)
async def create_work_order(order: WorkOrderCreate, current_user: User = Depends(get_current_user)):
    """Create a new work order"""
    order_id = f"wo_{uuid.uuid4().hex[:12]}"
    order_doc = order.dict()
    order_doc["order_id"] = order_id
    order_doc["created_at"] = datetime.now(timezone.utc)
    
    await db.work_orders.insert_one(order_doc)
    
    return WorkOrder(**order_doc)

@work_orders_router.get("/{order_id}", response_model=WorkOrder)
async def get_work_order(order_id: str, current_user: User = Depends(get_current_user)):
    """Get work order by ID"""
    order = await db.work_orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Work order not found")
    return WorkOrder(**order)

@work_orders_router.put("/{order_id}", response_model=WorkOrder)
async def update_work_order(order_id: str, order: WorkOrderCreate, current_user: User = Depends(get_current_user)):
    """Update work order"""
    existing = await db.work_orders.find_one({"order_id": order_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Work order not found")
    
    await db.work_orders.update_one(
        {"order_id": order_id},
        {"$set": order.dict()}
    )
    
    updated_order = await db.work_orders.find_one({"order_id": order_id}, {"_id": 0})
    return WorkOrder(**updated_order)

@work_orders_router.delete("/{order_id}")
async def delete_work_order(order_id: str, current_user: User = Depends(get_current_user)):
    """Delete work order"""
    result = await db.work_orders.delete_one({"order_id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Work order not found")
    return {"message": "Work order deleted successfully"}
