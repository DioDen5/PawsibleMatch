"use client";

import Link from 'next/link';
import { PawPrint, PlusCircle, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context'; // Import useAuth hook
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, userProfile, signOut, loading, isVerified, role } = useAuth(); // Use the hook

  const getDashboardLink = () => {
    if (role === 'volunteer') return '/dashboard/volunteer';
    if (role === 'shelter') return '/dashboard/shelter';
    return '/dashboard'; // Fallback or default dashboard
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">PawsibleMatch</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
           <Button variant="ghost" asChild size="sm">
             <Link href="/animals">
               <PawPrint className="mr-1 h-4 w-4 sm:mr-2" />
               <span className="hidden sm:inline">Animals</span>
               <span className="sm:hidden">Pets</span>
             </Link>
           </Button>
           {user && isVerified && ( // Only show Submit Found if logged in and verified
             <Button variant="ghost" asChild size="sm">
               <Link href="/submit-found">
                 <PlusCircle className="mr-1 h-4 w-4 sm:mr-2" />
                 <span className="hidden sm:inline">Submit Found</span>
                 <span className="sm:hidden">Submit</span>
               </Link>
             </Button>
           )}
           <Separator orientation="vertical" className="h-6" />

           {loading ? (
             <Button variant="outline" size="icon" disabled>
               <User className="h-4 w-4 animate-pulse" />
             </Button>
           ) : user ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={user.photoURL || userProfile?.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                     <AvatarFallback>{getInitials(user.displayName || userProfile?.displayName)}</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">{user.displayName || userProfile?.displayName || 'User'}</p>
                     <p className="text-xs leading-none text-muted-foreground">
                       {user.email}
                     </p>
                     {role && <p className="text-xs leading-none text-muted-foreground capitalize pt-1">Role: {role}</p>}
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild disabled={!isVerified || !role}>
                   <Link href={getDashboardLink()}>
                     Dashboard
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                     Profile (Coming Soon)
                 </DropdownMenuItem>
                  {!isVerified && (
                     <DropdownMenuItem asChild>
                         <Link href="/auth/verify-email">Verify Email</Link>
                     </DropdownMenuItem>
                  )}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={signOut}>
                   <LogOut className="mr-2 h-4 w-4" />
                   Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ) : (
             <Button asChild size="sm">
               <Link href="/auth/login">
                 <LogIn className="mr-1 h-4 w-4 sm:mr-2" /> Login/Sign Up
               </Link>
             </Button>
           )}
        </nav>
      </div>
    </header>
  );
}
