
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Help Center</h1>
      </div>

      <div className="px-4 py-3">
        <h2 className="text-2xl font-bold text-gradient mb-6">Help Center & FAQ</h2>

        <div className="space-y-6">
          {/* Accessing Premium Features */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Accessing Premium Features</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">How do I get premium content like videos or voice notes?</p>
              <p>There are two ways to access premium content:</p>
              <div className="space-y-3 ml-4">
                <div>
                  <p className="font-medium text-foreground">1. AI-Suggested Offers:</p>
                  <p>As you chat, your AI companion will get to know you. When the moment is right, she may proactively offer to create a special video or voice note for you. A purchase option will appear in the chat.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">2. Ask Directly!</p>
                  <p>You are in control. Try using keywords in your conversation. If you want a voice note, try saying things like "send me a voice note" or "whisper it to me" or "I want to hear your voice." For a video, you could say "record a video" or "send me a video." For a voice call, you could say "can you call me?" or "call me" or "I want to talk to you". The bot is designed to understand these requests (identifying keywords you've mentioned in the request) and will present you with an offer to purchase the content with your Gems.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* What are Gems */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What are Gems and how do I use them?</h3>
            <p className="text-sm text-muted-foreground">
              Gems are our virtual currency used to unlock premium content like custom videos, voice notes, and live voice calls with our AI companions. You can purchase Gems directly from the "Get Gems" tab in our Store.
            </p>
          </Card>

          {/* Are characters real */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Are the characters real people?</h3>
            <p className="text-sm text-muted-foreground">
              No. All characters are entirely fictional and powered by advanced artificial intelligence for entertainment purposes. Your conversations are with an AI, not a real person.
            </p>
          </Card>

          {/* Privacy */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Is my conversation private?</h3>
            <p className="text-sm text-muted-foreground">
              Yes. We prioritize your privacy. Conversation transcripts are only stored temporarily (for 30 days) to allow your AI companion to have memory and to help our team debug any technical issues. Please see our Privacy Policy for full details.
            </p>
          </Card>

          {/* Subscriptions */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How do subscriptions work?</h3>
            <p className="text-sm text-muted-foreground">
              Subscribing is the best way to get a large number of Gems each month at a great value, along with other perks like unlimited messaging. Your subscription will renew automatically each month. You can manage or cancel your subscription at any time through the "Manage Billing" section in the app's settings.
            </p>
          </Card>

          {/* Technical Issues */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">My voice call didn't connect or a feature failed. What do I do?</h3>
            <p className="text-sm text-muted-foreground">
              If a premium feature fails to work after you have spent Gems, please contact our support team immediately. We have logs of all transactions and will ensure any issues are resolved promptly, including refunding Gems for failed services.
            </p>
          </Card>

          {/* Contact Support */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How can I contact support?</h3>
            <p className="text-sm text-muted-foreground">
              You can reach us any time by emailing{" "}
              <a href="mailto:support@secret-share.com" className="text-primary hover:underline">
                support@secret-share.com
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
