"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailQuestion, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

// Define Zod schema for forgot password form validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle password reset email sending
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.email}, you will receive an email with instructions to reset your password.`,
      });
      // Optionally redirect to login or a confirmation page
       router.push('/auth/login');
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      // Avoid confirming if email exists for security reasons
      toast({
        title: "Request Submitted",
        description: "If your email is registered, a password reset link will be sent.",
        // Potentially show a generic error for specific codes if needed, but often better not to.
        // variant: "destructive", // Only use destructive for clear failures preventing submission
      });
       // Still might redirect or clear form even on "error" if it's just user-not-found
       // form.reset(); // Keep email field populated maybe?
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MailQuestion className="h-6 w-6 text-primary" /> Forgot Your Password?
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address below and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The email associated with your PawsibleMatch account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log in here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
