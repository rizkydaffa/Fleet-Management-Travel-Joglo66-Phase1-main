from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# User Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "Admin"  # Admin, Manager, Mechanic, Driver
    created_at: datetime

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

# Vehicle Models
class VehicleCreate(BaseModel):
    plate: str
    brand: str
    model: str
    type: str  # Car, Van, Bus, Truck
    year: int
    vin: Optional[str] = None
    color: Optional[str] = None
    registration_expiry: Optional[str] = None
    mileage: int = 0
    fuel_type: str  # Petrol, Diesel, Electric, Hybrid
    ownership_status: str  # Owned, Leased, Rented
    status: str = "Active"  # Active, Maintenance, Inactive
    total_value: Optional[float] = 0

class Vehicle(VehicleCreate):
    vehicle_id: str
    photos: List[str] = []
    documents: List[dict] = []
    created_by: str
    created_at: datetime

# Maintenance Models
class MaintenanceRecordCreate(BaseModel):
    vehicle_id: str
    service_type: str
    date: datetime
    mileage: int
    cost: float
    parts: List[dict] = []
    technician: Optional[str] = None
    work_order_id: Optional[str] = None
    warranty_expiry: Optional[datetime] = None
    notes: Optional[str] = None

class MaintenanceRecord(MaintenanceRecordCreate):
    record_id: str
    created_at: datetime

# Work Order Models
class WorkOrderCreate(BaseModel):
    vehicle_id: str
    assigned_to: Optional[str] = None
    status: str = "Pending"  # Pending, In Progress, Completed, Cancelled
    priority: str  # Low, Medium, High, Critical
    description: str
    parts: List[dict] = []
    labor_cost: float = 0
    parts_cost: float = 0
    total_cost: float = 0
    scheduled_date: datetime
    completed_date: Optional[datetime] = None

class WorkOrder(WorkOrderCreate):
    order_id: str
    created_at: datetime

# Driver Models
class DriverCreate(BaseModel):
    name: str
    license_number: str
    license_expiry: str
    phone: str
    email: Optional[str] = None
    status: str = "Active"  # Active, Inactive

class Driver(DriverCreate):
    driver_id: str
    documents: List[dict] = []
    performance_notes: List[dict] = []
    created_at: datetime

# Driver Assignment Models
class DriverAssignmentCreate(BaseModel):
    vehicle_id: str
    driver_id: str
    start_date: datetime
    end_date: Optional[datetime] = None
    notes: Optional[str] = None

class DriverAssignment(DriverAssignmentCreate):
    assignment_id: str
    created_at: datetime

# Fuel Log Models
class FuelLogCreate(BaseModel):
    vehicle_id: str
    driver_id: str
    date: datetime
    quantity: float
    cost: float
    odometer: int
    fuel_type: str
    receipt_url: Optional[str] = None
    cost_per_km: float = 0

class FuelLog(FuelLogCreate):
    log_id: str
    created_at: datetime

# Parts Inventory Models
class PartCreate(BaseModel):
    name: str
    part_number: str
    quantity: int
    min_stock: int
    cost: float
    supplier: Optional[str] = None
    location: Optional[str] = None

class Part(PartCreate):
    part_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Tire Models
class TireCreate(BaseModel):
    vehicle_id: str
    position: str  # Front Left, Front Right, Rear Left, Rear Right, Spare
    brand: str
    size: str
    installation_date: str
    mileage_installed: int
    cost: float
    status: str = "Active"  # Active, Replaced, Damaged

class Tire(TireCreate):
    tire_id: str
    created_at: datetime

# Inspection Models
class InspectionCreate(BaseModel):
    vehicle_id: str
    driver_id: str
    type: str  # Pre-Trip, Post-Trip, Monthly
    date: datetime
    checklist: List[dict]
    photos: List[str] = []
    status: str = "Pending"  # Pending, Approved, Failed
    approved_by: Optional[str] = None
    notes: Optional[str] = None

class Inspection(InspectionCreate):
    inspection_id: str
    created_at: datetime

# Alert Models
class AlertCreate(BaseModel):
    type: str  # ServiceDue, RegistrationExpiry, LicenseExpiry, InspectionOverdue, LowStock, FuelEfficiency
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    message: str
    status: str = "Active"  # Active, Dismissed, Resolved
    priority: str  # Low, Medium, High

class Alert(AlertCreate):
    alert_id: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

# Dashboard Stats
class DashboardStats(BaseModel):
    totalVehicles: int
    activeVehicles: int
    maintenanceVehicles: int
    totalDrivers: int
    activeDrivers: int
    pendingWorkOrders: int
    completedWorkOrders: int
    totalAlerts: int
    monthlyFuelCost: float
    monthlyMaintenanceCost: float
    avgFuelEfficiency: float
    totalMileageThisMonth: int

# Auth Models
class SessionRequest(BaseModel):
    session_id: str

class SessionResponse(BaseModel):
    user: User
