import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Gem, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockUser } from "@/data/mockData";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showStats?: boolean;
}

export const Header = ({ title, showBack = false, showStats = true }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/':
        return 'Choose Your Companion';
      case '/store':
        return 'Store';
      case '/settings':
        return 'Settings';
      case '/chat':
        return 'Chat';
      default:
        return 'Secret Share';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-gradient truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showStats && (
            <>
              {/* Energy */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">{mockUser.energy}</span>
              </div>
              
              {/* Gems */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1">
                <Gem className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">{mockUser.gems}</span>
              </div>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="p-2 hover:bg-muted/50"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};