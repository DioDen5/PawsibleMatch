// src/app/dashboard/shelter/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, PawPrint, ListChecks, PlusSquare } from "lucide-react";
import { useAuth } from "@/context/auth-context"; // Assuming useAuth provides user info
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function ShelterDashboardPage() {
  const { userProfile } = useAuth(); // Get user profile if needed

  return (
     <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center gap-4 mb-2">
                <Home className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="text-2xl">Shelter Dashboard</CardTitle>
                    <CardDescription>Welcome, {userProfile?.displayName || 'Shelter Admin'}!</CardDescription>
                </div>
            </div>

        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground">
            Manage your shelter's listings, review submissions, and connect with volunteers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Placeholder Cards for Shelter Actions */}
             <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><PawPrint className="h-5 w-5 text-accent"/> Manage Animal Listings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Add new animals, update existing profiles, or mark animals as adopted.</p>
                     <Button size="sm" variant="outline">View/Edit Listings</Button>
                </CardContent>
             </Card>
             <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><ListChecks className="h-5 w-5 text-accent"/> Review Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Review found animal submissions from volunteers in your area.</p>
                     <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">Check Submissions</Button>
                </CardContent>
             </Card>
             <Card className="bg-secondary/30">
                <CardHeader>
                     <CardTitle className="text-lg flex items-center gap-2"><PlusSquare className="h-5 w-5 text-accent"/> Add New Listing</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Quickly add a new animal available for adoption.</p>
                     <Button size="sm" variant="outline">Add Animal</Button>
                </CardContent>
             </Card>
             {/* Add more relevant sections/cards for shelters */}
          </div>
        </CardContent>
      </Card>
       {/* Add more dashboard components here */}
    </div>
  );
}
