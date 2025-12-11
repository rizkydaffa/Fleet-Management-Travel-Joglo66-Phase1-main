// Central data synchronization utility
// This ensures all modules share and update the same data

let globalData = {
  vehicles: [],
  drivers: [],
  maintenanceRecords: [],
  fuelLogs: [],
  workOrders: [],
  parts: [],
  tires: [],
  inspections: [],
  alerts: [],
  odometerTrips: [],
  driverAssignments: []
};

// Initialize with mock data
export const initializeData = (mockData) => {
  globalData = { ...mockData };
};

// Get all data
export const getAllData = () => globalData;

// Vehicle operations
export const updateVehicleMileage = (vehicleId, newMileage) => {
  const vehicle = globalData.vehicles.find(v => v.vehicle_id === vehicleId);
  if (vehicle) {
    vehicle.mileage = newMileage;
    checkMaintenanceAlerts(vehicleId);
  }
  return vehicle;
};

export const getVehicle = (vehicleId) => {
  return globalData.vehicles.find(v => v.vehicle_id === vehicleId);
};

// Odometer operations
export const startTrip = (tripData) => {
  const trip = {
    trip_id: `trip_${Date.now()}`,
    ...tripData,
    status: 'In Progress',
    start_time: new Date()
  };
  globalData.odometerTrips.push(trip);
  return trip;
};

export const endTrip = (tripId, endOdometer) => {
  const trip = globalData.odometerTrips.find(t => t.trip_id === tripId);
  if (trip) {
    trip.end_odometer = endOdometer;
    trip.distance = endOdometer - trip.start_odometer;
    trip.end_time = new Date();
    trip.status = 'Completed';
    
    // Update vehicle mileage
    updateVehicleMileage(trip.vehicle_id, endOdometer);
    
    return trip;
  }
  return null;
};

export const getActiveTrips = () => {
  return globalData.odometerTrips.filter(t => t.status === 'In Progress');
};

export const getCompletedTrips = () => {
  return globalData.odometerTrips.filter(t => t.status === 'Completed');
};

// Maintenance alert operations
const serviceIntervals = {
  'Car': { oil_change: 5000, brake_check: 10000, air_filter: 15000, major_service: 30000 },
  'Van': { oil_change: 5000, brake_check: 10000, air_filter: 12000, major_service: 40000 },
  'Bus': { oil_change: 5000, brake_check: 10000, air_filter: 12000, major_service: 40000 },
  'Truck': { oil_change: 5000, brake_check: 10000, air_filter: 12000, major_service: 40000 }
};

export const checkMaintenanceAlerts = (vehicleId) => {
  const vehicle = getVehicle(vehicleId);
  if (!vehicle) return;

  const intervals = serviceIntervals[vehicle.type] || serviceIntervals['Car'];
  const maintenanceRecords = globalData.maintenanceRecords.filter(m => m.vehicle_id === vehicleId);
  
  // Get last service mileage for each type
  const lastServices = {
    'Oil Change': 0,
    'Brake Service': 0,
    'Air Filter / Tune Up': 0,
    'Major Service': 0
  };

  maintenanceRecords.forEach(record => {
    if (record.service_type in lastServices && record.mileage > lastServices[record.service_type]) {
      lastServices[record.service_type] = record.mileage;
    }
  });

  // Check and create alerts
  const checkAndCreateAlert = (serviceType, intervalKey, lastServiceMileage) => {
    const kmSinceService = vehicle.mileage - lastServiceMileage;
    const interval = intervals[intervalKey];
    const kmUntilDue = interval - kmSinceService;

    // Remove existing alert for this service type
    globalData.alerts = globalData.alerts.filter(a => 
      !(a.vehicle_id === vehicleId && a.message.includes(serviceType))
    );

    if (kmUntilDue <= 0) {
      // Create high priority alert
      createAlert({
        type: 'ServiceDue',
        vehicle_id: vehicleId,
        message: `${vehicle.plate} - ${serviceType} is OVERDUE (${Math.abs(kmUntilDue)} km past due)`,
        priority: 'High'
      });
    } else if (kmUntilDue <= 500) {
      // Create medium priority alert
      createAlert({
        type: 'ServiceDue',
        vehicle_id: vehicleId,
        message: `${vehicle.plate} - ${serviceType} due in ${kmUntilDue} km`,
        priority: 'Medium'
      });
    }
  };

  checkAndCreateAlert('Oil Change', 'oil_change', lastServices['Oil Change']);
  checkAndCreateAlert('Brake Check', 'brake_check', lastServices['Brake Service']);
  checkAndCreateAlert('Air Filter / Tune Up', 'air_filter', lastServices['Air Filter / Tune Up']);
  checkAndCreateAlert('Major Service', 'major_service', lastServices['Major Service']);
};

