"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, Key, Users, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile } from "@/lib/user-service";
import type { UserRole } from "@/types/user";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import SelectRoleDialog from "@/components/auth/select-role-dialog"; // Reuse the role dialog

// Define Zod schema for signup form validation
const formSchema = z.object({
  role: z.enum(["volunteer", "shelter"], { required_error: "Please select a role." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error path
});

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
   const [showRoleDialog, setShowRoleDialog] = useState(false);
   const [pendingUser, setPendingUser] = useState<import("firebase/auth").User | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: undefined, // Start with no role selected
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Email/Password Signup Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        // 1. Create Firestore user profile
        await createUserProfile(user, values.role as UserRole, false); // Initially not verified

        // 2. Send verification email
        await sendEmailVerification(user);

        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account before logging in.",
        });

        // 3. Redirect to verification prompt page
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      let errorMessage = "An error occurred during sign up. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak.";
      }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Google Sign-Up Handler (Similar to Login)
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Check if user profile already exists
        let profile = await getUserProfile(user.uid);

        if (!profile) {
          // First-time Google Sign-in, needs role selection
          console.log("First time Google sign-up, prompting for role selection.");
          setPendingUser(user);
          setShowRoleDialog(true);
          // Don't redirect yet
        } else {
          // User already exists (maybe logged in before or signed up differently)
           toast({
                title: "Welcome Back!",
                description: "You already have an account. Logging you in.",
           });
           // Google sign-in implies verification
           if (profile.role === 'volunteer') router.push('/dashboard/volunteer');
           else if (profile.role === 'shelter') router.push('/dashboard/shelter');
           else router.push('/dashboard'); // Fallback
        }
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      toast({
        title: "Google Sign-Up Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

   const handleRoleSelected = async (selectedRole: UserRole) => {
        if (!pendingUser) return;

        setIsLoading(true);
        setShowRoleDialog(false);

        try {
            // Google users are considered verified
            await createUserProfile(pendingUser, selectedRole, true);

            toast({
                title: "Account Setup Complete!",
                description: `Welcome ${pendingUser.displayName || 'User'}! Your role is set to ${selectedRole}.`,
            });

             // Redirect after successful profile creation with role
            if (selectedRole === 'volunteer') {
                router.push('/dashboard/volunteer');
            } else if (selectedRole === 'shelter') {
                router.push('/dashboard/shelter');
            } else {
                router.push('/dashboard'); // Fallback
            }

        } catch (error) {
             console.error("Error creating profile after role selection:", error);
             toast({
                title: "Setup Error",
                description: "Could not save your role. Please try logging in again.",
                variant: "destructive",
             });
        } finally {
            setIsLoading(false);
            setPendingUser(null);
        }
    };

  return (
    <>
        <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-primary" /> Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
            Join PawsibleMatch as a volunteer or a shelter.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Selection */}
                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-base">I am a...</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0 flex-1 border p-4 rounded-md hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-colors">
                            <FormControl>
                            <RadioGroupItem value="volunteer" />
                            </FormControl>
                             <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                <Users className="h-5 w-5 text-accent"/> Volunteer
                             </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 flex-1 border p-4 rounded-md hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-colors">
                            <FormControl>
                            <RadioGroupItem value="shelter" />
                            </FormControl>
                             <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                <Home className="h-5 w-5 text-accent"/> Shelter / Rescue
                             </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Email */}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4"/> Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Password */}
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1"><Key className="h-4 w-4"/> Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="•••••••• (min 6 chars)" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Confirm Password */}
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-1"><Key className="h-4 w-4"/> Confirm Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || isGoogleLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
            </form>
            </Form>

            <Separator className="my-6" />

            <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading || isGoogleLoading}>
                    {isGoogleLoading ? (
                         <span className="animate-pulse">Connecting...</span>
                    ) : (
                        <>
                             <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.83 3.18-5.18 3.18-4.51 0-8.15-3.52-8.15-8.15 0-4.63 3.64-8.15 8.15-8.15 2.53 0 4.14.99 5.18 2.05l2.75-2.75C19.51 1.47 16.69.26 12.48.26 5.83.26 0 5.83 0 12.48s5.83 12.22 12.48 12.22c6.94 0 11.38-4.93 11.38-11.7 0-.75-.06-1.43-.18-2.1H12.48z"></path></svg>
                            Sign up with Google
                        </>
                    )}
                </Button>

                 <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-medium text-primary hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>

        </CardContent>
        </Card>

        <SelectRoleDialog
            isOpen={showRoleDialog}
            onClose={() => {
                setShowRoleDialog(false);
                setPendingUser(null);
                setIsLoading(false);
                setIsGoogleLoading(false);
            }}
            onRoleSelect={handleRoleSelected}
            isLoading={isLoading || isGoogleLoading} // Pass combined loading state
        />
    </>

  );
}
