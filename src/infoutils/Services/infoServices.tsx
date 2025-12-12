// Agregar tipos de vehículo detallados
export type VehicleBrand = 'CHANGAN' | 'GWM' | 'ZX' | 'Otro';
export type VehicleType = 'carro' | 'moto';

// Modelos específicos por marca
export const VEHICLE_MODELS = {
  CHANGAN: [
    'New CS15',
    'New CS35 Plus',
    'New CS55 Plus',
    'UNI-T',
    'UNI-K',
    'New AIswin',
    'Titan Series'
  ],
  GWM: [
    'Wingle 7',
    'Poer Automático',
    'Poer Mecánico',
    'Haval H6',
    'Haval H6 Hev',
    'Haval Jolion',
    'Haval Jolion Hev',
    'Wingle 5'
  ],
  ZX: [
    'Terralord Automático',
    'Terralord Mecánico',
    'GrandTiger',
    'GrandLion'
  ],
  Otro: ['Otro modelo']
};

// Tipos de servicios detallados
export type ServiceCategory = 'pintura' | 'mecanica' | 'mantenimiento' | 'accesorios';

export const SERVICE_CATEGORIES = {
  pintura: [
    'Reparaciones de pintura',
    'Pulido general',
    'Pintura general',
    'Reparación parcial (piezas)',
    'Tratamiento para vidrios',
    'Polarizados'
  ],
  mecanica: [
    'Reparaciones de taller mecánico',
    'Mantenimientos preventivos',
    'Reemplazo de frenos',
    'Reemplazo de kit de embrague',
    'Reparación mecánica',
    'Diagnóstico eléctrico',
    'Diagnóstico mecánico'
  ],
  mantenimiento: [
    'Mantenimiento 5,000 km',
    'Mantenimiento 10,000 km',
    'Mantenimiento 15,000 km',
    'Mantenimiento 20,000 km',
    'Mantenimiento 25,000 km',
    'Cambio de aceite',
    'Rotación de llantas',
    'Revisión de frenos'
  ],
  accesorios: [
    'Accesorios exteriores',
    'Accesorios interiores',
    'Sistemas de audio',
    'Protección y seguridad'
  ]
};

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number;
  compatibleBrands: VehicleBrand[];
  compatibleModels?: string[]; // Modelos específicos
  requiresMileage?: boolean; // Para mantenimientos
  recommendedInterval?: number; // Kilómetros para mantenimientos
}

export interface ServiceHistory {
  id: string;
  service: Service;
  date: string;
  vehicleInfo: {
    brand: VehicleBrand;
    model: string;
    year: number;
    plate?: string;
    type: VehicleType;
    mileage?: number; // Para mantenimientos
  };
  status: 'completado' | 'pendiente' | 'cancelado';
  total: number;
  paymentPlan?: {
    method: 'tarjeta' | 'app' | 'efectivo';
    frequency: 'semanal' | 'quincenal' | 'mensual';
    installments: number;
    totalInstallments: number;
  };
}

export const SERVICES: Service[] = [
  // Servicios de pintura
  {
    id: 'pint-1',
    name: 'Reparaciones de pintura',
    category: 'pintura',
    description: 'Reparación profesional de daños en la pintura',
    price: 1500,
    duration: 120,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
    compatibleModels: [] // Todos los modelos
  },
  {
    id: 'pint-2',
    name: 'Pulido general',
    category: 'pintura',
    description: 'Pulido completo del vehículo para restaurar brillo',
    price: 800,
    duration: 90,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },
  {
    id: 'pint-3',
    name: 'Polarizados',
    category: 'pintura',
    description: 'Instalación de película polarizada para ventanas',
    price: 1200,
    duration: 60,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },

  // Servicios mecanicos
  {
    id: 'mec-1',
    name: 'Reparaciones de taller mecánico',
    category: 'mecanica',
    description: 'Reparaciones generales del sistema mecánico',
    price: 2500,
    duration: 180,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },
  {
    id: 'mec-2',
    name: 'Reemplazo de frenos',
    category: 'mecanica',
    description: 'Reemplazo completo de pastillas y discos de freno',
    price: 1800,
    duration: 90,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },
  {
    id: 'mec-3',
    name: 'Reemplazo de kit de embrague',
    category: 'mecanica',
    description: 'Cambio completo del kit de embrague',
    price: 3200,
    duration: 240,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
    compatibleModels: ['Poer Mecánico', 'Terralord Mecánico']
  },

  // Mantenimientos preventivos
  {
    id: 'mant-1',
    name: 'Mantenimiento 10,000 km',
    category: 'mantenimiento',
    description: 'Mantenimiento preventivo para 10,000 km',
    price: 7650,
    duration: 120,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
    requiresMileage: true,
    recommendedInterval: 10000
  },
  {
    id: 'mant-2',
    name: 'Mantenimiento 20,000 km',
    category: 'mantenimiento',
    description: 'Mantenimiento preventivo para 20,000 km',
    price: 9500,
    duration: 150,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
    requiresMileage: true,
    recommendedInterval: 20000
  },
  {
    id: 'mant-3',
    name: 'Cambio de aceite',
    category: 'mantenimiento',
    description: 'Cambio de aceite y filtro',
    price: 800,
    duration: 45,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },

  // Accesorios
  {
    id: 'acc-1',
    name: 'Accesorios exteriores',
    category: 'accesorios',
    description: 'Instalación de accesorios exteriores',
    price: 1200,
    duration: 60,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  },
  {
    id: 'acc-2',
    name: 'Sistemas de audio',
    category: 'accesorios',
    description: 'Instalación de sistema de audio premium',
    price: 3500,
    duration: 120,
    compatibleBrands: ['CHANGAN', 'GWM', 'ZX'],
  }
];