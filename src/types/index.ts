import type{ User } from 'firebase/auth';

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

  pickupLocation: string;
  deliveryLocation: string;

  pickupCoords: Coordinates;
  deliveryCoords: Coordinates;

  size: "Small" | "Medium" | "Large";

  description: string;

  status: "pending" | "assigned" | "delivered";

  createdAt: FirestoreTimestamp;
  deliveryTime?: FirestoreTimestamp;
}



export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}