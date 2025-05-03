import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4">
             <PawPrint className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">Welcome to PawsibleMatch!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Connecting compassionate hearts with animals in need. Find your perfect companion or help a stray find safety.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Image
            src="https://picsum.photos/800/300"
            alt="Happy rescued animals"
            width={800}
            height={300}
            className="rounded-lg object-cover w-full"
            data-ai-hint="group happy pets"
          />
          <p className="text-foreground">
            Whether you're looking to adopt a new furry family member, volunteer your time, or report a found animal, PawsibleMatch is here to facilitate the connection between shelters, volunteers, and adopters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/animals">
                <PawPrint className="mr-2 h-5 w-5" /> View Animals
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/submit-found">
                 <PlusCircle className="mr-2 h-5 w-5" /> Submit Found Animal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
