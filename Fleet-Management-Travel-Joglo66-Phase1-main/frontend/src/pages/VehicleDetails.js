import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { mockVehicles, mockMaintenanceRecords, mockFuelLogs, mockTires, mockDriverAssignments, mockDrivers } from '../mock/mockData';
import { ArrowLeft, Edit, Trash2, FileText, Calendar, Fuel, Circle, User, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { format } from 'date-fns';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle] = useState(mockVehicles.find(v => v.vehicle_id === id));
  
  if (!vehicle) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle not found</h2>
            <Button onClick={() => navigate('/vehicles')} className="mt-4">
              Back to Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const maintenanceHistory = mockMaintenanceRecords.filter(m => m.vehicle_id === id);
  const fuelHistory = mockFuelLogs.filter(f => f.vehicle_id === id);
  const tireHistory = mockTires.filter(t => t.vehicle_id === id);
  const assignments = mockDriverAssignments.filter(a => a.vehicle_id === id);
  const currentDriver = assignments.find(a => !a.end_date);
  const driverInfo = currentDriver ? mockDrivers.find(d => d.driver_id === currentDriver.driver_id) : null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Maintenance': return 'bg-orange-100 text-orange-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/vehicles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Vehicle Info Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <img
                    src={vehicle.photos[0]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{vehicle.plate}</h1>
                      <p className="text-xl text-gray-600 mt-1">{vehicle.brand} {vehicle.model}</p>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{vehicle.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold text-gray-900">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-semibold text-gray-900">{vehicle.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">VIN</p>
                      <p className="font-semibold text-gray-900 text-xs">{vehicle.vin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-semibold text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-semibold text-gray-900">{vehicle.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ownership</p>
                      <p className="font-semibold text-gray-900">{vehicle.ownership_status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration Expiry</p>
                      <p className={`font-semibold ${
                        new Date(vehicle.registration_expiry) < new Date() ? 'text-red-600' :
                        new Date(vehicle.registration_expiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {format(new Date(vehicle.registration_expiry), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="font-semibold text-gray-900">Rp {(vehicle.total_value / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                  {driverInfo && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Current Driver</p>
                          <p className="font-semibold text-gray-900">{driverInfo.name}</p>
                          <p className="text-xs text-gray-500">{driverInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="maintenance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
              <TabsTrigger value="tires">Tires</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="maintenance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceHistory.map((record) => (
                      <div key={record.record_id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <p className="font-semibold text-gray-900">{record.service_type}</p>
                            </div>
                            <p className="text-sm text-gray-600">{record.notes}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Date: {format(record.date, 'MMM dd, yyyy')}</span>
                              <span>Mileage: {record.mileage.toLocaleString()} km</span>
                              <span>Technician: {record.technician}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">Rp {(record.cost / 1000).toLocaleString()}K</p>
                            <p className="text-xs text-gray-500 mt-1">Work Order #{record.work_order_id}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {maintenanceHistory.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No maintenance records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fuel" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fuelHistory.map((log) => {
                      const driver = mockDrivers.find(d => d.driver_id === log.driver_id);
                      return (
                        <div key={log.log_id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Fuel className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-gray-900">{log.quantity}L {log.fuel_type}</p>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Date: {format(log.date, 'MMM dd, yyyy')}</span>
                                <span>Driver: {driver?.name || 'Unknown'}</span>
                                <span>Odometer: {log.odometer.toLocaleString()} km</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">Rp {(log.cost / 1000).toLocaleString()}K</p>
                              <p className="text-xs text-gray-500 mt-1">{log.cost_per_km} Rp/km</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {fuelHistory.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No fuel logs found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tires" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tire Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tireHistory.map((tire) => (
                      <div key={tire.tire_id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Circle className="w-4 h-4 text-gray-600" />
                          <p className="font-semibold text-gray-900">{tire.position}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Brand:</span>
                            <span className="font-medium text-gray-900">{tire.brand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium text-gray-900">{tire.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Installed:</span>
                            <span className="font-medium text-gray-900">{format(new Date(tire.installation_date), 'MMM yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-medium text-gray-900">Rp {(tire.cost / 1000).toLocaleString()}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={tire.status === 'Active' ? 'default' : 'secondary'}>
                              {tire.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tireHistory.length === 0 && (
                      <p className="col-span-2 text-center text-gray-500 py-8">No tire records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vehicle.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
