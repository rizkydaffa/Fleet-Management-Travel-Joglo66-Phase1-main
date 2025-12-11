import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

const Parts = () => {
  const { data, addPart, updatePart, deletePart } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [partForm, setPartForm] = useState({
    name: '',
    part_number: '',
    quantity: '',
    min_stock: '',
    cost: '',
    supplier: '',
    location: ''
  });

  const parts = data.parts;

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.part_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPart = async () => {
    if (!partForm.name || !partForm.part_number || !partForm.quantity || !partForm.min_stock) {
      alert('Please fill all required fields');
      return;
    }

    const newPartData = {
      ...partForm,
      quantity: parseInt(partForm.quantity),
      min_stock: parseInt(partForm.min_stock),
      cost: parseFloat(partForm.cost) || 0
    };

    try {
      await addPart(newPartData);
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Error adding part: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUpdatePart = async () => {
    if (!partForm.name || !partForm.part_number || !partForm.quantity || !partForm.min_stock) {
      alert('Please fill all required fields');
      return;
    }

    const updatedPartData = {
      ...partForm,
      quantity: parseInt(partForm.quantity),
      min_stock: parseInt(partForm.min_stock),
      cost: parseFloat(partForm.cost) || 0
    };

    try {
      await updatePart(editingPart.part_id, updatedPartData);
      resetForm();
      setEditingPart(null);
    } catch (error) {
      alert('Error updating part: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (partId) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await deletePart(partId);
      } catch (error) {
        alert('Error deleting part: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const openEditModal = (part) => {
    setEditingPart(part);
    setPartForm({
      name: part.name,
      part_number: part.part_number,
      quantity: part.quantity.toString(),
      min_stock: part.min_stock.toString(),
      cost: part.cost.toString(),
      supplier: part.supplier || '',
      location: part.location || ''
    });
  };

  const resetForm = () => {
    setPartForm({
      name: '',
      part_number: '',
      quantity: '',
      min_stock: '',
      cost: '',
      supplier: '',
      location: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Parts Inventory</h1>
              <p className="text-gray-400 mt-1">Manage spare parts and stock levels</p>
            </div>
            <Dialog open={isAddModalOpen || editingPart !== null} onOpenChange={(open) => {
              if (!open) {
                setIsAddModalOpen(false);
                setEditingPart(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Part
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingPart ? 'Edit Part' : 'Add New Part'}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Part Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Engine Oil 5W-30" 
                      value={partForm.name}
                      onChange={(e) => setPartForm({...partForm, name: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="partNumber" className="text-gray-300">Part Number *</Label>
                    <Input 
                      id="partNumber" 
                      placeholder="OIL-5W30-001" 
                      value={partForm.part_number}
                      onChange={(e) => setPartForm({...partForm, part_number: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-gray-300">Quantity *</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="0" 
                      value={partForm.quantity}
                      onChange={(e) => setPartForm({...partForm, quantity: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock" className="text-gray-300">Min Stock *</Label>
                    <Input 
                      id="minStock" 
                      type="number" 
                      placeholder="0" 
                      value={partForm.min_stock}
                      onChange={(e) => setPartForm({...partForm, min_stock: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost" className="text-gray-300">Cost (Rp) *</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      placeholder="0" 
                      value={partForm.cost}
                      onChange={(e) => setPartForm({...partForm, cost: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier" className="text-gray-300">Supplier</Label>
                    <Input 
                      id="supplier" 
                      placeholder="Supplier name" 
                      value={partForm.supplier}
                      onChange={(e) => setPartForm({...partForm, supplier: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Warehouse A-1" 
                      value={partForm.location}
                      onChange={(e) => setPartForm({...partForm, location: e.target.value})}
                      className="mt-1 bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingPart(null);
                    resetForm();
                  }}>Cancel</Button>
                  <Button onClick={editingPart ? handleUpdatePart : handleAddPart}>
                    {editingPart ? 'Update' : 'Save'} Part
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
                placeholder="Search parts by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => {
              const isLowStock = part.quantity < part.min_stock;
              
              return (
                <Card key={part.part_id} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{part.name}</h3>
                          <p className="text-sm text-gray-400">{part.part_number}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-400">Stock Level</p>
                          <p className="text-2xl font-bold text-white">{part.quantity}</p>
                        </div>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs">Low</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Min Stock</p>
                          <p className="font-medium text-white">{part.min_stock}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Cost</p>
                          <p className="font-medium text-white">Rp {(part.cost / 1000).toLocaleString()}K</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">Supplier</p>
                          <p className="font-medium text-white text-xs">{part.supplier}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">Location</p>
                          <p className="font-medium text-white">{part.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                      <Badge className={isLowStock ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                        {isLowStock ? 'Reorder Needed' : 'In Stock'}
                      </Badge>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={() => openEditModal(part)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20"
                          onClick={() => handleDelete(part.part_id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
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

export default Parts;
