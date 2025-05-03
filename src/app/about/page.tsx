import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Heart, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <PawPrint className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">About PawsibleMatch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground leading-relaxed">
          <Image
            src="https://picsum.photos/id/237/800/300" // Different image, maybe one dog
            alt="A hopeful dog looking"
            width={800}
            height={300}
            className="rounded-lg object-cover w-full mb-6"
            data-ai-hint="single hopeful dog shelter"
          />
          <p>
            <strong>PawsibleMatch</strong> was born from a simple idea: to create a bridge between animals in need and the compassionate individuals ready to offer them a loving home or a helping hand. We believe every stray animal deserves a chance at a happy, safe life.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2"><Heart className="h-5 w-5 text-accent"/> Our Mission</h3>
              <p>
                Our mission is to reduce the number of stray animals by providing a centralized platform that connects animal shelters, veterinary clinics, volunteers, and potential adopters. We aim to streamline the process of finding, reporting, and adopting animals, making it easier for everyone to get involved.
              </p>
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-accent"/> How We Help</h3>
               <p>
                 PawsibleMatch allows shelters to showcase animals available for adoption, volunteers to report found animals directly to shelters, and users to search for pets, find volunteer opportunities, or donate to support animal welfare. We strive to build a strong community dedicated to animal rescue and well-being.
               </p>
            </div>
          </div>
           <p className="text-center pt-4 text-muted-foreground">
             Join us in making a difference, one paw at a time.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
