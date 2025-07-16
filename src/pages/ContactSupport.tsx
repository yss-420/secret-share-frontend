
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Contact Support</h1>
      </div>

      <div className="px-4 py-3">
        <h2 className="text-2xl font-bold text-gradient mb-6">Contact Support</h2>

        <div className="space-y-6">
          {/* Main Support Information */}
          <Card className="card-premium transition-smooth p-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground text-base leading-relaxed">
                If you are experiencing a technical issue, have a question about your billing and purchases, or need any other assistance, please do not hesitate to reach out to our support team. We are here to help.
              </p>
            </div>
          </Card>

          {/* Telegram Community */}
          <Card className="card-premium transition-smooth p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Our Telegram community and moderators will be releasing soon.
              </p>
            </div>
          </Card>

          {/* Email Support */}
          <Card className="card-premium transition-smooth p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Email Support</h3>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="text-foreground font-medium">
                  For the fastest service, please include your Telegram username if possible.
                </p>
                <div className="flex items-center space-x-2">
                  <span>Email us at:</span>
                  <a 
                    href="mailto:support@secret-share.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    support@secret-share.com
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
