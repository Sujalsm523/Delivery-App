// src/types/index.ts
import type { User } from 'firebase/auth';

export type UserRole = 'volunteer' | 'recipient' | 'storeAssociate';

export interface UserProfile {
  uid: string;
  email: string;
  name:string;
  role: UserRole;
  isVerified: boolean; // For the 'Verification & Trust System'
  credits: number;     // For the 'Gamification & Rewards'
  rating: number;      // Average rating
  deliveriesCompleted: number;
}

export type PackageStatus = 'pending' | 'assigned' | 'inTransit' | 'delivered' | 'cancelled';

export interface Package {
  id: string;
  senderId: string;
  senderName: string; // Good to have for display
  pickupLocation: string;
  deliveryLocation: string;
  size: 'small' | 'medium' | 'large';
  description: string;
  status: PackageStatus;
  createdAt: Date;
  
  // --- NEW FIELDS FOR PHASE 1 ---
  specialInstructions?: string; // e.g., "Gate code is #1234"
  preferredDeliveryTime?: string; // e.g., "Anytime after 5 PM"
  deliveryPhotoUrl?: string; // URL to the confirmation photo in Firebase Storage
  // --------------------------------

  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  deliveryTime?: Date;
}

// Keep the AuthContextType as it is
export interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
}