// Alert operations
export const createAlert = (alertData) => {
  const alert = {
    alert_id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...alertData,
    status: 'Active',
    created_at: new Date(),
    resolved_at: null
  };
  globalData.alerts.push(alert);
  return alert;
};

export const markAlertAsDone = (alertId) => {
  const alert = globalData.alerts.find(a => a.alert_id === alertId);
  if (alert) {
    alert.status = 'Resolved';
    alert.resolved_at = new Date();
    return alert;
  }
  return null;
};

export const getActiveAlerts = () => {
  return globalData.alerts.filter(a => a.status === 'Active');
};

// Maintenance operations
export const addMaintenanceRecord = (recordData) => {
  const record = {
    record_id: `mnt_${Date.now()}`,
    ...recordData,
    created_at: new Date()
  };
  globalData.maintenanceRecords.push(record);
  
  // Dismiss related alerts
  globalData.alerts.forEach(alert => {
    if (alert.vehicle_id === recordData.vehicle_id && 
        alert.type === 'ServiceDue' &&
        alert.message.includes(recordData.service_type)) {
      markAlertAsDone(alert.alert_id);
    }
  });
  
  // Check if new alerts need to be created
  checkMaintenanceAlerts(recordData.vehicle_id);
  
  return record;
};

export const getMaintenanceRecords = (vehicleId = null) => {
  if (vehicleId) {
    return globalData.maintenanceRecords.filter(m => m.vehicle_id === vehicleId);
  }
  return globalData.maintenanceRecords;
};

// Fuel log operations
export const addFuelLog = (fuelData) => {
  const log = {
    log_id: `fuel_${Date.now()}`,
    ...fuelData,
    created_at: new Date()
  };
  
  // Calculate cost per km if not provided
  if (log.cost_per_km === 0 && log.quantity > 0) {
    log.cost_per_km = Math.round(log.cost / log.quantity);
  }
  
  globalData.fuelLogs.push(log);
  
  // Update vehicle mileage if odometer is provided
  if (log.odometer) {
    updateVehicleMileage(log.vehicle_id, log.odometer);
  }
  
  return log;
};

export const getFuelLogs = (vehicleId = null) => {
  if (vehicleId) {
    return globalData.fuelLogs.filter(f => f.vehicle_id === vehicleId);
  }
  return globalData.fuelLogs;
};

// Work order operations
export const addWorkOrder = (orderData) => {
  const order = {
    order_id: `wo_${Date.now()}`,
    ...orderData,
    created_at: new Date()
  };
  globalData.workOrders.push(order);
  return order;
};

export const updateWorkOrderStatus = (orderId, status, completedDate = null) => {
  const order = globalData.workOrders.find(o => o.order_id === orderId);
  if (order) {
    order.status = status;
    if (completedDate) {
      order.completed_date = completedDate;
    }
    
    // If completed, create maintenance record
    if (status === 'Completed') {
      addMaintenanceRecord({
        vehicle_id: order.vehicle_id,
        service_type: order.description,
        date: completedDate || new Date(),
        mileage: getVehicle(order.vehicle_id)?.mileage || 0,
        cost: order.total_cost,
        parts: order.parts,
        technician: 'Workshop',
        work_order_id: order.order_id,
        notes: order.description
      });
    }
    
    return order;
  }
  return null;
};

