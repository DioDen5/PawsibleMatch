"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Users, Home } from "lucide-react";
import type { UserRole } from "@/types/user";

interface SelectRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: UserRole) => void;
  isLoading?: boolean;
}

export default function SelectRoleDialog({
  isOpen,
  onClose,
  onRoleSelect,
  isLoading = false,
}: SelectRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);

  const handleSelect = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Choose whether you are signing up as a volunteer or representing a shelter/rescue organization.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <RadioGroup
                value={selectedRole}
                onValueChange={(value: UserRole) => setSelectedRole(value)}
                className="flex flex-col gap-4"
            >
                <Label className="flex items-center space-x-3 space-y-0 border p-4 rounded-md hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-colors cursor-pointer">
                    <RadioGroupItem value="volunteer" id="role-volunteer" />
                    <span className="font-normal flex items-center gap-2">
                        <Users className="h-5 w-5 text-accent"/> Volunteer
                    </span>
                </Label>
                <Label className="flex items-center space-x-3 space-y-0 border p-4 rounded-md hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-colors cursor-pointer">
                    <RadioGroupItem value="shelter" id="role-shelter" />
                     <span className="font-normal flex items-center gap-2">
                        <Home className="h-5 w-5 text-accent"/> Shelter / Rescue
                     </span>
                </Label>
            </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSelect} disabled={!selectedRole || isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? "Saving..." : "Confirm Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
