"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { getUserProfile } from '@/lib/user-service';
import type { UserProfile, UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Use App Router's router


interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  role: UserRole | null;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserProfileData = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        // Ensure local FirebaseUser verification status matches Firestore record
        if (profile && firebaseUser.emailVerified !== profile.isVerified) {
           // This can happen if verification occurred but Firestore wasn't updated yet
           // Or if the Firestore record was manually changed. Let's trust the Firebase Auth state primarily
           // but maybe log a warning or decide on a source of truth. For now, update profile based on user.
           if (firebaseUser.emailVerified && !profile.isVerified) {
                console.warn("Firestore verification status mismatch for user:", firebaseUser.uid, "Updating profile.");
                // await updateUserProfile(firebaseUser.uid, { isVerified: true }); // Optional: Sync Firestore
                setUserProfile(prev => prev ? { ...prev, isVerified: true } : null);
           }
        }

      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null); // Clear profile on error
        toast({
          title: 'Error',
          description: 'Could not load your user profile.',
          variant: 'destructive',
        });
      }
    } else {
      setUserProfile(null); // Clear profile if no user
    }
  }, [toast]);


  const reloadUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        setLoading(true);
        try {
            await currentUser.reload();
            // Re-fetch profile after reload to get potentially updated verification status
            await fetchUserProfileData(currentUser);
            // Update the user state explicitly after reload
            setUser(auth.currentUser);
        } catch (error) {
            console.error("Error reloading user:", error);
            toast({
                title: 'Error',
                description: 'Failed to refresh user status.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }
  }, [fetchUserProfileData, toast]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await fetchUserProfileData(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchUserProfileData]);

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: 'Sign Out Error',
        description: 'Could not sign you out. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  // Use user.emailVerified primarily, fallback to profile.isVerified if needed (though they should ideally match after reloadUser)
  const isVerified = !!user?.emailVerified || !!userProfile?.isVerified;
  const role = userProfile?.role || null;

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAuthenticated, isVerified, role, signOut, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