// Dashboard stats
export const getDashboardStats = () => {
  const vehicles = globalData.vehicles;
  const drivers = globalData.drivers;
  const workOrders = globalData.workOrders;
  const alerts = globalData.alerts;
  const fuelLogs = globalData.fuelLogs;
  const maintenanceRecords = globalData.maintenanceRecords;

  // Calculate monthly costs (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
  
  const monthlyFuelCost = fuelLogs
    .filter(f => new Date(f.created_at) >= thirtyDaysAgo)
    .reduce((sum, f) => sum + f.cost, 0);
  
  const monthlyMaintenanceCost = maintenanceRecords
    .filter(m => new Date(m.created_at) >= thirtyDaysAgo)
    .reduce((sum, m) => sum + m.cost, 0);

  const totalMileageThisMonth = fuelLogs
    .filter(f => new Date(f.created_at) >= thirtyDaysAgo)
    .reduce((sum, f) => sum + (f.odometer || 0), 0);

  return {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'Active').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'Maintenance').length,
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'Active').length,
    pendingWorkOrders: workOrders.filter(w => w.status === 'Pending').length,
    completedWorkOrders: workOrders.filter(w => w.status === 'Completed').length,
    totalAlerts: alerts.filter(a => a.status === 'Active').length,
    monthlyFuelCost,
    monthlyMaintenanceCost,
    avgFuelEfficiency: 8.5,
    totalMileageThisMonth: Math.round(totalMileageThisMonth / fuelLogs.length) || 0
  };
};

// Driver CRUD operations
export const updateDriver = (driverId, updatedData) => {
  const driverIndex = globalData.drivers.findIndex(d => d.driver_id === driverId);
  if (driverIndex !== -1) {
    globalData.drivers[driverIndex] = { ...globalData.drivers[driverIndex], ...updatedData };
    return globalData.drivers[driverIndex];
  }
  return null;
};

export const deleteDriver = (driverId) => {
  const driverIndex = globalData.drivers.findIndex(d => d.driver_id === driverId);
  if (driverIndex !== -1) {
    const deletedDriver = globalData.drivers[driverIndex];
    globalData.drivers.splice(driverIndex, 1);
    // Also remove driver assignments
    globalData.driverAssignments = globalData.driverAssignments.filter(a => a.driver_id !== driverId);
    return deletedDriver;
  }
  return null;
};

export const addDriver = (driverData) => {
  const driver = {
    driver_id: `drv_${Date.now()}`,
    ...driverData,
    created_at: new Date()
  };
  globalData.drivers.push(driver);
  return driver;
};

// Part CRUD operations
export const updatePart = (partId, updatedData) => {
  const partIndex = globalData.parts.findIndex(p => p.part_id === partId);
  if (partIndex !== -1) {
    globalData.parts[partIndex] = { ...globalData.parts[partIndex], ...updatedData };
    return globalData.parts[partIndex];
  }
  return null;
};

export const deletePart = (partId) => {
  const partIndex = globalData.parts.findIndex(p => p.part_id === partId);
  if (partIndex !== -1) {
    const deletedPart = globalData.parts[partIndex];
    globalData.parts.splice(partIndex, 1);
    return deletedPart;
  }
  return null;
};

export const addPart = (partData) => {
  const part = {
    part_id: `part_${Date.now()}`,
    ...partData,
    created_at: new Date()
  };
  globalData.parts.push(part);
  return part;
};

// Tire CRUD operations
export const updateTire = (tireId, updatedData) => {
  const tireIndex = globalData.tires.findIndex(t => t.tire_id === tireId);
  if (tireIndex !== -1) {
    globalData.tires[tireIndex] = { ...globalData.tires[tireIndex], ...updatedData };
    return globalData.tires[tireIndex];
  }
  return null;
};

export const deleteTire = (tireId) => {
  const tireIndex = globalData.tires.findIndex(t => t.tire_id === tireId);
  if (tireIndex !== -1) {
    const deletedTire = globalData.tires[tireIndex];
    globalData.tires.splice(tireIndex, 1);
    return deletedTire;
  }
  return null;
};

export const addTire = (tireData) => {
  const tire = {
    tire_id: `tire_${Date.now()}`,
    ...tireData,
    created_at: new Date()
  };
  globalData.tires.push(tire);
  return tire;
};

// Export for use in components
export const dataSync = {
  initializeData,
  getAllData,
  updateVehicleMileage,
  getVehicle,
  startTrip,
  endTrip,
  getActiveTrips,
  getCompletedTrips,
  checkMaintenanceAlerts,
  createAlert,
  markAlertAsDone,
  getActiveAlerts,
  addMaintenanceRecord,
  getMaintenanceRecords,
  addFuelLog,
  getFuelLogs,
  addWorkOrder,
  updateWorkOrderStatus,
  getDashboardStats,
  // Driver operations
  updateDriver,
  deleteDriver,
  addDriver,
  // Part operations
  updatePart,
  deletePart,
  addPart,
  // Tire operations
  updateTire,
  deleteTire,
  addTire
};

export default dataSync;
