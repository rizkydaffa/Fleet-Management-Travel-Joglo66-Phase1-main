import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import { Plus, Search, Circle, Edit, Trash2, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { format } from 'date-fns';

const Tires = () => {
  const { data, addTire, updateTire, deleteTire } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTire, setEditingTire] = useState(null);
  const [tireForm, setTireForm] = useState({
    vehicle_id: '',
    position: '',
    brand: '',
    size: '',
    installation_date: '',
    mileage_installed: '',
    cost: ''
  });

  const tires = data.tires;
  const vehicles = data.vehicles;

  const getVehiclePlate = (vehicleId) => {
    const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
    return vehicle ? vehicle.plate : 'Unknown';
  };

  const handleAddTire = async () => {
    if (!tireForm.vehicle_id || !tireForm.position || !tireForm.brand || !tireForm.size) {
      alert('Please fill all required fields');
      return;
    }

    const newTireData = {
      ...tireForm,
      mileage_installed: parseInt(tireForm.mileage_installed) || 0,
      cost: parseFloat(tireForm.cost) || 0,
      status: 'Active'
    };

    try {
      await addTire(newTireData);
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Error adding tire: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUpdateTire = async () => {
    if (!tireForm.vehicle_id || !tireForm.position || !tireForm.brand || !tireForm.size) {
      alert('Please fill all required fields');
      return;
    }

    const updatedTireData = {
      ...tireForm,
      mileage_installed: parseInt(tireForm.mileage_installed) || 0,
      cost: parseFloat(tireForm.cost) || 0
    };

    try {
      await updateTire(editingTire.tire_id, updatedTireData);
      resetForm();
      setEditingTire(null);
    } catch (error) {
      alert('Error updating tire: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleToggleStatus = async (tireId) => {
    const tire = data.tires.find(t => t.tire_id === tireId);
    if (tire) {
      const newStatus = tire.status === 'Active' ? 'Replaced' : 'Active';
      try {
        await updateTire(tireId, { status: newStatus });
      } catch (error) {
        alert('Error updating tire status: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleDelete = async (tireId) => {
    if (window.confirm('Are you sure you want to delete this tire record?')) {
      try {
        await deleteTire(tireId);
      } catch (error) {
        alert('Error deleting tire: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const openEditModal = (tire) => {
    setEditingTire(tire);
    setTireForm({
      vehicle_id: tire.vehicle_id,
      position: tire.position,
      brand: tire.brand,
      size: tire.size,
      installation_date: tire.installation_date,
      mileage_installed: tire.mileage_installed.toString(),
      cost: tire.cost.toString()
    });
  };

  const resetForm = () => {
    setTireForm({
      vehicle_id: '',
      position: '',
      brand: '',
      size: '',
      installation_date: '',
      mileage_installed: '',
      cost: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Tire Management</h1>
              <p className="text-gray-400 mt-1">Track tire installation and maintenance</p>
            </div>
            <Dialog open={isAddModalOpen || editingTire !== null} onOpenChange={(open) => {
              if (!open) {
                setIsAddModalOpen(false);
                setEditingTire(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tire Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingTire ? 'Edit Tire Record' : 'Add Tire Record'}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="vehicle" className="text-gray-300">Vehicle *</Label>
                    <Select value={tireForm.vehicle_id} onValueChange={(val) => setTireForm({...tireForm, vehicle_id: val})}>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {vehicles.map(v => (
                          <SelectItem key={v.vehicle_id} value={v.vehicle_id}>{v.plate} - {v.brand} {v.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-gray-300">Position *</Label>
                    <Select value={tireForm.position} onValueChange={(val) => setTireForm({...tireForm, position: val})}>
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Front Left">Front Left</SelectItem>
                        <SelectItem value="Front Right">Front Right</SelectItem>
                        <SelectItem value="Rear Left">Rear Left</SelectItem>
                        <SelectItem value="Rear Right">Rear Right</SelectItem>
                        <SelectItem value="Spare">Spare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">Brand *</Label>
                    <Input 
                      id="brand" 
                      placeholder="Bridgestone" 
                      value={tireForm.brand}
                      onChange={(e) => setTireForm({...tireForm, brand: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="size" className="text-gray-300">Size *</Label>
                    <Input 
                      id="size" 
                      placeholder="195/70R15" 
                      value={tireForm.size}
                      onChange={(e) => setTireForm({...tireForm, size: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="installDate" className="text-gray-300">Installation Date *</Label>
                    <Input 
                      id="installDate" 
                      type="date" 
                      value={tireForm.installation_date}
                      onChange={(e) => setTireForm({...tireForm, installation_date: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage" className="text-gray-300">Mileage at Installation (km)</Label>
                    <Input 
                      id="mileage" 
                      type="number" 
                      placeholder="45000" 
                      value={tireForm.mileage_installed}
                      onChange={(e) => setTireForm({...tireForm, mileage_installed: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost" className="text-gray-300">Cost (Rp)</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      placeholder="850000" 
                      value={tireForm.cost}
                      onChange={(e) => setTireForm({...tireForm, cost: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTire(null);
                    resetForm();
                  }}>Cancel</Button>
                  <Button onClick={editingTire ? handleUpdateTire : handleAddTire}>
                    {editingTire ? 'Update' : 'Add'} Tire
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tires.map((tire) => (
              <Card key={tire.tire_id} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-500/10 rounded-lg">
                        <Circle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{tire.position}</h3>
                        <p className="text-sm text-gray-400">{getVehiclePlate(tire.vehicle_id)}</p>
                      </div>
                    </div>
                    <Badge className={tire.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {tire.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand:</span>
                      <span className="text-white font-medium">{tire.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{tire.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Installed:</span>
                      <span className="text-white font-medium">{format(new Date(tire.installation_date), 'MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mileage:</span>
                      <span className="text-white font-medium">{tire.mileage_installed.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-white font-medium">Rp {(tire.cost / 1000).toLocaleString()}K</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => openEditModal(tire)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 border-gray-700 ${tire.status === 'Active' ? 'text-orange-400 hover:bg-orange-900/20' : 'text-green-400 hover:bg-green-900/20'}`}
                        onClick={() => handleToggleStatus(tire.tire_id)}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {tire.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                      onClick={() => handleDelete(tire.tire_id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tires;
