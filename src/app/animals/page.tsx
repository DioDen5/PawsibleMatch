import { AnimalCard, type Animal } from '@/components/animal-card';
import { AnimalFilters } from '@/components/animal-filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint } from 'lucide-react';

// Placeholder data - Replace with actual data fetching from Firestore
const placeholderAnimals: Animal[] = [
  {
    id: '1',
    name: 'Buddy',
    type: 'Dog',
    age: '2 years',
    health: 'Good',
    description: 'Friendly and energetic Golden Retriever looking for an active home.',
    shelterId: 'shelter1',
    location: 'New York, NY',
    images: ['https://picsum.photos/seed/buddy/300/200'],
    isAdopted: false,
    createdAt: new Date().toISOString(),
    shelterName: 'Happy Paws Shelter' // Added for display
  },
  {
    id: '2',
    name: 'Whiskers',
    type: 'Cat',
    age: '5 months',
    health: 'Vaccinated',
    description: 'A playful kitten, loves cuddles and chasing toy mice.',
    shelterId: 'shelter2',
    location: 'Los Angeles, CA',
    images: ['https://picsum.photos/seed/whiskers/300/200'],
    isAdopted: false,
    createdAt: new Date().toISOString(),
    shelterName: 'Kitty Corner Haven' // Added for display
  },
  {
    id: '3',
    name: 'Rocky',
    type: 'Dog',
    age: '4 years',
    health: 'Needs check-up',
    description: 'Shy at first, but warms up quickly. Loyal companion.',
    shelterId: 'shelter1',
    location: 'New York, NY',
    images: ['https://picsum.photos/seed/rocky/300/200'],
    isAdopted: false,
    createdAt: new Date().toISOString(),
    shelterName: 'Happy Paws Shelter' // Added for display
  },
   {
    id: '4',
    name: 'Luna',
    type: 'Cat',
    age: '1 year',
    health: 'Excellent',
    description: 'Calm and affectionate, loves quiet afternoons.',
    shelterId: 'shelter3',
    location: 'Chicago, IL',
    images: ['https://picsum.photos/seed/luna/300/200'],
    isAdopted: false,
    createdAt: new Date().toISOString(),
    shelterName: 'Safe Haven Animals' // Added for display
  },
   {
    id: '5',
    name: 'Max',
    type: 'Dog',
    age: '6 years',
    health: 'Good, minor allergies',
    description: 'Gentle giant, great with kids and other dogs.',
    shelterId: 'shelter2',
    location: 'Los Angeles, CA',
    images: ['https://picsum.photos/seed/max/300/200'],
    isAdopted: true, // Example of adopted animal
    createdAt: new Date().toISOString(),
    shelterName: 'Kitty Corner Haven' // Added for display
  },
];


export default function AnimalsPage() {
  // In a real app, fetch animals based on filters
  const animals = placeholderAnimals; // Use placeholder data for now

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PawPrint className="h-6 w-6 text-primary" /> Find Your Furry Friend
          </CardTitle>
        </CardHeader>
        <CardContent>
           {/* Filterable Search Feature */}
           <AnimalFilters />
        </CardContent>
      </Card>


      {/* Animal Listings Display Feature */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {animals.length > 0 ? (
           animals.map((animal) => (
             <AnimalCard key={animal.id} animal={animal} />
           ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No animals found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
