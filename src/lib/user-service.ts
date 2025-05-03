import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserProfile, UserRole } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';

/**
 * Creates or updates a user profile document in Firestore.
 * @param user - The Firebase Auth user object.
 * @param role - The selected role for the user.
 * @param isVerified - The email verification status (true for Google/verified, false for email needing verification).
 */
export async function createUserProfile(user: FirebaseUser, role: UserRole, isVerified: boolean): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const userData: UserProfile = {
    uid: user.uid,
    email: user.email,
    role: role,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isVerified: isVerified,
    createdAt: serverTimestamp() as Timestamp, // Use serverTimestamp for consistency
  };

  try {
    await setDoc(userRef, userData, { merge: true }); // Use merge: true to avoid overwriting existing fields unintentionally
    console.log('User profile created/updated successfully for UID:', user.uid);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    // Consider throwing the error or handling it more specifically
    throw new Error('Failed to create user profile.');
  }
}

/**
 * Fetches a user profile document from Firestore.
 * @param uid - The user ID.
 * @returns The user profile data or null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      // Explicitly cast to UserProfile after checking existence
      return docSnap.data() as UserProfile;
    } else {
      console.log('No user profile found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile.');
  }
}

/**
 * Updates specific fields in a user profile document.
 * @param uid - The user ID.
 * @param updates - An object containing the fields to update.
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    try {
        await setDoc(userRef, updates, { merge: true });
        console.log('User profile updated successfully for UID:', uid);
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile.');
    }
}
