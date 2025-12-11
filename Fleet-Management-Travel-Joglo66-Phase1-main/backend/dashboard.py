from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta
from models import DashboardStats, User
from auth import get_current_user


dashboard_router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Database will be injected from server.py
db = None

@dashboard_router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Get dashboard statistics"""
    
    # Get counts
    total_vehicles = await db.vehicles.count_documents({})
    active_vehicles = await db.vehicles.count_documents({"status": "Active"})
    maintenance_vehicles = await db.vehicles.count_documents({"status": "Maintenance"})
    
    total_drivers = await db.drivers.count_documents({})
    active_drivers = await db.drivers.count_documents({"status": "Active"})
    
    pending_work_orders = await db.work_orders.count_documents({"status": "Pending"})
    completed_work_orders = await db.work_orders.count_documents({"status": "Completed"})
    
    total_alerts = await db.alerts.count_documents({"status": "Active"})
    
    # Calculate monthly costs (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    
    fuel_logs = await db.fuel_logs.find({
        "date": {"$gte": thirty_days_ago}
    }).to_list(1000)
    monthly_fuel_cost = sum(log["cost"] for log in fuel_logs)
    
    maintenance_records = await db.maintenance_records.find({
        "date": {"$gte": thirty_days_ago}
    }).to_list(1000)
    monthly_maintenance_cost = sum(record["cost"] for record in maintenance_records)
    
    # Calculate average fuel efficiency
    if fuel_logs:
        total_fuel = sum(log["quantity"] for log in fuel_logs)
        if total_fuel > 0:
            avg_fuel_efficiency = round(sum(log.get("odometer", 0) for log in fuel_logs) / total_fuel, 2)
        else:
            avg_fuel_efficiency = 0
    else:
        avg_fuel_efficiency = 0
    
    # Calculate total mileage this month
    total_mileage = sum(log.get("odometer", 0) for log in fuel_logs)
    
    return DashboardStats(
        totalVehicles=total_vehicles,
        activeVehicles=active_vehicles,
        maintenanceVehicles=maintenance_vehicles,
        totalDrivers=total_drivers,
        activeDrivers=active_drivers,
        pendingWorkOrders=pending_work_orders,
        completedWorkOrders=completed_work_orders,
        totalAlerts=total_alerts,
        monthlyFuelCost=monthly_fuel_cost,
        monthlyMaintenanceCost=monthly_maintenance_cost,
        avgFuelEfficiency=avg_fuel_efficiency,
        totalMileageThisMonth=int(total_mileage)
    )
