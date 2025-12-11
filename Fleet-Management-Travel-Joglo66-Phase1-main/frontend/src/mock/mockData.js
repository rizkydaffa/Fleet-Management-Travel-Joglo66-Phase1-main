// Mock Data for Fleet Management System
import { addDays, subDays, format } from 'date-fns';

export const mockVehicles = [
  {
    vehicle_id: 'veh_001',
    plate: 'B 1234 ABC',
    brand: 'Toyota',
    model: 'Hiace',
    type: 'Van',
    year: 2022,
    vin: 'JT2BF28K0X0123456',
    color: 'White',
    registration_expiry: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
    mileage: 45000,
    fuel_type: 'Diesel',
    ownership_status: 'Owned',
    status: 'Active',
    photos: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'],
    documents: [{name: 'STNK', url: '#', type: 'pdf'}],
    total_value: 350000000,
    created_at: subDays(new Date(), 180)
  },
  {
    vehicle_id: 'veh_002',
    plate: 'B 5678 DEF',
    brand: 'Mercedes-Benz',
    model: 'Sprinter',
    type: 'Bus',
    year: 2021,
    vin: 'WDB9066331R123456',
    color: 'Silver',
    registration_expiry: format(addDays(new Date(), 120), 'yyyy-MM-dd'),
    mileage: 68000,
    fuel_type: 'Diesel',
    ownership_status: 'Owned',
    status: 'Active',
    photos: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'],
    documents: [{name: 'STNK', url: '#', type: 'pdf'}],
    total_value: 750000000,
    created_at: subDays(new Date(), 240)
  },
  {
    vehicle_id: 'veh_003',
    plate: 'B 9012 GHI',
    brand: 'Isuzu',
    model: 'Elf',
    type: 'Truck',
    year: 2020,
    vin: 'JALE5W16907123456',
    color: 'Blue',
    registration_expiry: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
    mileage: 95000,
    fuel_type: 'Diesel',
    ownership_status: 'Owned',
    status: 'Maintenance',
    photos: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400'],
    documents: [{name: 'STNK', url: '#', type: 'pdf'}],
    total_value: 280000000,
    created_at: subDays(new Date(), 365)
  },
  {
    vehicle_id: 'veh_004',
    plate: 'B 3456 JKL',
    brand: 'Toyota',
    model: 'Avanza',
    type: 'Car',
    year: 2023,
    vin: 'MHFM1BA3JLK123456',
    color: 'Black',
    registration_expiry: format(addDays(new Date(), 200), 'yyyy-MM-dd'),
    mileage: 12000,
    fuel_type: 'Petrol',
    ownership_status: 'Leased',
    status: 'Active',
    photos: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'],
    documents: [{name: 'STNK', url: '#', type: 'pdf'}],
    total_value: 220000000,
    created_at: subDays(new Date(), 60)
  },
  {
    vehicle_id: 'veh_005',
    plate: 'B 7890 MNO',
    brand: 'Mitsubishi',
    model: 'L300',
    type: 'Van',
    year: 2019,
    vin: 'JMBLNCS3LRK123456',
    color: 'White',
    registration_expiry: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
    mileage: 115000,
    fuel_type: 'Diesel',
    ownership_status: 'Owned',
    status: 'Active',
    photos: ['https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400'],
    documents: [{name: 'STNK', url: '#', type: 'pdf'}],
    total_value: 180000000,
    created_at: subDays(new Date(), 450)
  }
];

