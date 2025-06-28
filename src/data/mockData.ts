// import type {  Store, ForecastData, RouteData, EnvironmentalData, Vehicle } from "../types";


// export const stores: Store[] = [
//     { id: 1, name: "Walmart Andheri", lat: 19.1136, lng: 72.8697, stock: 85, demand: 120, priority: "high" },
//     { id: 2, name: "Walmart Powai", lat: 19.1197, lng: 72.9128, stock: 45, demand: 80, priority: "critical" },
//     // ... other stores
//   ];
  
//   export const forecastData: ForecastData[] = [
//     { day: "Mon", predicted: 120, actual: 115, confidence: 95 },
//     { day: "Tue", predicted: 135, actual: 140, confidence: 92 },
//     // ... other forecast data
//   ];
  
//   export const routeData: RouteData[] = [
//     { route: "Route A", distance: "45 km", time: "2.5 hrs", fuel: "12L", co2: "28kg", efficiency: 85 },
//     { route: "Route C (Optimized)", distance: "38 km", time: "2.1 hrs", fuel: "9L", co2: "21kg", efficiency: 94 },
//     // ... other route data
//   ];
  
//   export const environmentalData: EnvironmentalData[] = [
//     { name: "CO2 Saved", value: 25, color: "#10B981" },
//     { name: "Fuel Saved", value: 18, color: "#3B82F6" },
//     // ... other environmental data
//   ];
  
  // export const vehicles: Vehicle[] = [
  //   { id: "V001", location: "En route to Andheri", progress: 75, eta: "15 min", status: "on-time" },
  //   { id: "V002", location: "Loading at Warehouse", progress: 20, eta: "45 min", status: "delayed" },
  //   // ... other vehicles
  // ];

  // src/data/mockData.ts

import type{
  Store,
  RoutePaths,
  Vehicle,
  ForecastDataPoint,
  RouteTableData,
  EnvironmentalDataPoint,
  NavItem,
} from '../types';
import { TrendingUp, Navigation, Package, MapPin } from 'lucide-react';

export const stores: Store[] = [
  { id: 1, name: "Warehouse", isWarehouse: true, coords: { x: 10, y: 50 } },
  { id: 2, name: "Walmart Andheri", stock: 85, demand: 120, priority: "high", coords: { x: 30, y: 30 } },
  { id: 3, name: "Walmart Powai", stock: 45, demand: 80, priority: "critical", coords: { x: 55, y: 25 } },
  { id: 4, name: "Walmart Thane", stock: 95, demand: 70, priority: "medium", coords: { x: 80, y: 40 } },
  { id: 5, name: "Walmart Bandra", stock: 110, demand: 90, priority: "low", coords: { x: 40, y: 70 } },
  { id: 6, name: "Walmart Malad", stock: 30, demand: 100, priority: "critical", coords: { x: 70, y: 75 } },
];

export const routePaths: RoutePaths = {
  R1: [1, 2, 3, 4], // Warehouse -> Andheri -> Powai -> Thane
  R2: [1, 5, 6],    // Warehouse -> Bandra -> Malad
};

export const initialVehicles: Vehicle[] = [
  { id: "V001", routeId: "R1", location: "En route to Powai", progress: 55, eta: "15 min", status: "on-time" },
  { id: "V002", routeId: "R2", location: "En route to Malad", progress: 70, eta: "12 min", status: "on-time" },
  { id: "V003", routeId: "R1", location: "Loading at Warehouse", progress: 5, eta: "45 min", status: "delayed" },
  { id: "V004", routeId: "R2", location: "Delivered to Bandra", progress: 100, eta: "Complete", status: "completed" },
];

export const forecastData: ForecastDataPoint[] = [
  { day: "Mon", predicted: 120, actual: 115, confidence: 95 },
  { day: "Tue", predicted: 135, actual: 140, confidence: 92 },
  { day: "Wed", predicted: 110, actual: 105, confidence: 88 },
  { day: "Thu", predicted: 155, actual: null, confidence: 91 },
  { day: "Fri", predicted: 180, actual: null, confidence: 87 },
  { day: "Sat", predicted: 200, actual: null, confidence: 93 },
  { day: "Sun", predicted: 165, actual: null, confidence: 89 },
];

export const routeTableData: RouteTableData[] = [
  { route: "Standard Route A", distance: "45 km", time: "2.5 hrs", fuel: "12L", co2: "28kg", efficiency: 85 },
  { route: "Standard Route B", distance: "52 km", time: "3.1 hrs", fuel: "15L", co2: "35kg", efficiency: 72 },
  { route: "SmartRouteAI Optimized", distance: "38 km", time: "2.1 hrs", fuel: "9L", co2: "21kg", efficiency: 94 },
];

export const environmentalData: EnvironmentalDataPoint[] = [
  { name: "CO₂ Saved", value: 25, color: "#22c55e" },
  { name: "Fuel Saved", value: 18, color: "#38bdf8" },
  { name: "Time Saved", value: 30, color: "#f59e0b" },
  { name: "Cost Saved", value: 22, color: "#14b8a6" },
];

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: TrendingUp },
  { id: "routing", label: "Smart Routing", icon: Navigation },
  { id: "inventory", label: "Inventory Forecast", icon: Package },
  { id: "tracking", label: "Live Tracking", icon: MapPin },
];