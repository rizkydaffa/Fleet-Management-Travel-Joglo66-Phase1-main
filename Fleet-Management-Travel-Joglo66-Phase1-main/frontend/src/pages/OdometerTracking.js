import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import { Plus, Search, Navigation, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';

const OdometerTracking = () => {
  const { data, startTrip, endTrip, getActiveTrips, getCompletedTrips, markAlertAsDone } = useData();
  const [isStartTripOpen, setIsStartTripOpen] = useState(false);
  const [isEndTripOpen, setIsEndTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [tripForm, setTripForm] = useState({
    vehicle_id: '',
    driver_id: '',
    start_odometer: '',
    purpose: ''
  });
  
  const [endOdometer, setEndOdometer] = useState('');

  const activeTrips = getActiveTrips();
  const completedTrips = getCompletedTrips().slice(0, 10);
  
  const mockVehicles = data.vehicles;
  const mockDrivers = data.drivers;

  // Service intervals configuration
  const serviceIntervals = {
    'Car': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 15000,
      major_service: 30000
    },
    'Van': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    },
    'Bus': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    },
    'Truck': {
      oil_change: 5000,
      brake_check: 10000,
      air_filter: 12000,
      major_service: 40000
    }
  };

  // Calculate maintenance alerts
  const getMaintenanceAlerts = (vehicle) => {
    const intervals = serviceIntervals[vehicle.type] || serviceIntervals['Car'];
    const alerts = [];
    
    // Get last service mileage (mock data)
    const lastOilChange = vehicle.mileage - 4500;
    const lastBrakeCheck = vehicle.mileage - 9500;
    const lastAirFilter = vehicle.mileage - 14000;
    const lastMajorService = vehicle.mileage - 28000;

    if (vehicle.mileage - lastOilChange >= intervals.oil_change) {
      alerts.push({ type: 'Oil Change', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.oil_change - (vehicle.mileage - lastOilChange) <= 500) {
      alerts.push({ type: 'Oil Change', priority: 'Medium', kmUntilDue: intervals.oil_change - (vehicle.mileage - lastOilChange) });
    }

    if (vehicle.mileage - lastBrakeCheck >= intervals.brake_check) {
      alerts.push({ type: 'Brake Check', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.brake_check - (vehicle.mileage - lastBrakeCheck) <= 1000) {
      alerts.push({ type: 'Brake Check', priority: 'Medium', kmUntilDue: intervals.brake_check - (vehicle.mileage - lastBrakeCheck) });
    }

    if (vehicle.mileage - lastAirFilter >= intervals.air_filter) {
      alerts.push({ type: 'Air Filter / Tune Up', priority: 'High', kmUntilDue: 0 });
    } else if (intervals.air_filter - (vehicle.mileage - lastAirFilter) <= 1000) {
      alerts.push({ type: 'Air Filter / Tune Up', priority: 'Medium', kmUntilDue: intervals.air_filter - (vehicle.mileage - lastAirFilter) });
    }

    if (vehicle.mileage - lastMajorService >= intervals.major_service) {
      alerts.push({ type: 'Major Service', priority: 'Critical', kmUntilDue: 0 });
    } else if (intervals.major_service - (vehicle.mileage - lastMajorService) <= 2000) {
      alerts.push({ type: 'Major Service', priority: 'Medium', kmUntilDue: intervals.major_service - (vehicle.mileage - lastMajorService) });
    }

    return alerts;
  };

  const getVehicleInfo = (vehicleId) => {
    return mockVehicles.find(v => v.vehicle_id === vehicleId);
  };

  const getDriverInfo = (driverId) => {
    return mockDrivers.find(d => d.driver_id === driverId);
  };

  const handleStartTrip = () => {
    if (!tripForm.vehicle_id || !tripForm.driver_id || !tripForm.start_odometer) {
      alert('Please fill all required fields');
      return;
    }
    
    startTrip({
      vehicle_id: tripForm.vehicle_id,
      driver_id: tripForm.driver_id,
      start_odometer: parseInt(tripForm.start_odometer),
      purpose: tripForm.purpose
    });
    
    setTripForm({ vehicle_id: '', driver_id: '', start_odometer: '', purpose: '' });
    setIsStartTripOpen(false);
  };

  const handleEndTrip = () => {
    if (!endOdometer || !selectedTrip) {
      alert('Please enter ending odometer');
      return;
    }
    
    endTrip(selectedTrip.trip_id, parseInt(endOdometer));
    setEndOdometer('');
    setSelectedTrip(null);
    setIsEndTripOpen(false);
  };

  const openEndTripDialog = (trip) => {
    setSelectedTrip(trip);
    setEndOdometer('');
    setIsEndTripOpen(true);
  };

  const handleMarkAlertDone = (alertId) => {
    if (window.confirm('Mark this maintenance alert as completed?')) {
      markAlertAsDone(alertId);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Odometer Tracking</h1>
              <p className="text-gray-400 mt-1">Track vehicle mileage and automatic maintenance scheduling</p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Dialog open={isStartTripOpen} onOpenChange={setIsStartTripOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Trip
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Start New Trip</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="vehicle" className="text-gray-300">Vehicle *</Label>
                      <Select value={tripForm.vehicle_id} onValueChange={(val) => setTripForm({...tripForm, vehicle_id: val})}>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {mockVehicles.filter(v => v.status === 'Active').map(v => (
                            <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="driver" className="text-gray-300">Driver *</Label>
                      <Select value={tripForm.driver_id} onValueChange={(val) => setTripForm({...tripForm, driver_id: val})}>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {mockDrivers.filter(d => d.status === 'Active').map(d => (
                            <SelectItem key={d.driver_id} value={d.driver_id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startOdometer" className="text-gray-300">Starting Odometer (km) *</Label>
                      <Input 
                        id="startOdometer" 
                        type="number" 
                        placeholder="45000" 
                        value={tripForm.start_odometer}
                        onChange={(e) => setTripForm({...tripForm, start_odometer: e.target.value})}
                        className="mt-1 bg-gray-800 border-gray-700 text-white" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose" className="text-gray-300">Trip Purpose</Label>
                      <Input 
                        id="purpose" 
                        placeholder="e.g., Delivery, Pickup, etc." 
                        value={tripForm.purpose}
                        onChange={(e) => setTripForm({...tripForm, purpose: e.target.value})}
                        className="mt-1 bg-gray-800 border-gray-700 text-white" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsStartTripOpen(false)}>Cancel</Button>
                    <Button onClick={handleStartTrip}>Start Trip</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active Trips */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTrips.map((trip) => {
                  const vehicle = getVehicleInfo(trip.vehicle_id);
                  const driver = getDriverInfo(trip.driver_id);
                  const duration = Math.floor((new Date() - trip.start_time) / (1000 * 60));
                  
                  return (
                    <div key={trip.trip_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {vehicle?.photos && vehicle.photos.length > 0 && (
                            <img 
                              src={vehicle.photos[0]} 
                              alt={vehicle.plate}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-white">{vehicle?.plate}</h3>
                              <Badge className="bg-green-500/20 text-green-400">
                                <Navigation className="w-3 h-3 mr-1" />
                                In Progress
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{vehicle?.brand} {vehicle?.model}</p>
                            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                              <div>
                                <p className="text-gray-400">Driver</p>
                                <p className="text-white font-medium">{driver?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Start Odometer</p>
                                <p className="text-white font-medium">{trip.start_odometer.toLocaleString()} km</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Started</p>
                                <p className="text-white font-medium">{format(trip.start_time, 'HH:mm')}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Duration</p>
                                <p className="text-white font-medium">{duration} mins</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => openEndTripDialog(trip)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          End Trip
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {activeTrips.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Navigation className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p>No active trips</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Alerts */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.alerts.filter(a => a.status === 'Active' && a.type === 'ServiceDue').map((alert) => {
                  const vehicle = getVehicleInfo(alert.vehicle_id);
                  if (!vehicle) return null;
                  
                  return (
                    <div key={alert.alert_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-start gap-4">
                        {vehicle.photos && vehicle.photos.length > 0 && (
                          <img 
                            src={vehicle.photos[0]} 
                            alt={vehicle.plate}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">{vehicle.plate}</h3>
                            <Badge 
                              className={
                                alert.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                alert.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }
                            >
                              {alert.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">Current: {vehicle.mileage.toLocaleString()} km</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleMarkAlertDone(alert.alert_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Done
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {data.alerts.filter(a => a.status === 'Active' && a.type === 'ServiceDue').length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <p>All vehicles are up to date!</p>
                    <p className="text-sm mt-1">No maintenance alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trips */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Completed Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTrips.map((trip) => {
                  const vehicle = getVehicleInfo(trip.vehicle_id);
                  const driver = getDriverInfo(trip.driver_id);
                  
                  return (
                    <div key={trip.trip_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        {vehicle?.photos && vehicle.photos.length > 0 && (
                          <img 
                            src={vehicle.photos[0]} 
                            alt={vehicle.plate}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{vehicle?.plate}</h3>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{driver?.name}</p>
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400">Start</p>
                              <p className="text-white font-medium">{trip.start_odometer.toLocaleString()} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">End</p>
                              <p className="text-white font-medium">{trip.end_odometer.toLocaleString()} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Distance</p>
                              <p className="text-white font-medium">{trip.distance} km</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Date</p>
                              <p className="text-white font-medium">{format(trip.start_time, 'MMM dd')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* End Trip Dialog */}
          <Dialog open={isEndTripOpen} onOpenChange={setIsEndTripOpen}>
            <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">End Trip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedTrip && (
                  <>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">Starting Odometer</p>
                      <p className="text-lg font-bold text-white">{selectedTrip.start_odometer.toLocaleString()} km</p>
                    </div>
                    <div>
                      <Label htmlFor="endOdometer" className="text-gray-300">Ending Odometer (km) *</Label>
                      <Input 
                        id="endOdometer" 
                        type="number" 
                        placeholder={`Min: ${selectedTrip.start_odometer}`}
                        value={endOdometer}
                        onChange={(e) => setEndOdometer(e.target.value)}
                        min={selectedTrip.start_odometer}
                        className="mt-1 bg-gray-800 border-gray-700 text-white" 
                      />
                    </div>
                    {endOdometer && parseInt(endOdometer) > selectedTrip.start_odometer && (
                      <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-gray-400">Distance Traveled</p>
                        <p className="text-2xl font-bold text-green-400">{(parseInt(endOdometer) - selectedTrip.start_odometer).toLocaleString()} km</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEndTripOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleEndTrip}
                  disabled={!endOdometer || parseInt(endOdometer) <= (selectedTrip?.start_odometer || 0)}
                >
                  Complete Trip
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default OdometerTracking;
