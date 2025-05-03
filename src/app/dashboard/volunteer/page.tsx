// src/app/dashboard/volunteer/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PawPrint, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context"; // Assuming useAuth provides user info
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VolunteerDashboardPage() {
  const { userProfile } = useAuth(); // Get user profile if needed

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
           <div className="flex items-center gap-4 mb-2">
                <Users className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Volunteer Dashboard</CardTitle>
                  <CardDescription>Welcome, {userProfile?.displayName || 'Volunteer'}!</CardDescription>
                </div>
           </div>

        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground">
            Thank you for your dedication to helping animals! Here you can manage your activities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Placeholder Cards for Volunteer Actions */}
             <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><PlusCircle className="h-5 w-5 text-accent"/> Submit Found Animal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Report an animal you've found to connect it with a local shelter.</p>
                     <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/submit-found">Go to Submission Form</Link>
                    </Button>
                </CardContent>
             </Card>
             <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><PawPrint className="h-5 w-5 text-accent"/> View Animals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Browse animals currently looking for homes or needing assistance.</p>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/animals">See Available Animals</Link>
                    </Button>
                </CardContent>
             </Card>
             {/* Add more relevant sections/cards for volunteers */}
          </div>
        </CardContent>
      </Card>
       {/* Add more dashboard components here */}
    </div>
  );
}
