import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import { Plus, Search, User, AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { format } from 'date-fns';

const Drivers = () => {
  const navigate = useNavigate();
  const { data, addDriver, updateDriver, deleteDriver } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_expiry: '',
    phone: '',
    email: '',
    status: 'Active'
  });

  const filteredDrivers = data.drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const getDriverVehicle = (driverId) => {
    const assignment = data.driverAssignments.find(a => a.driver_id === driverId && !a.end_date);
    if (assignment) {
      const vehicle = data.vehicles.find(v => v.vehicle_id === assignment.vehicle_id);
      return vehicle ? vehicle.plate : null;
    }
    return null;
  };

  const handleAddDriver = async () => {
    if (!formData.name || !formData.license_number || !formData.license_expiry || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await addDriver(formData);
      setFormData({ name: '', license_number: '', license_expiry: '', phone: '', email: '', status: 'Active' });
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Error adding driver: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditDriver = async () => {
    if (!formData.name || !formData.license_number || !formData.license_expiry || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await updateDriver(selectedDriver.driver_id, formData);
      setFormData({ name: '', license_number: '', license_expiry: '', phone: '', email: '', status: 'Active' });
      setIsEditModalOpen(false);
      setSelectedDriver(null);
    } catch (error) {
      alert('Error updating driver: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteDriver = async (driver) => {
    if (window.confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
      try {
        await deleteDriver(driver.driver_id);
      } catch (error) {
        alert('Error deleting driver: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      license_number: driver.license_number,
      license_expiry: driver.license_expiry,
      phone: driver.phone,
      email: driver.email || '',
      status: driver.status
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Drivers</h1>
              <p className="text-gray-400 mt-1">Manage driver information and assignments</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Driver</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="license" className="text-gray-300">License Number *</Label>
                    <Input 
                      id="license" 
                      placeholder="B123456789" 
                      value={formData.license_number}
                      onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiry" className="text-gray-300">License Expiry *</Label>
                    <Input 
                      id="licenseExpiry" 
                      type="date" 
                      value={formData.license_expiry}
                      onChange={(e) => setFormData({...formData, license_expiry: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Phone *</Label>
                    <Input 
                      id="phone" 
                      placeholder="+62 812-3456-7890" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="driver@joglo66.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="driverPhoto" className="text-gray-300">Driver Photo</Label>
                    <Input id="driverPhoto" type="file" accept="image/*" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                    <p className="text-xs text-gray-500 mt-1">Photo upload will be implemented in backend integration</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="ktpPhoto" className="text-gray-300">KTP Photo</Label>
                    <Input id="ktpPhoto" type="file" accept="image/*" className="mt-1 bg-gray-800 border-gray-700 text-white" />
                    <p className="text-xs text-gray-500 mt-1">Photo upload will be implemented in backend integration</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDriver}>Save Driver</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Driver Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Driver</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-gray-300">Full Name *</Label>
                    <Input 
                      id="edit-name" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-license" className="text-gray-300">License Number *</Label>
                    <Input 
                      id="edit-license" 
                      placeholder="B123456789" 
                      value={formData.license_number}
                      onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-licenseExpiry" className="text-gray-300">License Expiry *</Label>
                    <Input 
                      id="edit-licenseExpiry" 
                      type="date" 
                      value={formData.license_expiry}
                      onChange={(e) => setFormData({...formData, license_expiry: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone" className="text-gray-300">Phone *</Label>
                    <Input 
                      id="edit-phone" 
                      placeholder="+62 812-3456-7890" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-email" className="text-gray-300">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      placeholder="driver@joglo66.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditDriver}>Update Driver</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search drivers by name, license, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => {
              const assignedVehicle = getDriverVehicle(driver.driver_id);
              const isLicenseExpiring = new Date(driver.license_expiry) < new Date(Date.now() + 30*24*60*60*1000);
              const isLicenseExpired = new Date(driver.license_expiry) < new Date();

              return (
                <Card key={driver.driver_id} className="hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{driver.name}</h3>
                        <p className="text-sm text-gray-400">{driver.license_number}</p>
                        <Badge className={driver.status === 'Active' ? 'bg-green-500/20 text-green-400 mt-2' : 'bg-gray-500/20 text-gray-400 mt-2'}>
                          {driver.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {driver.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white font-medium">{driver.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-medium text-xs truncate ml-2">{driver.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">License Expiry:</span>
                        <span className={`font-medium ${
                          isLicenseExpired ? 'text-red-400' :
                          isLicenseExpiring ? 'text-orange-400' :
                          'text-white'
                        }`}>
                          {format(new Date(driver.license_expiry), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      {assignedVehicle && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-400" />
                            <div>
                              <p className="text-xs text-gray-400">Assigned Vehicle</p>
                              <p className="text-sm font-semibold text-blue-400">{assignedVehicle}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigate(`/drivers/${driver.driver_id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => openEditModal(driver)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteDriver(driver)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No drivers found</h3>
              <p className="text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