export const mockDrivers = [
  {
    driver_id: 'drv_001',
    name: 'Budi Santoso',
    license_number: 'B123456789',
    license_expiry: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
    phone: '+62 812-3456-7890',
    email: 'budi.santoso@joglo66.com',
    documents: [{name: 'SIM A', url: '#', type: 'pdf'}],
    performance_notes: [{date: new Date(), note: 'Excellent safety record', created_by: 'Admin'}],
    status: 'Active',
    created_at: subDays(new Date(), 200)
  },
  {
    driver_id: 'drv_002',
    name: 'Andi Wijaya',
    license_number: 'B987654321',
    license_expiry: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
    phone: '+62 813-7654-3210',
    email: 'andi.wijaya@joglo66.com',
    documents: [{name: 'SIM A', url: '#', type: 'pdf'}],
    performance_notes: [],
    status: 'Active',
    created_at: subDays(new Date(), 150)
  },
  {
    driver_id: 'drv_003',
    name: 'Bambang Setiawan',
    license_number: 'B555444333',
    license_expiry: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    phone: '+62 814-5554-4433',
    email: 'bambang@joglo66.com',
    documents: [{name: 'SIM A', url: '#', type: 'pdf'}],
    performance_notes: [{date: subDays(new Date(), 5), note: 'License renewal required', created_by: 'Manager'}],
    status: 'Inactive',
    created_at: subDays(new Date(), 300)
  }
];

export const mockMaintenanceRecords = [
  {
    record_id: 'mnt_001',
    vehicle_id: 'veh_001',
    service_type: 'Oil Change',
    date: subDays(new Date(), 10),
    mileage: 44500,
    cost: 850000,
    parts: [{part_id: 'prt_001', quantity: 1, cost: 350000}],
    technician: 'Agus Pratama',
    work_order_id: 'wo_001',
    warranty_expiry: addDays(new Date(), 80),
    notes: 'Regular maintenance',
    created_at: subDays(new Date(), 10)
  },
  {
    record_id: 'mnt_002',
    vehicle_id: 'veh_002',
    service_type: 'Brake Service',
    date: subDays(new Date(), 5),
    mileage: 67800,
    cost: 2500000,
    parts: [{part_id: 'prt_002', quantity: 4, cost: 1800000}],
    technician: 'Dedi Kurniawan',
    work_order_id: 'wo_002',
    warranty_expiry: addDays(new Date(), 175),
    notes: 'Replaced brake pads',
    created_at: subDays(new Date(), 5)
  },
  {
    record_id: 'mnt_003',
    vehicle_id: 'veh_003',
    service_type: 'Engine Overhaul',
    date: new Date(),
    mileage: 95000,
    cost: 15000000,
    parts: [{part_id: 'prt_003', quantity: 1, cost: 8000000}],
    technician: 'Agus Pratama',
    work_order_id: 'wo_003',
    warranty_expiry: addDays(new Date(), 365),
    notes: 'Major engine repair',
    created_at: new Date()
  }
];

export const mockWorkOrders = [
  {
    order_id: 'wo_001',
    vehicle_id: 'veh_001',
    assigned_to: 'mech_001',
    status: 'Completed',
    priority: 'Medium',
    description: 'Regular oil change service',
    parts: [{part_id: 'prt_001', quantity: 1}],
    labor_cost: 500000,
    parts_cost: 350000,
    total_cost: 850000,
    scheduled_date: subDays(new Date(), 10),
    completed_date: subDays(new Date(), 10),
    created_at: subDays(new Date(), 12)
  },
  {
    order_id: 'wo_002',
    vehicle_id: 'veh_002',
    assigned_to: 'mech_002',
    status: 'Completed',
    priority: 'High',
    description: 'Brake system maintenance',
    parts: [{part_id: 'prt_002', quantity: 4}],
    labor_cost: 700000,
    parts_cost: 1800000,
    total_cost: 2500000,
    scheduled_date: subDays(new Date(), 6),
    completed_date: subDays(new Date(), 5),
    created_at: subDays(new Date(), 8)
  },
  {
    order_id: 'wo_003',
    vehicle_id: 'veh_003',
    assigned_to: 'mech_001',
    status: 'In Progress',
    priority: 'Critical',
    description: 'Engine overhaul - major repair',
    parts: [{part_id: 'prt_003', quantity: 1}],
    labor_cost: 7000000,
    parts_cost: 8000000,
    total_cost: 15000000,
    scheduled_date: subDays(new Date(), 2),
    completed_date: null,
    created_at: subDays(new Date(), 3)
  },
  {
    order_id: 'wo_004',
    vehicle_id: 'veh_004',
    assigned_to: 'mech_002',
    status: 'Pending',
    priority: 'Low',
    description: 'Routine inspection',
    parts: [],
    labor_cost: 300000,
    parts_cost: 0,
    total_cost: 300000,
    scheduled_date: addDays(new Date(), 3),
    completed_date: null,
    created_at: new Date()
  }
];

