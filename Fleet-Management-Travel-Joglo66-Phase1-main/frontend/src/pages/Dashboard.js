import React from 'react';
import Sidebar from '../components/Sidebar';
import { useData } from '../context/DataContext';
import {
  Truck,
  Wrench,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data, getDashboardStats } = useData();
  const stats = getDashboardStats();
  const recentAlerts = data.alerts.filter(a => a.status === 'Active').slice(0, 5);
  const highPriorityWorkOrders = data.workOrders.filter(wo => wo.priority === 'High' || wo.priority === 'Critical').slice(0, 5);
  const recentWorkOrders = highPriorityWorkOrders.length > 0 ? highPriorityWorkOrders : data.workOrders.slice(0, 5);
  const mockVehicles = data.vehicles;
  const vehiclesNeedingAttention = mockVehicles.filter(v => v.status !== 'Active');

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      subtitle: `${stats.activeVehicles} active`,
      icon: Truck,
      color: 'blue',
      trend: '+2 this month'
    },
    {
      title: 'Active Drivers',
      value: stats.activeDrivers,
      subtitle: `${stats.totalDrivers} total`,
      icon: Users,
      color: 'green',
      trend: 'All licensed'
    },
    {
      title: 'Work Orders',
      value: stats.pendingWorkOrders,
      subtitle: 'pending',
      icon: Wrench,
      color: 'orange',
      trend: `${stats.completedWorkOrders} completed`
    },
    {
      title: 'Active Alerts',
      value: stats.totalAlerts,
      subtitle: 'require attention',
      icon: AlertTriangle,
      color: 'red',
      trend: '2 high priority'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      red: 'bg-red-100 text-red-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Fleet management overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="hover:shadow-xl transition-shadow bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${getColorClass(stat.color)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <Activity className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cost Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="w-5 h-5" />
                  Monthly Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Fuel</p>
                      <p className="text-2xl font-bold text-white">Rp {(stats.monthlyFuelCost / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="flex items-center text-green-400">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span className="text-sm">-5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Maintenance</p>
                      <p className="text-2xl font-bold text-white">Rp {(stats.monthlyMaintenanceCost / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="flex items-center text-red-400">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+12%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-300">Total</p>
                      <p className="text-xl font-bold text-white">Rp {((stats.monthlyFuelCost + stats.monthlyMaintenanceCost) / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Fleet Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Average Fuel Efficiency</p>
                      <p className="text-lg font-semibold text-white">{stats.avgFuelEfficiency} km/L</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Total Mileage This Month</p>
                      <p className="text-lg font-semibold text-white">{stats.totalMileageThisMonth.toLocaleString()} km</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Vehicle Utilization</p>
                      <p className="text-lg font-semibold text-white">80%</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Recent Alerts</span>
                  <Badge variant="destructive">{recentAlerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.alert_id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.priority === 'High' ? 'text-red-400' :
                        alert.priority === 'Medium' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{format(alert.created_at, 'MMM dd, yyyy')}</p>
                      </div>
                      <Badge variant={alert.priority === 'High' ? 'destructive' : 'secondary'}>
                        {alert.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Orders */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">High Priority Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWorkOrders.map((order) => {
                    const vehicle = mockVehicles.find(v => v.vehicle_id === order.vehicle_id);
                    return (
                      <div key={order.order_id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        {vehicle?.photos && vehicle.photos.length > 0 && (
                          <img 
                            src={vehicle.photos[0]} 
                            alt={vehicle.plate}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{vehicle?.plate}</p>
                            <Badge className={
                              order.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                              order.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }>
                              {order.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{order.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Rp {(order.total_cost / 1000000).toFixed(1)}M</p>
                        </div>
                        <Badge variant={
                          order.status === 'Completed' ? 'default' :
                          order.status === 'In Progress' ? 'secondary' :
                          'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
