"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


// Define Zod schema for form validation
const formSchema = z.object({
  animalType: z.string().min(1, { message: "Please select an animal type." }),
  description: z.string().min(10, { message: "Please provide a brief description (min 10 characters)." }).max(500, { message: "Description cannot exceed 500 characters." }),
  location: z.string().min(3, { message: "Please provide the location where the animal was found." }),
  photo: z.instanceof(File).optional(), // Making photo optional for now or handle validation differently
  // In a real app, you'd likely require the photo and use a specific Zod schema for files if needed.
  // For now, we'll handle basic presence check or skip strict file validation client-side.
});

export default function SubmitFoundAnimalPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalType: "",
      description: "",
      location: "",
      photo: undefined,
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual submission logic:
    // 1. Upload photo to Firebase Storage (if provided)
    // 2. Get the download URL.
    // 3. Create a 'transferRequests' document in Firestore with status 'pending'.
    //    - Include fromUserId (get current logged-in user ID)
    //    - Include toShelterId (need a way to select or assign a default shelter)
    //    - Include animalType, description, location, photo URL, createdAt.

    console.log("Form Submitted:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Submission Received!",
      description: "Thank you for helping this animal. A local shelter will be notified.",
      variant: "default", // Use 'default' which aligns with primary color (light green)
    });
    form.reset(); // Reset form after successful submission
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlusCircle className="h-6 w-6 text-primary" /> Submit a Found Animal
        </CardTitle>
        <CardDescription>
          Found a stray animal? Fill out this form to notify nearby shelters. Your help can make a huge difference!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             {/* Animal Type */}
            <FormField
              control={form.control}
              name="animalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Animal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of animal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the animal (e.g., color, size, condition, behavior)"
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                     Please provide as much detail as possible.
                   </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Found</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, City, State, or intersection" {...field} />
                  </FormControl>
                   <FormDescription>
                      Where did you find the animal? Be specific if possible.
                   </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload Placeholder */}
             <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Photo (Optional)</FormLabel>
                  <FormControl>
                    {/* Basic file input - Replace with a nicer component if needed */}
                     <div className="flex items-center gap-2 p-3 border border-dashed rounded-md">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <Input
                          type="file"
                          accept="image/*"
                          className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          // Note: We don't directly bind value for file inputs
                        />
                     </div>

                  </FormControl>
                   <FormDescription>
                     A clear photo helps shelters identify the animal.
                   </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Submitting..." : "Submit Animal Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
