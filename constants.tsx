
import React from 'react';
import { WorkshopInfo, CarService, ServiceCategory } from './types';

export const WORKSHOP: WorkshopInfo = {
  name: "Annai Varahi Car Care",
  phone: "+91 98655 62421",
  email: "annaivarakic@gmail.com",
  whatsapp: "919865562421",
  address: "Mariamman Kovil Bye Pass Road, Thanjavur, Tamil Nadu",
  mapsUrl: "https://goo.gl/maps/example",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.623456789!2d79.1378!3d10.787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ3JzEyLjYiTiA3OcKwMDgnMTYuMSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
};

export const SERVICES: CarService[] = [
  {
    id: 'general',
    name: 'General Service',
    description: 'Comprehensive 50-point inspection, fluid top-ups, and basic tuning.',
    category: ServiceCategory.MAINTENANCE,
    icon: 'fa-car'
  },
  {
    id: 'oil',
    name: 'Express Oil Change',
    description: 'High-quality synthetic oil and filter replacement for engine longevity.',
    category: ServiceCategory.MAINTENANCE,
    icon: 'fa-oil-can'
  },
  {
    id: 'brake',
    name: 'Brake Specialist',
    description: 'Disc resurfacing, pad replacement, and brake fluid flushing.',
    category: ServiceCategory.REPAIR,
    icon: 'fa-circle-stop'
  },
  {
    id: 'engine',
    name: 'Engine Diagnostic',
    description: 'Scanning and repairing engine faults, sensors, and mechanical issues.',
    category: ServiceCategory.REPAIR,
    icon: 'fa-engine-warning'
  },
  {
    id: 'ac',
    name: 'AC Multi-Point',
    description: 'Gas recharging, cabin filter cleaning, and cooling efficiency check.',
    category: ServiceCategory.ELECTRICAL,
    icon: 'fa-snowflake'
  },
  {
    id: 'alignment',
    name: 'Wheel Care',
    description: 'Computerized 3D wheel alignment and balancing for smooth driving.',
    category: ServiceCategory.WHEELS,
    icon: 'fa-gauge-high'
  },
  {
    id: 'battery',
    name: 'Battery & Electrical',
    description: 'Battery health check, alternator testing, and wiring repairs.',
    category: ServiceCategory.ELECTRICAL,
    icon: 'fa-car-battery'
  },
  {
    id: 'detailing',
    name: 'Deep Detailing',
    description: 'Interior vacuuming, exterior polishing, and engine bay cleaning.',
    category: ServiceCategory.CLEANING,
    icon: 'fa-sparkles'
  }
];
