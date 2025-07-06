import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/':
        return 'characters';
      case '/store':
        return 'upgrade';
      case '/settings':
        return 'settings';
      default:
        return activeTab;
    }
  };

  const currentTab = getCurrentTab();
  const tabs = [
    { id: 'characters', label: 'Characters', route: '/' },
    { id: 'upgrade', label: 'Store', route: '/store' },
    { id: 'settings', label: 'Settings', route: '/settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around py-4 px-6 max-w-md mx-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={currentTab === tab.id ? "premium" : "ghost"}
            size="sm"
            onClick={() => {
              onTabChange(tab.id);
              navigate(tab.route);
            }}
            className={`relative ${currentTab === tab.id ? '' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
            {currentTab === tab.id && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};