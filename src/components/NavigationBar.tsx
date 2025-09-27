
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Settings, Trophy } from "lucide-react";
import { trackNavigation, trackStoreVisit } from "@/utils/analytics";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-detect active tab from current route if not provided
  const currentActiveTab = activeTab || (() => {
    const path = location.pathname;
    if (path === '/showdown') return 'showdown';
    if (path === '/store') return 'upgrade';
    if (path === '/settings') return 'settings';
    return 'characters';
  })();
  
  const tabs = [
    { id: 'characters', label: t('navigation.characters'), icon: Users, path: '/' },
    { id: 'showdown', label: t('navigation.showdown'), icon: Trophy, path: '/showdown' },
    { id: 'upgrade', label: t('navigation.upgrade'), icon: TrendingUp, path: '/store' },
    { id: 'settings', label: t('navigation.settings'), icon: Settings, path: '/settings' }
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    if (tab.id === 'upgrade') {
      trackStoreVisit();
    } else {
      trackNavigation(tab.id);
    }
    
    // Use React Router navigation
    navigate(tab.path);
    
    // Call onTabChange if provided (for backward compatibility)
    onTabChange?.(tab.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around py-3 px-6 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentActiveTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(tab)}
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
