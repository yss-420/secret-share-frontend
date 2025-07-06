import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { mockUser } from "@/data/mockData";
import { 
  User, 
  Bell, 
  Shield, 
  Crown, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight,
  Star
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('settings');
  const [notifications, setNotifications] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  const handleLogout = () => {
    console.log('Logout');
    // Handle logout logic here
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    onClick 
  }: {
    icon: any;
    title: string;
    description?: string;
    action?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div 
      className={`flex items-center justify-between p-4 border-b border-border/50 last:border-b-0 ${
        onClick ? 'hover:bg-muted/30 cursor-pointer transition-colors' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
      {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted pb-20 pt-16">
      <Header showBack />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Profile Section */}
        <Card className="card-premium mb-6">
          <div className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gradient mb-1">Anonymous User</h2>
            <p className="text-sm text-muted-foreground mb-3">Level {mockUser.level} • {mockUser.experience} XP</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{mockUser.gems}</p>
                <p className="text-xs text-muted-foreground">Gems</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-400">{mockUser.energy}</p>
                <p className="text-xs text-muted-foreground">Energy</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="card-premium mb-6">
          <div className="p-4">
            <h3 className="font-bold text-sm mb-4 text-gradient">Account</h3>
            <SettingItem
              icon={Crown}
              title="Upgrade to Premium"
              description="Unlock unlimited energy and exclusive features"
              onClick={() => console.log('Upgrade')}
            />
            <SettingItem
              icon={User}
              title="Profile Settings"
              description="Manage your account information"
              onClick={() => console.log('Profile')}
            />
            <SettingItem
              icon={Star}
              title="Achievements"
              description="View your progress and unlocked achievements"
              onClick={() => console.log('Achievements')}
            />
          </div>
        </Card>

        {/* App Settings */}
        <Card className="card-premium mb-6">
          <div className="p-4">
            <h3 className="font-bold text-sm mb-4 text-gradient">Preferences</h3>
            <SettingItem
              icon={Bell}
              title="Notifications"
              description="Manage your notification preferences"
              action={
                <Switch 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              }
            />
            <SettingItem
              icon={Shield}
              title="Privacy Mode"
              description="Enhanced privacy and security settings"
              action={
                <Switch 
                  checked={privateMode}
                  onCheckedChange={setPrivateMode}
                />
              }
            />
          </div>
        </Card>

        {/* Support & Info */}
        <Card className="card-premium mb-6">
          <div className="p-4">
            <h3 className="font-bold text-sm mb-4 text-gradient">Support</h3>
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              description="Get help with using the app"
              onClick={() => console.log('Help')}
            />
            <SettingItem
              icon={Info}
              title="About"
              description="Version 1.0.0 • Terms & Privacy"
              onClick={() => console.log('About')}
            />
          </div>
        </Card>

        {/* Logout */}
        <Card className="card-premium">
          <div className="p-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
      
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}