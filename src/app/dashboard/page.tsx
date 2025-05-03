// src/app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";

// This page should ideally not be reached directly if middleware is working correctly.
// It serves as a fallback or loading state.
export default function DashboardPage() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Loading Dashboard...</CardTitle>
            </CardHeader>
            <CardContent>
                 <RefreshCcw className="h-8 w-8 animate-spin text-primary mx-auto" />
                 <p className="text-muted-foreground mt-4">Redirecting based on your role...</p>
            </CardContent>
        </Card>
    </div>
  );
}
