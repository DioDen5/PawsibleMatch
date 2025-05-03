"use client"; // Mark as client component because it uses state/interactive elements

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";
import * as React from 'react';

export function AnimalFilters() {
  // Add state management here (e.g., useState) to handle filter values
  // and a function to apply filters (e.g., update URL query params or trigger data refetch)

   const handleReset = () => {
    // Logic to reset all filters to default values
    console.log("Resetting filters");
   };

   const handleApply = () => {
    // Logic to apply current filter values
    console.log("Applying filters");
   };

  return (
    <div className="p-4 border rounded-lg bg-secondary/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            {/* Animal Type Filter */}
            <div className="space-y-1">
                <Label htmlFor="animal-type">Type</Label>
                <Select>
                    <SelectTrigger id="animal-type">
                        <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Age Filter */}
            <div className="space-y-1">
                <Label htmlFor="animal-age">Age</Label>
                <Select>
                    <SelectTrigger id="animal-age">
                        <SelectValue placeholder="Any Age" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Age</SelectItem>
                        <SelectItem value="puppy_kitten">Puppy / Kitten (&lt; 1 year)</SelectItem>
                        <SelectItem value="young">Young (1-3 years)</SelectItem>
                        <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                        <SelectItem value="senior">Senior (7+ years)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Health Filter */}
            <div className="space-y-1">
                <Label htmlFor="animal-health">Health</Label>
                 <Select>
                    <SelectTrigger id="animal-health">
                        <SelectValue placeholder="Any Health Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Health Status</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="vaccinated">Vaccinated</SelectItem>
                        <SelectItem value="needs_checkup">Needs Check-up</SelectItem>
                         <SelectItem value="special_needs">Special Needs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

             {/* Location Filter */}
            <div className="space-y-1">
                <Label htmlFor="animal-location">Location</Label>
                <Input id="animal-location" placeholder="City, State or Zip Code" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-end">
                <Button onClick={handleApply} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                     <Filter className="mr-2 h-4 w-4" /> Apply
                 </Button>
                 <Button onClick={handleReset} variant="outline" size="icon" aria-label="Reset Filters">
                     <RotateCcw className="h-4 w-4" />
                 </Button>
            </div>
        </div>
    </div>
  );
}
