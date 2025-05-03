import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PawPrint, MapPin, ShieldCheck, HelpCircle } from 'lucide-react'; // Using ShieldCheck for health

// Define the Animal type based on Firestore structure
export interface Animal {
  id: string;
  name: string;
  type: string; // e.g., 'Dog', 'Cat'
  age: string; // e.g., '2 years', '5 months'
  health: string; // e.g., 'Good', 'Vaccinated', 'Needs check-up'
  description: string;
  shelterId: string;
  location: string;
  images: string[]; // Array of image URLs
  isAdopted: boolean;
  createdAt: string; // ISO Date string
  shelterName?: string; // Optional: Add shelter name for easier display
}

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {

  const getHealthIcon = (health: string) => {
    if (health.toLowerCase().includes('good') || health.toLowerCase().includes('vaccinated') || health.toLowerCase().includes('excellent')) {
       return <ShieldCheck className="h-4 w-4 text-green-600" />;
    }
     if (health.toLowerCase().includes('needs') || health.toLowerCase().includes('minor')) {
         return <HelpCircle className="h-4 w-4 text-orange-500" />;
     }
    return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }

  return (
    <Link href={`/animals/${animal.id}`} className="group block">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary/50 h-full flex flex-col">
        <CardHeader className="p-0 relative">
            <Image
            src={animal.images[0] || 'https://picsum.photos/300/200?grayscale'} // Fallback image
            alt={animal.name}
            width={300}
            height={200}
            className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={`${animal.type} animal`}
            />
             {animal.isAdopted && (
               <Badge variant="destructive" className="absolute top-2 right-2">Adopted</Badge>
             )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="text-xl font-semibold mb-1 flex items-center gap-1">
                {animal.name}
                 {animal.type === 'Dog' && <PawPrint className="h-5 w-5 text-primary inline-block" />}
                 {animal.type === 'Cat' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cat h-5 w-5 text-primary inline-block"><path d="M12 5c.67 0 1.35.09 2 .26 1.78.46 2.81 1.15 3.42 2.06 1.05 1.58 1.58 3.24 1.58 5.68 0 2.08-.5 3.7-1.09 4.61-.59.91-1.41 1.48-2.91 1.48h-.3M3 14.87C4.16 16.34 6.14 17 9 17c1.99 0 3.71-.45 5-1.24"/><path d="M17.7 10.3c-.6-.6-1-1.3-1.2-2.3"/><path d="M6.3 10.3c.6-.6 1-1.3 1.2-2.3"/><path d="M12 17.5v.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z"/><path d="M17 13.8c.77 1.43 1 2.8 1 4.2 0 .61-.09 1.21-.26 1.78"/><path d="M7 13.8c-.77 1.43-1 2.8-1 4.2 0 .61.09 1.21.26 1.78"/></svg>}
                 {/* Add icons for other types */}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">
                 {animal.description}
             </CardDescription>
             <div className="flex items-center text-xs text-muted-foreground gap-2 mb-1">
                 <MapPin className="h-3 w-3" /> {animal.location}
             </div>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                 {getHealthIcon(animal.health)} {animal.health} | {animal.age}
             </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
             <Badge variant={animal.isAdopted ? "secondary" : "outline"} className="w-full justify-center">
               {animal.isAdopted ? "Happily Adopted" : "View Details"}
             </Badge>
        </CardFooter>
        </Card>
    </Link>
  );
}
