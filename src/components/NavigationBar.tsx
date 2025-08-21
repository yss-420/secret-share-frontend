
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Settings } from "lucide-react";
import { trackNavigation, trackStoreVisit } from "@/utils/analytics";
import { useTranslation } from 'react-i18next';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 'characters', label: t('navigation.characters'), icon: Users },
    { id: 'upgrade', label: t('navigation.upgrade'), icon: TrendingUp },
    { id: 'settings', label: t('navigation.settings'), icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'upgrade') {
      trackStoreVisit();
      window.location.href = '/store';
    } else {
      trackNavigation(tabId);
      onTabChange(tabId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around py-3 px-6 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
