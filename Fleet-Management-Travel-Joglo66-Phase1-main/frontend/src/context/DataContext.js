import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  driversAPI, 
  vehiclesAPI, 
  partsAPI, 
  tiresAPI, 
  maintenanceAPI, 
  fuelAPI, 
  alertsAPI, 
  workOrdersAPI 
} from '../services/api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    vehicles: [],
    drivers: [],
    maintenanceRecords: [],
    fuelLogs: [],
    workOrders: [],
    parts: [],
    tires: [],
    inspections: [],
    alerts: [],
    driverAssignments: [],
    odometerTrips: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        driversRes,
        vehiclesRes,
        partsRes,
        tiresRes,
        maintenanceRes,
        fuelRes,
        alertsRes,
        workOrdersRes
      ] = await Promise.all([
        driversAPI.getAll().catch(() => ({ data: [] })),
        vehiclesAPI.getAll().catch(() => ({ data: [] })),
        partsAPI.getAll().catch(() => ({ data: [] })),
        tiresAPI.getAll().catch(() => ({ data: [] })),
        maintenanceAPI.getAll().catch(() => ({ data: [] })),
        fuelAPI.getAll().catch(() => ({ data: [] })),
        alertsAPI.getAll().catch(() => ({ data: [] })),
        workOrdersAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setData({
        drivers: driversRes.data || [],
        vehicles: vehiclesRes.data || [],
        parts: partsRes.data || [],
        tires: tiresRes.data || [],
        maintenanceRecords: maintenanceRes.data || [],
        fuelLogs: fuelRes.data || [],
        alerts: alertsRes.data || [],
        workOrders: workOrdersRes.data || [],
        inspections: [],
        driverAssignments: [],
        odometerTrips: []
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData();
  };

  // Placeholder - old functions removed, using new API-based implementations below

  // Driver operations
  const updateDriver = async (driverId, updatedData) => {
    try {
      const result = await driversAPI.update(driverId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating driver:', err);
      throw err;
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      const result = await driversAPI.delete(driverId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting driver:', err);
      throw err;
    }
  };

  const addDriver = async (driverData) => {
    try {
      const result = await driversAPI.create(driverData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding driver:', err);
      throw err;
    }
  };

  // Part operations
  const updatePart = async (partId, updatedData) => {
    try {
      const result = await partsAPI.update(partId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating part:', err);
      throw err;
    }
  };

  const deletePart = async (partId) => {
    try {
      const result = await partsAPI.delete(partId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting part:', err);
      throw err;
    }
  };

  const addPart = async (partData) => {
    try {
      const result = await partsAPI.create(partData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding part:', err);
      throw err;
    }
  };

  // Tire operations
  const updateTire = async (tireId, updatedData) => {
    try {
      const result = await tiresAPI.update(tireId, updatedData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error updating tire:', err);
      throw err;
    }
  };

  const deleteTire = async (tireId) => {
    try {
      const result = await tiresAPI.delete(tireId);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error deleting tire:', err);
      throw err;
    }
  };

  const addTire = async (tireData) => {
    try {
      const result = await tiresAPI.create(tireData);
      await refreshData();
      return result.data;
    } catch (err) {
      console.error('Error adding tire:', err);
      throw err;
    }
  };

  // Dashboard stats helper
  const getDashboardStats = () => {
    const vehicles = data.vehicles || [];
    const drivers = data.drivers || [];
    const workOrders = data.workOrders || [];
    const alerts = data.alerts || [];

    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'Active').length,
      maintenanceVehicles: vehicles.filter(v => v.status === 'Maintenance').length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === 'Active').length,
      pendingWorkOrders: workOrders.filter(w => w.status === 'Pending').length,
      completedWorkOrders: workOrders.filter(w => w.status === 'Completed').length,
      totalAlerts: alerts.filter(a => a.status === 'Active').length,
      monthlyFuelCost: 0,
      monthlyMaintenanceCost: 0,
      avgFuelEfficiency: 8.5,
      totalMileageThisMonth: 0
    };
  };

  // Odometer tracking helpers (placeholder - to be implemented with backend)
  const startTrip = async (tripData) => {
    console.log('startTrip to be implemented with backend');
    return null;
  };

  const endTrip = async (tripId, endOdometer) => {
    console.log('endTrip to be implemented with backend');
    return null;
  };

  const getActiveTrips = () => {
    return data.odometerTrips?.filter(t => t.status === 'In Progress') || [];
  };

  const getCompletedTrips = () => {
    return data.odometerTrips?.filter(t => t.status === 'Completed') || [];
  };

  // Alert helpers
  const markAlertAsDone = async (alertId) => {
    try {
      await alertsAPI.markAsDone(alertId);
      await refreshData();
    } catch (err) {
      console.error('Error marking alert as done:', err);
      throw err;
    }
  };

  const value = {
    data,
    loading,
    error,
    refreshData,
    getDashboardStats,
    // Odometer tracking
    startTrip,
    endTrip,
    getActiveTrips,
    getCompletedTrips,
    // Alerts
    markAlertAsDone,
    // Driver CRUD
    updateDriver,
    deleteDriver,
    addDriver,
    // Part CRUD
    updatePart,
    deletePart,
    addPart,
    // Tire CRUD
    updateTire,
    deleteTire,
    addTire
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
