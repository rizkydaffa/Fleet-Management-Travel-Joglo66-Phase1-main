# Fleet Management System - API Contracts & Integration Plan

## System Overview
Fleet Management Travel - Joglo66 Trans
Tech Stack: React + FastAPI + MongoDB + Emergent Auth

## Database Collections

### users
- user_id (string, UUID)
- email (string)
- name (string)
- picture (string, URL)
- role (enum: Admin, Manager, Mechanic, Driver)
- created_at (datetime)

### vehicles
- vehicle_id (string, UUID)
- plate (string)
- brand (string)
- model (string)
- type (enum: Car, Van, Bus, Truck)
- year (number)
- vin (string)
- color (string)
- registration_expiry (date)
- mileage (number)
- fuel_type (enum: Petrol, Diesel, Electric, Hybrid)
- ownership_status (enum: Owned, Leased, Rented)
- status (enum: Active, Maintenance, Inactive)
- photos (array of URLs)
- documents (array of {name, url, type})
- total_value (number)
- created_by (user_id)
- created_at (datetime)

### maintenance_records
- record_id (string, UUID)
- vehicle_id (string)
- service_type (string: Oil Change, Tire Rotation, Brake Service, etc.)
- date (datetime)
- mileage (number)
- cost (number)
- parts (array of {part_id, quantity, cost})
- technician (string)
- work_order_id (string, optional)
- warranty_expiry (date, optional)
- notes (string)
- created_at (datetime)

### work_orders
- order_id (string, UUID)
- vehicle_id (string)
- assigned_to (user_id, mechanic)
- status (enum: Pending, In Progress, Completed, Cancelled)
- priority (enum: Low, Medium, High, Critical)
- description (string)
- parts (array of {part_id, quantity})
- labor_cost (number)
- parts_cost (number)
- total_cost (number)
- scheduled_date (datetime)
- completed_date (datetime, optional)
- created_at (datetime)

### drivers
- driver_id (string, UUID)
- name (string)
- license_number (string)
- license_expiry (date)
- phone (string)
- email (string)
- documents (array of {name, url, type})
- performance_notes (array of {date, note, created_by})
- status (enum: Active, Inactive)
- created_at (datetime)

### driver_assignments
- assignment_id (string, UUID)
- vehicle_id (string)
- driver_id (string)
- start_date (datetime)
- end_date (datetime, optional)
- notes (string)
- created_at (datetime)

### fuel_logs
- log_id (string, UUID)
- vehicle_id (string)
- driver_id (string)
- date (datetime)
- quantity (number, liters)
- cost (number)
- odometer (number)
- fuel_type (string)
- receipt_url (string, optional)
- cost_per_km (number, calculated)
- created_at (datetime)

### parts_inventory
- part_id (string, UUID)
- name (string)
- part_number (string)
- quantity (number)
- min_stock (number)
- cost (number)
- supplier (string)
- location (string)
- created_at (datetime)
- updated_at (datetime)

### tires
- tire_id (string, UUID)
- vehicle_id (string)
- position (enum: Front Left, Front Right, Rear Left, Rear Right, Spare)
- brand (string)
- size (string)
- installation_date (date)
- mileage_installed (number)
- cost (number)
- status (enum: Active, Replaced, Damaged)
- created_at (datetime)

### inspections
- inspection_id (string, UUID)
- vehicle_id (string)
- driver_id (string)
- type (enum: Pre-Trip, Post-Trip, Monthly)
- date (datetime)
- checklist (array of {item, status: Pass/Fail/NA, notes})
- photos (array of URLs)
- status (enum: Pending, Approved, Failed)
- approved_by (user_id, optional)
- notes (string)
- created_at (datetime)

### alerts
- alert_id (string, UUID)
- type (enum: ServiceDue, RegistrationExpiry, LicenseExpiry, InspectionOverdue, LowStock, FuelEfficiency)
- vehicle_id (string, optional)
- driver_id (string, optional)
- message (string)
- status (enum: Active, Dismissed, Resolved)
- priority (enum: Low, Medium, High)
- created_at (datetime)
- resolved_at (datetime, optional)

## API Endpoints

### Authentication
- POST /api/auth/session - Process session_id from OAuth
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout user

