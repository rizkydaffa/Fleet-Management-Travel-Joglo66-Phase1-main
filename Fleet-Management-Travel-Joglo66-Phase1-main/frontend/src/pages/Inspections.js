import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockInspections, mockVehicles, mockDrivers } from '../mock/mockData';
import { Plus, Search, ClipboardCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { format } from 'date-fns';

const Inspections = () => {
  const [inspections] = useState(mockInspections);
  const [searchTerm, setSearchTerm] = useState('');

  const getVehiclePlate = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.vehicle_id === vehicleId);
    return vehicle ? vehicle.plate : 'Unknown';
  };

  const getDriverName = (driverId) => {
    const driver = mockDrivers.find(d => d.driver_id === driverId);
    return driver ? driver.name : 'Unknown';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'NA': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Inspections</h1>
              <p className="text-gray-400 mt-1">Vehicle inspection records and checklists</p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Inspection
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search inspections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {inspections.map((inspection) => (
              <Card key={inspection.inspection_id} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <ClipboardCheck className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{inspection.type} Inspection</h3>
                            <Badge className={
                              inspection.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                              inspection.status === 'Failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }>
                              {inspection.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{getVehiclePlate(inspection.vehicle_id)} • {getDriverName(inspection.driver_id)}</p>
                          <p className="text-xs text-gray-500 mt-1">{format(inspection.date, 'MMM dd, yyyy')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {inspection.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                            {getStatusIcon(item.status)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{item.item}</p>
                              {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {inspection.notes && (
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <p className="text-xs text-gray-400">Notes</p>
                          <p className="text-sm text-white mt-1">{inspection.notes}</p>
                        </div>
                      )}
                    </div>

                    {inspection.photos.length > 0 && (
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <img 
                          src={inspection.photos[0]} 
                          alt="Inspection"
                          className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
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

export default Inspections;
