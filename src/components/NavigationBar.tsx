import { Button } from "@/components/ui/button";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const tabs = [
    { id: 'characters', label: 'Characters' },
    { id: 'upgrade', label: 'Upgrade' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around py-4 px-6 max-w-md mx-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "premium" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`relative ${activeTab === tab.id ? '' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};