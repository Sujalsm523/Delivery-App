import type{ User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'volunteer' | 'recipient' | 'storeAssociate';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  isVerified?: boolean;
  
}

export type PackageStatus = 'pending' | 'assigned' | 'inTransit' | 'delivered' | 'cancelled';
export interface Coordinates {
  lat: number;
  lng: number;
}

export type FirestoreTimestamp = Date | { toDate: () => Date };

export interface Package {
  id: string; // Firestore document ID
  senderId: string;
  senderEmail: string;
  assignedVolunteerId: string | null;
  assignedVolunteerEmail?: string; // Optional; present when assigned
   recipientId:string;
  recipientEmail: string;
  recipientName: string;
  priority?: "high" | "medium" | "low" | string;
  pickupLocation: string;
  deliveryLocation: string;
estimatedTime?: string; 
  pickupCoords: Coordinates;
  deliveryCoords: Coordinates;
distance?: string;
deliveryTime?: string; // Estimated delivery time in HH:MM format
  estimatedDistance?: string; // Estimated distance in km or miles
  size: "Small" | "Medium" | "Large";

  description: string;

  status: "pending" | "assigned" | "inTransit" | "delivered" | "cancelled";

  createdAt: FirestoreTimestamp;
  // deliveryTime?: Date | Timestamp; // Used for actual delivered timestamp
  assignedVolunteerName?: string;
  assignedVolunteerPhone?: string; // Ensure this field exists for direct call
  assignedAt?: Date | Timestamp;
  inTransitAt?: Date | Timestamp;
  cancelledAt?: Date | Timestamp;
  notesFromRecipient?: string; // New: For recipient-added notes/instructions
  notesFromVolunteer?: string; // New: For volunteer-added notes (e.g., "Left at porch")
  proofOfDeliveryUrl?: string; 
}



export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}


// src/types/index.ts

import type{ LucideIcon } from 'lucide-react';

// Defines coordinates for store and vehicle locations
export type Coords = {
  x: number;
  y: number;
};

// Defines the priority levels for store inventory
export type StorePriority = 'high' | 'critical' | 'medium' | 'low';

// Defines the structure of a store or warehouse object
export type Store = {
  id: number;
  name: string;
  isWarehouse?: boolean;
  stock?: number;
  demand?: number;
  priority?: StorePriority;
  coords: Coords;
};

// Defines the structure for route paths, mapping a route ID to an array of store IDs
export type RoutePaths = {
  [key: string]: number[];
};

// Defines the possible statuses of a vehicle
export type VehicleStatus = 'on-time' | 'delayed' | 'completed';

// Defines the structure of a vehicle object
export type Vehicle = {
  id: string;
  routeId: string;
  location: string;
  progress: number;
  eta: string;
  status: VehicleStatus;
};

// Defines a single data point for the demand forecast chart
export type ForecastDataPoint = {
  day: string;
  predicted: number;
  actual: number | null;
  confidence: number;
};

// Defines the structure for a row in the route comparison table
export type RouteTableData = {
  route: string;
  distance: string;
  time: string;
  fuel: string;
  co2: string;
  efficiency: number;
};

// Defines a data point for the environmental impact section
export type EnvironmentalDataPoint = {
  name: string;
  value: number;
  color: string;
};

// Defines the possible IDs for the navigation tabs
export type TabId = 'dashboard' | 'routing' | 'inventory' | 'tracking';

// Defines the structure for a navigation item
export type NavItem = {
    id: TabId;
    label: string;
    icon: LucideIcon;
};