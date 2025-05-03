import Link from 'next/link';
import { PawPrint, PlusCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">PawsibleMatch</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-4">
           <Button variant="ghost" asChild>
             <Link href="/animals">
               <PawPrint className="mr-2 h-4 w-4" /> Animals
             </Link>
           </Button>
           <Button variant="ghost" asChild>
             <Link href="/submit-found">
                <PlusCircle className="mr-2 h-4 w-4" /> Submit Found
             </Link>
           </Button>
           <Separator orientation="vertical" className="h-6" />
           {/* Placeholder for Authentication Button */}
           <Button variant="outline" size="icon">
             <User className="h-4 w-4" />
             <span className="sr-only">User Profile / Login</span>
           </Button>
        </nav>
      </div>
    </header>
  );
}