export const mockFuelLogs = [
  {
    log_id: 'fuel_001',
    vehicle_id: 'veh_001',
    driver_id: 'drv_001',
    date: subDays(new Date(), 1),
    quantity: 45,
    cost: 585000,
    odometer: 45000,
    fuel_type: 'Diesel',
    receipt_url: '#',
    cost_per_km: 13,
    created_at: subDays(new Date(), 1)
  },
  {
    log_id: 'fuel_002',
    vehicle_id: 'veh_002',
    driver_id: 'drv_002',
    date: subDays(new Date(), 2),
    quantity: 60,
    cost: 780000,
    odometer: 68000,
    fuel_type: 'Diesel',
    receipt_url: '#',
    cost_per_km: 13,
    created_at: subDays(new Date(), 2)
  },
  {
    log_id: 'fuel_003',
    vehicle_id: 'veh_004',
    driver_id: 'drv_001',
    date: subDays(new Date(), 3),
    quantity: 35,
    cost: 455000,
    odometer: 12000,
    fuel_type: 'Petrol',
    receipt_url: '#',
    cost_per_km: 13,
    created_at: subDays(new Date(), 3)
  }
];

export const mockPartsInventory = [
  {
    part_id: 'prt_001',
    name: 'Engine Oil 5W-30',
    part_number: 'OIL-5W30-001',
    quantity: 25,
    min_stock: 10,
    cost: 350000,
    supplier: 'PT Oli Jaya',
    location: 'Warehouse A-1',
    created_at: subDays(new Date(), 100)
  },
  {
    part_id: 'prt_002',
    name: 'Brake Pad Set',
    part_number: 'BRK-PAD-002',
    quantity: 8,
    min_stock: 5,
    cost: 450000,
    supplier: 'PT Spare Part Indo',
    location: 'Warehouse B-3',
    created_at: subDays(new Date(), 120)
  },
  {
    part_id: 'prt_003',
    name: 'Engine Assembly Kit',
    part_number: 'ENG-KIT-003',
    quantity: 2,
    min_stock: 1,
    cost: 8000000,
    supplier: 'PT Mesin Otomotif',
    location: 'Warehouse C-1',
    created_at: subDays(new Date(), 150)
  },
  {
    part_id: 'prt_004',
    name: 'Air Filter',
    part_number: 'AIR-FLT-004',
    quantity: 5,
    min_stock: 8,
    cost: 125000,
    supplier: 'PT Filter Nusantara',
    location: 'Warehouse A-2',
    created_at: subDays(new Date(), 80)
  }
];

export const mockTires = [
  {
    tire_id: 'tire_001',
    vehicle_id: 'veh_001',
    position: 'Front Left',
    brand: 'Bridgestone',
    size: '195/70R15',
    installation_date: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    mileage_installed: 25000,
    cost: 850000,
    status: 'Active',
    created_at: subDays(new Date(), 180)
  },
  {
    tire_id: 'tire_002',
    vehicle_id: 'veh_001',
    position: 'Front Right',
    brand: 'Bridgestone',
    size: '195/70R15',
    installation_date: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    mileage_installed: 25000,
    cost: 850000,
    status: 'Active',
    created_at: subDays(new Date(), 180)
  },
  {
    tire_id: 'tire_003',
    vehicle_id: 'veh_002',
    position: 'Front Left',
    brand: 'Michelin',
    size: '225/75R16',
    installation_date: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    mileage_installed: 58000,
    cost: 1200000,
    status: 'Active',
    created_at: subDays(new Date(), 90)
  }
];

