import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockFuelLogs, mockVehicles, mockDrivers } from '../mock/mockData';
import { Plus, Search, Fuel as FuelIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';

const Fuel = () => {
  const [fuelLogs] = useState(mockFuelLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalFuelQuantity = fuelLogs.reduce((sum, log) => sum + log.quantity, 0);
  const avgCostPerLiter = totalFuelCost / totalFuelQuantity;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Fuel Logs</h1>
              <p className="text-gray-400 mt-1">Track fuel consumption and costs</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fuel Log
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Fuel Log</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="vehicle" className="text-gray-300">Vehicle *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {mockVehicles.map(v => (
                          <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-gray-300">Date *</Label>
                    <Input id="date" type="date" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="fuelType" className="text-gray-300">Fuel Type *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Pertamax">Pertamax</SelectItem>
                        <SelectItem value="Pertalite">Pertalite</SelectItem>
                        <SelectItem value="Solar">Solar</SelectItem>
                        <SelectItem value="DEX">DEX</SelectItem>
                        <SelectItem value="Dexlite">Dexlite</SelectItem>
                        <SelectItem value="Pertamax Turbo">Pertamax Turbo</SelectItem>
                        <SelectItem value="Pertamax Green">Pertamax Green</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fuelStation" className="text-gray-300">Fuel Station *</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Pertamina">Pertamina</SelectItem>
                        <SelectItem value="Shell">Shell</SelectItem>
                        <SelectItem value="BP">BP</SelectItem>
                        <SelectItem value="Vivo">Vivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-gray-300">Quantity (Liters) *</Label>
                    <Input id="quantity" type="number" placeholder="0" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="cost" className="text-gray-300">Cost (Rp) *</Label>
                    <Input id="cost" type="number" placeholder="0" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="odometer" className="text-gray-300">Odometer (km) *</Label>
                    <Input id="odometer" type="number" placeholder="0" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddModalOpen(false)}>Save Log</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Fuel Cost</p>
                    <p className="text-3xl font-bold text-white mt-2">Rp {(totalFuelCost / 1000000).toFixed(1)}M</p>
                    <div className="flex items-center gap-1 mt-2 text-blue-100 text-xs">
                      <TrendingDown className="w-3 h-3" />
                      <span>-5% vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FuelIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Total Liters</p>
                    <p className="text-3xl font-bold text-white mt-2">{totalFuelQuantity.toFixed(0)}L</p>
                    <div className="flex items-center gap-1 mt-2 text-green-100 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+8% vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FuelIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Avg Cost/Liter</p>
                    <p className="text-3xl font-bold text-white mt-2">Rp {(avgCostPerLiter / 1000).toFixed(1)}K</p>
                    <div className="flex items-center gap-1 mt-2 text-purple-100 text-xs">
                      <TrendingDown className="w-3 h-3" />
                      <span>-2% vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FuelIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search fuel logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {fuelLogs.map((log) => {
              const vehicle = mockVehicles.find(v => v.vehicle_id === log.vehicle_id);
              const driver = mockDrivers.find(d => d.driver_id === log.driver_id);
              
              return (
                <Card key={log.log_id} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <FuelIcon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{vehicle?.plate || 'Unknown Vehicle'}</h3>
                            <p className="text-sm text-gray-400">{vehicle?.brand} {vehicle?.model}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Date</p>
                            <p className="font-medium text-white">{format(log.date, 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Quantity</p>
                            <p className="font-medium text-white">{log.quantity}L</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Odometer</p>
                            <p className="font-medium text-white">{log.odometer.toLocaleString()} km</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Driver</p>
                            <p className="font-medium text-white">{driver?.name || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-4 md:mt-0 space-y-2">
                        <p className="text-2xl font-bold text-white">Rp {(log.cost / 1000).toLocaleString()}K</p>
                        <Badge className="bg-gray-800 text-gray-300">
                          {log.cost_per_km} Rp/km
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fuel;
