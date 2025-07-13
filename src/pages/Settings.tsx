
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { ArrowLeft, ChevronRight, Crown, Globe, HelpCircle, Shield, FileText, Receipt, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats } = useUserData();

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/upgrade') return 'upgrade';
    if (path === '/settings') return 'settings';
    return 'characters';
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'characters') {
      navigate('/');
    } else if (tab === 'upgrade') {
      navigate('/store');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Settings</h1>
      </div>

      <div className="px-4 py-3 space-y-6">
        {/* My Plan */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">My Plan</h2>
          <Card className="card-premium transition-smooth p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {userStats?.subscription_type || 'Free Plan'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {userStats?.tier === 'premium' ? 'Unlimited conversations' : 'Limited conversations'}
                  </div>
                </div>
              </div>
              <Button variant="premium" size="sm" onClick={() => navigate('/store')}>
                Upgrade
              </Button>
            </div>
          </Card>
        </div>

        {/* Account & Billing */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Account & Billing</h2>
          <div className="space-y-3">
            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Purchase History</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Manage Billing</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>

        {/* App Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">App Settings</h2>
          <Card className="card-premium transition-smooth p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">English</div>
                  <div className="text-xs text-muted-foreground">App language</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Help & Support */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Help & Support</h2>
          <div className="space-y-3">
            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Help Center</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Privacy Policy</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Terms of Service</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Contact Support</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <NavigationBar activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </div>
  );
};

export default Settings;
