from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from typing import List
from models import Alert, AlertCreate, User
from auth import get_current_user


alerts_router = APIRouter(prefix="/alerts", tags=["Alerts"])

# Database will be injected from server.py
db = None

@alerts_router.get("", response_model=List[Alert])
async def get_alerts(current_user: User = Depends(get_current_user)):
    """Get all alerts"""
    alerts = await db.alerts.find({}, {"_id": 0}).to_list(1000)
    return alerts

@alerts_router.post("", response_model=Alert)
async def create_alert(alert: AlertCreate, current_user: User = Depends(get_current_user)):
    """Create a new alert"""
    alert_id = f"alt_{uuid.uuid4().hex[:12]}"
    alert_doc = alert.dict()
    alert_doc["alert_id"] = alert_id
    alert_doc["created_at"] = datetime.now(timezone.utc)
    alert_doc["resolved_at"] = None
    
    await db.alerts.insert_one(alert_doc)
    
    return Alert(**alert_doc)

@alerts_router.put("/{alert_id}")
async def update_alert(alert_id: str, status: str, current_user: User = Depends(get_current_user)):
    """Update/dismiss alert"""
    alert = await db.alerts.find_one({"alert_id": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    update_data = {"status": status}
    if status in ["Dismissed", "Resolved"]:
        update_data["resolved_at"] = datetime.now(timezone.utc)
    
    await db.alerts.update_one(
        {"alert_id": alert_id},
        {"$set": update_data}
    )
    
    return {"message": "Alert updated successfully"}
