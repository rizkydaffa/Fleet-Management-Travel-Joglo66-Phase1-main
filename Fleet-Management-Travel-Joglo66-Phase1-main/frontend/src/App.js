import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import Maintenance from "./pages/Maintenance";
import Drivers from "./pages/Drivers";
import Fuel from "./pages/Fuel";
import Parts from "./pages/Parts";
import Tires from "./pages/Tires";
import Inspections from "./pages/Inspections";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import OdometerTracking from "./pages/OdometerTracking";
import DriverDetails from "./pages/DriverDetails";

function AppRouter() {
  const location = useLocation();

  // Check for session_id during render (synchronous)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Mechanic']}>
            <Vehicles />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles/:id" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Mechanic']}>
            <VehicleDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/odometer" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Driver']}>
            <OdometerTracking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/maintenance" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Mechanic']}>
            <Maintenance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/drivers" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <Drivers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/drivers/:id" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DriverDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/fuel" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Driver']}>
            <Fuel />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/parts" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Mechanic']}>
            <Parts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tires" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Mechanic']}>
            <Tires />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inspections" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Driver']}>
            <Inspections />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/alerts" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <Alerts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <Reports />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRouter />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
