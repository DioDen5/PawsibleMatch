"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, MailWarning, Send, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { user, isVerified, loading, reloadUser, signOut, role } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  const RESEND_COOLDOWN_SECONDS = 60; // Cooldown period in seconds


  // Redirect logic based on user state
   useEffect(() => {
    if (!loading) {
        if (!user) {
            // Not logged in, redirect to login
            router.replace('/auth/login');
        } else if (isVerified && role) {
            // Logged in and verified, redirect to appropriate dashboard
            toast({ title: "Email Already Verified", description: "Redirecting to your dashboard..." });
            if (role === 'volunteer') router.replace('/dashboard/volunteer');
            else if (role === 'shelter') router.replace('/dashboard/shelter');
            else router.replace('/dashboard'); // Fallback
        }
         // Stay on this page if user exists but is not verified or role is missing (shouldn't happen ideally)
    }
  }, [user, isVerified, loading, router, toast, role]);


  // Countdown timer effect
   useEffect(() => {
        if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
        }
    }, [countdown]);

  const handleResendVerification = useCallback(async () => {
    if (!user || isSending || countdown > 0) return;

    setIsSending(true);
    try {
      await sendEmailVerification(user);
      setLastSentTime(Date.now());
      setCountdown(RESEND_COOLDOWN_SECONDS);
      toast({
        title: 'Verification Email Sent',
        description: `A new verification link has been sent to ${user.email}.`,
      });
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      let description = 'Failed to resend verification email. Please try again later.';
      if (error.code === 'auth/too-many-requests') {
           description = 'Too many requests. Please wait before trying again.';
           // Ensure cooldown is active even if Firebase throws error early
           if (!lastSentTime || Date.now() - lastSentTime > RESEND_COOLDOWN_SECONDS * 1000) {
                setLastSentTime(Date.now());
                setCountdown(RESEND_COOLDOWN_SECONDS);
           }
      }
      toast({
        title: 'Error',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  }, [user, isSending, toast, countdown, lastSentTime]);


  const handleCheckVerification = useCallback(async () => {
    if (!user || isChecking) return;

    setIsChecking(true);
    try {
        await reloadUser(); // This reloads the user and triggers the useEffect for redirection if verified
        // Check the verification status directly after reload
         const currentUser = auth.currentUser; // Get the possibly updated user from auth instance
         if (currentUser?.emailVerified) {
            toast({
                title: "Verification Confirmed!",
                description: "Redirecting to your dashboard...",
            });
             // Explicitly check role again after confirmation
            const profile = await getUserProfile(currentUser.uid);
            if (profile?.role === 'volunteer') router.replace('/dashboard/volunteer');
            else if (profile?.role === 'shelter') router.replace('/dashboard/shelter');
            else router.replace('/dashboard'); // Fallback
         } else {
            toast({
                title: "Still Pending",
                description: "Your email is not verified yet. Please check your inbox (and spam folder).",
                variant: "default", // Use default variant for informational message
            });
         }

    } catch (error) {
        console.error("Error checking verification status:", error);
        toast({
            title: "Check Failed",
            description: "Could not check verification status. Please try again.",
            variant: "destructive",
        });
    } finally {
      setIsChecking(false);
    }
  }, [user, reloadUser, router, toast, isChecking]);


   // Initial loading state
    if (loading || (!user && !loading)) { // Show loader if loading or if redirecting
        return (
             <div className="flex justify-center items-center min-h-[60vh]">
                <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
             </div>
        );
    }


   // Render verification prompt
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-lg shadow-lg text-center">
        <CardHeader>
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <MailWarning className="h-12 w-12 text-primary" />
           </div>
          <CardTitle className="text-2xl mt-4">Verify Your Email Address</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{user?.email || 'your email'}</strong>. Please check your inbox (and spam folder) and click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
             Once verified, you can access all features of PawsibleMatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleCheckVerification} disabled={isChecking} variant="outline">
              <RefreshCcw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'I Have Verified My Email'}
            </Button>
            <Button
              onClick={handleResendVerification}
              disabled={isSending || countdown > 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : (countdown > 0 ? `Resend (${countdown}s)` : 'Resend Verification Email')}
            </Button>
          </div>
           <p className="text-xs text-muted-foreground pt-4">
                Wrong email or need to log out?{' '}
                <Button variant="link" size="sm" className="p-0 h-auto" onClick={signOut}>Log Out</Button>
                {' or '}
                 <Link href="/auth/signup" className="underline">Sign up again</Link>.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}


// Helper functions (consider moving to a lib if used elsewhere)
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/user-service";
