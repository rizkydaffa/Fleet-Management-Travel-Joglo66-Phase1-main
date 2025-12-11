import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockAlerts, mockVehicles, mockDrivers } from '../mock/mockData';
import { Search, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { format } from 'date-fns';

const Alerts = () => {
  const [alerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const resolvedAlerts = alerts.filter(a => a.status === 'Resolved');

  const getAlertIcon = (priority) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Medium': return <Bell className="w-5 h-5 text-orange-400" />;
      case 'Low': return <Bell className="w-5 h-5 text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const AlertCard = ({ alert }) => (
    <Card className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-3 bg-gray-800 rounded-lg">
              {getAlertIcon(alert.priority)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">{alert.type.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <Badge className={
                  alert.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                  alert.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }>
                  {alert.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
              <p className="text-xs text-gray-500">Created: {format(alert.created_at, 'MMM dd, yyyy')}</p>
              {alert.resolved_at && (
                <p className="text-xs text-gray-500">Resolved: {format(alert.resolved_at, 'MMM dd, yyyy')}</p>
              )}
            </div>
          </div>
          {alert.status === 'Active' && (
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Alerts & Notifications</h1>
              <p className="text-gray-400 mt-1">Monitor important fleet alerts</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4">
                {activeAlerts.map((alert) => (
                  <AlertCard key={alert.alert_id} alert={alert} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resolved">
              <div className="grid gap-4">
                {resolvedAlerts.map((alert) => (
                  <AlertCard key={alert.alert_id} alert={alert} />
                ))}
                {resolvedAlerts.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No resolved alerts</h3>
                    <p className="text-gray-400">Dismissed alerts will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
