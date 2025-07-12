import { Gem, Zap, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { LoadingSpinner } from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, telegramUser } = useAuth();
  const { userStats, loading } = useUserData();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/20">
      {/* Left side - Profile and Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
          <img 
            src="/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Secret Share</h1>
          <p className="text-xs text-muted-foreground">AI Chat Platform</p>
        </div>
      </div>

      {/* Right side - Combined Stats and Menu */}
      <div className="flex items-center space-x-2">
        {/* Combined Gems + Energy + Plus button pill (smaller) */}
        <div className="flex items-center space-x-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/20">
          {/* Gems */}
          <div className="flex items-center space-x-0.5">
            <Gem className="w-2.5 h-2.5 text-primary" />
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span className="text-xs font-medium text-foreground">{userStats?.gems || 0}</span>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-2.5 bg-white/20" />

          {/* Energy */}
          <div className="flex items-center space-x-0.5">
            <Zap className="w-2.5 h-2.5 text-accent" />
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span className="text-xs font-medium text-foreground">
                {userStats?.messages_today || 0}/{userStats?.tier === 'premium' ? '∞' : '10'}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-2.5 bg-white/20" />

          {/* Plus button */}
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-4 h-4 p-0 hover:bg-primary/20"
            onClick={() => navigate('/store')}
          >
            <Plus className="w-2.5 h-2.5 text-primary" />
          </Button>
        </div>

        {/* Menu dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Purchase History</DropdownMenuItem>
            <DropdownMenuItem>Restore Purchase</DropdownMenuItem>
            <DropdownMenuItem>Contact Support</DropdownMenuItem>
            <DropdownMenuItem>Billing Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