export const mockInspections = [
  {
    inspection_id: 'insp_001',
    vehicle_id: 'veh_001',
    driver_id: 'drv_001',
    type: 'Pre-Trip',
    date: new Date(),
    checklist: [
      {item: 'Lights', status: 'Pass', notes: ''},
      {item: 'Brakes', status: 'Pass', notes: ''},
      {item: 'Tires', status: 'Pass', notes: 'All good'},
      {item: 'Engine', status: 'Pass', notes: ''}
    ],
    photos: [],
    status: 'Approved',
    approved_by: 'manager_001',
    notes: 'All systems operational',
    created_at: new Date()
  },
  {
    inspection_id: 'insp_002',
    vehicle_id: 'veh_003',
    driver_id: 'drv_002',
    type: 'Monthly',
    date: subDays(new Date(), 5),
    checklist: [
      {item: 'Lights', status: 'Pass', notes: ''},
      {item: 'Brakes', status: 'Fail', notes: 'Squeaking noise detected'},
      {item: 'Tires', status: 'Pass', notes: ''},
      {item: 'Engine', status: 'Fail', notes: 'Overheating issue'}
    ],
    photos: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'],
    status: 'Failed',
    approved_by: null,
    notes: 'Vehicle requires immediate maintenance',
    created_at: subDays(new Date(), 5)
  }
];

export const mockAlerts = [
  {
    alert_id: 'alt_001',
    type: 'RegistrationExpiry',
    vehicle_id: 'veh_003',
    driver_id: null,
    message: 'Vehicle B 9012 GHI registration expired',
    status: 'Active',
    priority: 'High',
    created_at: new Date(),
    resolved_at: null
  },
  {
    alert_id: 'alt_002',
    type: 'ServiceDue',
    vehicle_id: 'veh_005',
    driver_id: null,
    message: 'Vehicle B 7890 MNO service due in 500 km',
    status: 'Active',
    priority: 'Medium',
    created_at: subDays(new Date(), 1),
    resolved_at: null
  },
  {
    alert_id: 'alt_003',
    type: 'LicenseExpiry',
    vehicle_id: null,
    driver_id: 'drv_003',
    message: 'Driver Bambang Setiawan license expired',
    status: 'Active',
    priority: 'High',
    created_at: new Date(),
    resolved_at: null
  },
  {
    alert_id: 'alt_004',
    type: 'LowStock',
    vehicle_id: null,
    driver_id: null,
    message: 'Air Filter stock below minimum (5 < 8)',
    status: 'Active',
    priority: 'Low',
    created_at: subDays(new Date(), 2),
    resolved_at: null
  }
];

export const mockDashboardStats = {
  totalVehicles: 5,
  activeVehicles: 4,
  maintenanceVehicles: 1,
  totalDrivers: 3,
  activeDrivers: 2,
  pendingWorkOrders: 1,
  completedWorkOrders: 2,
  totalAlerts: 4,
  monthlyFuelCost: 1820000,
  monthlyMaintenanceCost: 18350000,
  avgFuelEfficiency: 8.5,
  totalMileageThisMonth: 12500
};

export const mockDriverAssignments = [
  {
    assignment_id: 'asn_001',
    vehicle_id: 'veh_001',
    driver_id: 'drv_001',
    start_date: subDays(new Date(), 30),
    end_date: null,
    notes: 'Primary driver',
    created_at: subDays(new Date(), 30)
  },
  {
    assignment_id: 'asn_002',
    vehicle_id: 'veh_002',
    driver_id: 'drv_002',
    start_date: subDays(new Date(), 20),
    end_date: null,
    notes: 'Long distance routes',
    created_at: subDays(new Date(), 20)
  }
];
