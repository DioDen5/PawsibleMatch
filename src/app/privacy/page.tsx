import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex justify-center mb-4">
             <Shield className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground leading-relaxed">
          <p className="text-sm text-muted-foreground text-center">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold pt-4">1. Introduction</h2>
          <p>
            Welcome to PawsibleMatch. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>

          <h2 className="text-xl font-semibold pt-4">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, when participating in activities on the platform or otherwise contacting us.
          </p>
          <p>
            The personal information we collect may include the following: Name, Email Address, Contact Information, User Role (Volunteer/Shelter), Location Data (for searches and submissions), and any other information you choose to provide.
          </p>


          <h2 className="text-xl font-semibold pt-4">3. How We Use Your Information</h2>
          <p>
             We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
           <ul className="list-disc pl-6 space-y-1">
             <li>To facilitate account creation and logon process.</li>
             <li>To manage user accounts.</li>
             <li>To enable user-to-user communications (e.g., volunteer to shelter).</li>
             <li>To send administrative information to you.</li>
             <li>To protect our Services.</li>
             <li>To respond to legal requests and prevent harm.</li>
           </ul>

          <h2 className="text-xl font-semibold pt-4">4. Will Your Information Be Shared?</h2>
           <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          {/* Add more sections as needed: Cookies, Data Retention, User Rights, Policy Updates, Contact Info */}

           <p className="pt-6 text-muted-foreground">
             This is a simplified placeholder policy. Please consult with a legal professional to create a comprehensive privacy policy tailored to your specific operations and legal requirements.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
