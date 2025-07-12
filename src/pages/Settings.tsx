import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { ArrowLeft, ChevronRight, Crown, Globe, Bell, Save, HelpCircle, Shield, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-4 border-b border-white/10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-gradient ml-3">Settings</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Your Plan */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Plan</h2>
          <Card className="card-premium transition-smooth p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Free Plan</div>
                  <div className="text-xs text-muted-foreground">Limited conversations</div>
                </div>
              </div>
              <Button variant="premium" size="sm" onClick={() => navigate('/upgrade')}>
                Upgrade
              </Button>
            </div>
          </Card>
        </div>

        {/* Language */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Language</h2>
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

        {/* App Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">App Settings</h2>
          <div className="space-y-3">
            <Card className="card-premium transition-smooth p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Push Notifications</div>
                    <div className="text-xs text-muted-foreground">Get notified about new messages</div>
                  </div>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Save className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Auto-Save Conversations</div>
                    <div className="text-xs text-muted-foreground">Automatically save your chats</div>
                  </div>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
            </Card>
          </div>
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
          </div>
        </div>
      </div>

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Settings;