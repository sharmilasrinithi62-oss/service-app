
export enum ServiceCategory {
  MAINTENANCE = 'Maintenance',
  REPAIR = 'Repair',
  ELECTRICAL = 'Electrical',
  WHEELS = 'Wheels & Tyres',
  CLEANING = 'Cleaning & Detailing'
}

export interface CarService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  priceEstimate?: string;
  icon: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  carDetails: string;
  selectedServices: string[];
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: number;
}

export interface WorkshopInfo {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  mapsUrl: string;
  googleMapsEmbed: string;
}
