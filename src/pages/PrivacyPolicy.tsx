import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Privacy Policy</h1>
      </div>

      <div className="px-4 py-3 pb-8">
        <div className="prose prose-sm max-w-none text-foreground">
          <h1 className="text-xl font-bold text-foreground mb-4">Privacy Policy for Secret Share Bot</h1>
          
          <p className="text-sm text-muted-foreground mb-6">Last Updated: August 2, 2025</p>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy describes how we collect, use, and handle your information when you use our Service. Your privacy is of the utmost importance to us.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li><strong>Automatically Collected Information:</strong> Your Telegram User ID, which we use to identify your account.</li>
              <li><strong>User-Provided Information:</strong> Any name you provide to the bot during conversation, and your phone number if you choose to use the voice call feature.</li>
              <li><strong>Conversation Data:</strong> Transcripts of your conversations with our AI agents are temporarily processed to provide context and are retained for a maximum of 7 days for quality assurance and debugging, after which they are permanently deleted.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>To provide and maintain our Service.</li>
              <li>To personalize your experience by allowing our AI to remember your name and recent conversation history.</li>
              <li>To process transactions for the purchase of "Gems" and subscriptions.</li>
              <li>To initiate voice calls that you have purchased, using your provided phone number.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">4. How We Share Your Information (Third-Party Services)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              We do not sell your personal information. To provide our Service, we must share certain data with trusted third-party service providers (with data clean up every 7 days):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>Our database provider, which securely stores your user profile, Gem balance, and other necessary data.</li>
              <li>Our voice and AI agent provider. Text from your conversations is sent to generate voice responses and power conversational calls.</li>
              <li>Our telephony provider. Your phone number is shared to place the voice calls you purchase.</li>
              <li>Telegram Stars (or other selected payment provider): To securely process payments for Gem purchases. We do not see or store your credit card information.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement reasonable security measures to protect your information. However, no electronic transmission or storage is 100% secure, and we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Policy on Children</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our Service is not directed to anyone under the age of 18. We do not knowingly collect personally identifiable information from children. If we become aware that we have collected such data, we will take steps to remove it immediately.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@secret-share.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;