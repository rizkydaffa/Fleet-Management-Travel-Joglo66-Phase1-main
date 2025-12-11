import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { mockDrivers, mockDriverAssignments, mockVehicles } from '../mock/mockData';
import { ArrowLeft, Edit, User, Phone, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';

const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const driver = mockDrivers.find(d => d.driver_id === id);
  
  if (!driver) {
    return (
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Driver not found</h2>
            <Button onClick={() => navigate('/drivers')} className="mt-4">
              Back to Drivers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const assignments = mockDriverAssignments.filter(a => a.driver_id === id);
  const currentAssignment = assignments.find(a => !a.end_date);
  const currentVehicle = currentAssignment ? mockVehicles.find(v => v.vehicle_id === currentAssignment.vehicle_id) : null;

  const isLicenseExpiring = new Date(driver.license_expiry) < new Date(Date.now() + 30*24*60*60*1000);
  const isLicenseExpired = new Date(driver.license_expiry) < new Date();

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/drivers')} className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Driver
            </Button>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white">{driver.name}</h1>
                      <p className="text-gray-400 mt-1">{driver.license_number}</p>
                    </div>
                    <Badge className={driver.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {driver.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      {driver.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-white font-medium">{driver.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-white font-medium">{driver.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">License Expiry</p>
                        <p className={`font-medium ${
                          isLicenseExpired ? 'text-red-400' :
                          isLicenseExpiring ? 'text-orange-400' :
                          'text-white'
                        }`}>
                          {format(new Date(driver.license_expiry), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-white font-medium">{format(driver.created_at, 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentVehicle && (
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Current Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                  {currentVehicle.photos && currentVehicle.photos.length > 0 && (
                    <img 
                      src={currentVehicle.photos[0]} 
                      alt={currentVehicle.plate}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentVehicle.plate}</h3>
                    <p className="text-gray-400">{currentVehicle.brand} {currentVehicle.model}</p>
                    <p className="text-sm text-gray-500 mt-1">Assigned: {format(currentAssignment.start_date, 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment) => {
                  const vehicle = mockVehicles.find(v => v.vehicle_id === assignment.vehicle_id);
                  return (
                    <div key={assignment.assignment_id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{vehicle?.plate}</p>
                          <p className="text-sm text-gray-400">{vehicle?.brand} {vehicle?.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">
                            {format(assignment.start_date, 'MMM dd, yyyy')} - {assignment.end_date ? format(assignment.end_date, 'MMM dd, yyyy') : 'Present'}
                          </p>
                          {assignment.notes && <p className="text-xs text-gray-500">{assignment.notes}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {driver.performance_notes.length > 0 ? (
                <div className="space-y-3">
                  {driver.performance_notes.map((note, idx) => (
                    <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-white">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(note.date, 'MMM dd, yyyy')} - By {note.created_by}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No performance notes yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
