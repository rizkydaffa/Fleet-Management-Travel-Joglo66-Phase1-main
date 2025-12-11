import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockVehicles } from '../mock/mockData';
import { Plus, Search, Filter, Car, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles] = useState(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Maintenance': return <Wrench className="w-4 h-4" />;
      case 'Inactive': return <AlertCircle className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Maintenance': return 'bg-orange-100 text-orange-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Vehicles</h1>
              <p className="text-gray-400 mt-1">Manage your fleet vehicles</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Vehicle</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="plate" className="text-gray-300">License Plate *</Label>
                    <Input id="plate" placeholder="B 1234 ABC" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">Brand *</Label>
                    <Input id="brand" placeholder="Toyota" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-gray-300">Model *</Label>
                    <Input id="model" placeholder="Hiace" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-gray-300">Type *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-gray-300">Year *</Label>
                    <Input id="year" type="number" placeholder="2023" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="vin" className="text-gray-300">VIN</Label>
                    <Input id="vin" placeholder="Vehicle Identification Number" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="color" className="text-gray-300">Color</Label>
                    <Input id="color" placeholder="White" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="mileage" className="text-gray-300">Mileage (km)</Label>
                    <Input id="mileage" type="number" placeholder="0" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="fuelType" className="text-gray-300">Fuel Type *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ownership" className="text-gray-300">Ownership Status *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select ownership" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Owned">Owned</SelectItem>
                        <SelectItem value="Leased">Leased</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="regExpiry" className="text-gray-300">Registration Expiry</Label>
                    <Input id="regExpiry" type="date" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="totalValue" className="text-gray-300">Total Value (Rp)</Label>
                    <Input id="totalValue" type="number" placeholder="0" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="vehiclePhoto" className="text-gray-300">Vehicle Photo</Label>
                    <Input id="vehiclePhoto" type="file" accept="image/*" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="stnkPhoto" className="text-gray-300">STNK Photo</Label>
                    <Input id="stnkPhoto" type="file" accept="image/*" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddModalOpen(false)}>Save Vehicle</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by plate, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.vehicle_id} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gray-900 border-gray-800"
                onClick={() => navigate(`/vehicles/${vehicle.vehicle_id}`)}
              >
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={vehicle.photos[0]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{vehicle.plate}</h3>
                      <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {getStatusIcon(vehicle.status)}
                      <span className="ml-1">{vehicle.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium text-white">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year:</span>
                      <span className="font-medium text-white">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mileage:</span>
                      <span className="font-medium text-white">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel:</span>
                      <span className="font-medium text-white">{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reg. Expiry:</span>
                      <span className={`font-medium ${
                        new Date(vehicle.registration_expiry) < new Date() ? 'text-red-400' :
                        new Date(vehicle.registration_expiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-400' :
                        'text-white'
                      }`}>
                        {format(new Date(vehicle.registration_expiry), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No vehicles found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
