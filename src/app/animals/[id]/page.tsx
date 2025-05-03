import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PawPrint, Heart, Home, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Animal } from '@/components/animal-card'; // Import type
// import { useAuth } from '@/context/auth-context'; // Import useAuth if needed for conditional actions

// Placeholder data fetching function - Replace with actual Firestore fetch
async function getAnimalDetails(id: string): Promise<Animal | null> {
  console.log(`Fetching details for animal ID: ${id}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // Find animal in placeholder data
   const placeholderAnimals: Animal[] = [
    { id: '1', name: 'Buddy', type: 'Dog', age: '2 years', health: 'Good', description: 'Friendly and energetic Golden Retriever looking for an active home.', shelterId: 'shelter1', location: 'New York, NY', images: ['https://picsum.photos/seed/buddy/600/400', 'https://picsum.photos/seed/buddy2/300/200', 'https://picsum.photos/seed/buddy3/300/200'], isAdopted: false, createdAt: new Date().toISOString(), shelterName: 'Happy Paws Shelter' },
    { id: '2', name: 'Whiskers', type: 'Cat', age: '5 months', health: 'Vaccinated', description: 'A playful kitten, loves cuddles and chasing toy mice.', shelterId: 'shelter2', location: 'Los Angeles, CA', images: ['https://picsum.photos/seed/whiskers/600/400'], isAdopted: false, createdAt: new Date().toISOString(), shelterName: 'Kitty Corner Haven' },
    { id: '3', name: 'Rocky', type: 'Dog', age: '4 years', health: 'Needs check-up', description: 'Shy at first, but warms up quickly. Loyal companion.', shelterId: 'shelter1', location: 'New York, NY', images: ['https://picsum.photos/seed/rocky/600/400'], isAdopted: false, createdAt: new Date().toISOString(), shelterName: 'Happy Paws Shelter' },
    { id: '4', name: 'Luna', type: 'Cat', age: '1 year', health: 'Excellent', description: 'Calm and affectionate, loves quiet afternoons.', shelterId: 'shelter3', location: 'Chicago, IL', images: ['https://picsum.photos/seed/luna/600/400'], isAdopted: false, createdAt: new Date().toISOString(), shelterName: 'Safe Haven Animals' },
    { id: '5', name: 'Max', type: 'Dog', age: '6 years', health: 'Good, minor allergies', description: 'Gentle giant, great with kids and other dogs.', shelterId: 'shelter2', location: 'Los Angeles, CA', images: ['https://picsum.photos/seed/max/600/400'], isAdopted: true, createdAt: new Date().toISOString(), shelterName: 'Kitty Corner Haven' },
  ];

  const animal = placeholderAnimals.find(a => a.id === id);
  return animal || null;
}


export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  // const { isAuthenticated, isVerified } = useAuth(); // Get auth state if needed for conditional UI/actions
  const animal = await getAnimalDetails(params.id);


  if (!animal) {
    return <div className="text-center text-muted-foreground">Animal not found.</div>;
  }

  const getHealthBadgeVariant = (health: string): "default" | "secondary" | "outline" | "destructive" | null | undefined => {
    const lowerHealth = health.toLowerCase();
    if (lowerHealth.includes('good') || lowerHealth.includes('excellent') || lowerHealth.includes('vaccinated')) return 'default'; // Use primary color for positive status
    if (lowerHealth.includes('needs') || lowerHealth.includes('minor') || lowerHealth.includes('check-up')) return 'secondary'; // Use secondary for neutral/needs attention
     if (lowerHealth.includes('special') || lowerHealth.includes('urgent')) return 'destructive'; // Use destructive for serious issues
    return 'outline'; // Default outline for unknown/other statuses
  };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
             <CardTitle className="text-3xl font-bold flex items-center gap-2">
              {animal.name}
               {animal.type === 'Dog' && <PawPrint className="h-6 w-6 text-primary inline-block" />}
               {animal.type === 'Cat' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cat h-6 w-6 text-primary inline-block"><path d="M12 5c.67 0 1.35.09 2 .26 1.78.46 2.81 1.15 3.42 2.06 1.05 1.58 1.58 3.24 1.58 5.68 0 2.08-.5 3.7-1.09 4.61-.59.91-1.41 1.48-2.91 1.48h-.3M3 14.87C4.16 16.34 6.14 17 9 17c1.99 0 3.71-.45 5-1.24"/><path d="M17.7 10.3c-.6-.6-1-1.3-1.2-2.3"/><path d="M6.3 10.3c.6-.6 1-1.3 1.2-2.3"/><path d="M12 17.5v.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z"/><path d="M17 13.8c.77 1.43 1 2.8 1 4.2 0 .61-.09 1.21-.26 1.78"/><path d="M7 13.8c-.77 1.43-1 2.8-1 4.2 0 .61.09 1.21.26 1.78"/></svg>}
               {/* Add more icons for other animal types */}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{animal.type} - {animal.location}</CardDescription>
          </div>
           {animal.isAdopted ? (
             <Badge variant="destructive" className="text-sm px-3 py-1">Already Adopted</Badge>
           ) : (
             <Badge variant="default" className="text-sm px-3 py-1 bg-primary text-primary-foreground">Available for Adoption</Badge>
           )}
        </div>

      </CardHeader>
      <CardContent className="space-y-6">
         {animal.images && animal.images.length > 0 && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {animal.images.map((img, index) => (
                 // Ensure image has a key when mapping
                <div key={index} className={`${index === 0 ? 'sm:col-span-2 md:col-span-3 h-64 sm:h-96' : 'h-48'}`}>
                     <Image
                        src={img}
                        alt={`${animal.name} - Image ${index + 1}`}
                        width={index === 0 ? 800 : 300} // Adjust width based on layout needs
                        height={index === 0 ? 400 : 200} // Adjust height
                        className={`rounded-lg object-cover w-full h-full`}
                        data-ai-hint={`${animal.type} ${animal.name}`}
                        priority={index === 0} // Prioritize loading the main image
                    />
                </div>

            ))}
           </div>
         )}

        <p className="text-foreground leading-relaxed">{animal.description}</p>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
           <div><strong className="text-foreground">Age:</strong> {animal.age}</div>
           <div className="flex items-center gap-1"><strong className="text-foreground">Health:</strong> <Badge variant={getHealthBadgeVariant(animal.health)}>{animal.health}</Badge></div>
           <div><strong className="text-foreground">Shelter:</strong> {animal.shelterName || 'N/A'}</div>
           <div><strong className="text-foreground">Location:</strong> {animal.location}</div>
           <div><strong className="text-foreground">Shelter ID:</strong> {animal.shelterId}</div>
           <div><strong className="text-foreground">Posted:</strong> {new Date(animal.createdAt).toLocaleDateString()}</div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
         {/* Placeholder Shelter Contact Info - Maybe hide behind login? */}
         <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Home className="h-4 w-4"/> {animal.shelterName || 'Contact Shelter for Details'}
         </div>
         <div className="flex gap-2">
              {/* Add to Favorites - Requires login */}
             <Button variant="outline" disabled={animal.isAdopted /* || !isAuthenticated */}>
                 <Heart className="mr-2 h-4 w-4" /> Add to Favorites
             </Button>
              {/* Contact Shelter - Might require login or show public info */}
             <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={animal.isAdopted}>
                 <Phone className="mr-2 h-4 w-4" /> Contact Shelter
             </Button>
         </div>

      </CardFooter>
    </Card>
  );
}
