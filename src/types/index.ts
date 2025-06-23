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

export interface Package {
  id: string;
  senderId: string;
  senderEmail: string;
  pickupLocation: string;
  deliveryLocation: string;
  size: 'small' | 'medium' | 'large';
  description: string;
  status: PackageStatus;
  createdAt: Date;
  assignedVolunteerId?: string;
  assignedVolunteerEmail?: string;
  deliveryTime?: Date;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}