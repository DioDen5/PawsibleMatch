import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex justify-center mb-4">
             <FileText className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground leading-relaxed">
           <p className="text-sm text-muted-foreground text-center">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold pt-4">1. Agreement to Terms</h2>
          <p>
             By accessing or using the PawsibleMatch platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-xl font-semibold pt-4">2. Use of the Service</h2>
          <p>
             You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content or disrupting the normal flow of dialogue within the Service.
          </p>
          <p>
             You must provide accurate information during registration and keep your account information updated. You are responsible for maintaining the confidentiality of your account password.
          </p>

          <h2 className="text-xl font-semibold pt-4">3. User Content</h2>
           <p>
             You are responsible for any content you post, including animal listings, submission details, and messages ("User Content"). You grant PawsibleMatch a license to use, display, and distribute your User Content in connection with operating and providing the Service.
           </p>
           <p>
             You represent and warrant that you have all necessary rights to post the User Content and that your User Content does not violate any third-party rights or applicable laws. PawsibleMatch reserves the right to remove any User Content deemed inappropriate or violating these Terms.
           </p>

           <h2 className="text-xl font-semibold pt-4">4. Disclaimers</h2>
           <p>
             PawsibleMatch acts as a platform to connect users. We do not directly oversee adoptions, animal transfers, or shelter operations. We are not responsible for the accuracy of information provided by users or shelters, nor for the health or behavior of any animal listed. Users interact with each other and with shelters at their own risk.
           </p>

           <h2 className="text-xl font-semibold pt-4">5. Limitation of Liability</h2>
           <p>
             In no event shall PawsibleMatch, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
           </p>

           {/* Add more sections: Termination, Governing Law, Changes to Terms, Contact */}

           <p className="pt-6 text-muted-foreground">
             These are simplified placeholder terms. It is crucial to consult with a legal professional to draft comprehensive Terms of Service that cover all legal aspects of your platform's operation.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
