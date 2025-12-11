import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Wrench,
  Users,
  Fuel,
  Package,
  Circle,
  ClipboardCheck,
  Bell,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Mechanic', 'Driver'] },
    { name: 'Vehicles', path: '/vehicles', icon: Truck, roles: ['Admin', 'Manager', 'Mechanic'] },
    { name: 'Odometer', path: '/odometer', icon: BarChart3, roles: ['Admin', 'Manager', 'Driver'] },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Admin', 'Manager', 'Mechanic'] },
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Admin', 'Manager'] },
    { name: 'Fuel Logs', path: '/fuel', icon: Fuel, roles: ['Admin', 'Manager', 'Driver'] },
    { name: 'Parts', path: '/parts', icon: Package, roles: ['Admin', 'Manager', 'Mechanic'] },
    { name: 'Tires', path: '/tires', icon: Circle, roles: ['Admin', 'Manager', 'Mechanic'] },
    { name: 'Inspections', path: '/inspections', icon: ClipboardCheck, roles: ['Admin', 'Manager', 'Driver'] },
    { name: 'Alerts', path: '/alerts', icon: Bell, roles: ['Admin', 'Manager'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const NavContent = () => (
    <>
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Joglo66 Trans</h1>
        <p className="text-xs text-gray-400 mt-1">Fleet Management</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center px-4 py-3 bg-gray-800 rounded-lg mb-3">
          <img
            src={user?.picture || 'https://via.placeholder.com/40'}
            alt={user?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-950 flex flex-col shadow-xl border-r border-gray-800" onClick={(e) => e.stopPropagation()}>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-gray-950 flex-col border-r border-gray-800">
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
