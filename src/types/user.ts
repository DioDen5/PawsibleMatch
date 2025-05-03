import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'volunteer' | 'shelter';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName?: string | null;
  photoURL?: string | null;
  isVerified: boolean;
  createdAt: Timestamp;
}