### Vehicles
- GET /api/vehicles - List all vehicles (with filters)
- POST /api/vehicles - Create vehicle
- GET /api/vehicles/{vehicle_id} - Get vehicle details
- PUT /api/vehicles/{vehicle_id} - Update vehicle
- DELETE /api/vehicles/{vehicle_id} - Delete vehicle
- GET /api/vehicles/{vehicle_id}/history - Get maintenance/fuel history
- GET /api/vehicles/{vehicle_id}/lifecycle - Get lifecycle data

### Maintenance
- GET /api/maintenance - List maintenance records
- POST /api/maintenance - Create maintenance record
- GET /api/maintenance/{record_id} - Get maintenance details
- PUT /api/maintenance/{record_id} - Update maintenance record
- DELETE /api/maintenance/{record_id} - Delete maintenance record
- GET /api/maintenance/schedule - Get scheduled maintenance

### Work Orders
- GET /api/work-orders - List work orders
- POST /api/work-orders - Create work order
- GET /api/work-orders/{order_id} - Get work order details
- PUT /api/work-orders/{order_id} - Update work order
- DELETE /api/work-orders/{order_id} - Delete work order

### Drivers
- GET /api/drivers - List all drivers
- POST /api/drivers - Create driver
- GET /api/drivers/{driver_id} - Get driver details
- PUT /api/drivers/{driver_id} - Update driver
- DELETE /api/drivers/{driver_id} - Delete driver
- GET /api/drivers/{driver_id}/assignments - Get driver assignments
- POST /api/drivers/{driver_id}/assignments - Assign driver to vehicle

### Fuel
- GET /api/fuel - List fuel logs
- POST /api/fuel - Create fuel log
- GET /api/fuel/{log_id} - Get fuel log details
- PUT /api/fuel/{log_id} - Update fuel log
- DELETE /api/fuel/{log_id} - Delete fuel log
- GET /api/fuel/analytics - Get fuel analytics

### Parts
- GET /api/parts - List parts inventory
- POST /api/parts - Create part
- GET /api/parts/{part_id} - Get part details
- PUT /api/parts/{part_id} - Update part
- DELETE /api/parts/{part_id} - Delete part

### Tires
- GET /api/tires - List tires
- POST /api/tires - Create tire record
- GET /api/tires/{tire_id} - Get tire details
- PUT /api/tires/{tire_id} - Update tire
- DELETE /api/tires/{tire_id} - Delete tire

### Inspections
- GET /api/inspections - List inspections
- POST /api/inspections - Create inspection
- GET /api/inspections/{inspection_id} - Get inspection details
- PUT /api/inspections/{inspection_id} - Update inspection
- POST /api/inspections/{inspection_id}/approve - Approve inspection

### Alerts
- GET /api/alerts - List alerts
- POST /api/alerts - Create alert
- PUT /api/alerts/{alert_id} - Update/dismiss alert

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics
- GET /api/dashboard/charts - Get chart data

### Reports
- GET /api/reports/cost-analysis - Get cost analysis report
- GET /api/reports/vehicle-utilization - Get vehicle utilization report
- GET /api/reports/fuel-efficiency - Get fuel efficiency report
- GET /api/reports/downtime - Get downtime report

## Mock Data Structure (mock.js)

Will include:
- Sample vehicles (10-15 vehicles of different types)
- Maintenance records (30+ records)
- Drivers (8-10 drivers)
- Fuel logs (50+ logs)
- Work orders (15+ orders)
- Parts inventory (20+ parts)
- Tire records (40+ tires)
- Inspections (20+ inspections)
- Alerts (10+ active alerts)

## Frontend-Backend Integration Plan

### Phase 1: Mock Frontend
- Build all UI components with mock data
- Implement routing and navigation
- Add role-based UI restrictions
- Test all user flows

### Phase 2: Backend API
- Implement all database models
- Create CRUD endpoints
- Add authentication middleware
- Implement role-based access control
- Add data validation

### Phase 3: Integration
- Replace mock data with API calls
- Add loading states
- Implement error handling
- Add optimistic updates
- Test end-to-end flows

### Phase 4: Advanced Features
- File upload for documents/photos
- Export reports to PDF/CSV
- Real-time alerts
- Advanced analytics
