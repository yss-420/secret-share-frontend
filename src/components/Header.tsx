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

export const Header = () => {
  const { user, telegramUser } = useAuth();
  const { userStats, loading } = useUserData();
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/20">
      {/* Left side - Profile and Brand */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
          <img 
            src="/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground">Secret Share</h1>
          <p className="text-xs text-muted-foreground">AI Chat Platform</p>
        </div>
      </div>

      {/* Right side - Gems, Energy, and Menu */}
      <div className="flex items-center space-x-2">
        {/* Gems */}
        <div className="flex items-center space-x-1 bg-primary/15 px-2 py-1 rounded-full">
          <Gem className="w-3 h-3 text-primary" />
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <span className="text-xs font-medium text-foreground">{userStats?.gems || 0}</span>
          )}
        </div>

        {/* Combined Energy + Plus button pill */}
        <div className="flex items-center space-x-1 bg-accent/15 px-2 py-1 rounded-full border border-accent/20">
          <Zap className="w-3 h-3 text-accent" />
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <span className="text-xs font-medium text-foreground">
              {userStats?.messages_today || 0}/{userStats?.tier === 'premium' ? '∞' : '10'}
            </span>
          )}
          <div className="w-px h-3 bg-white/20 mx-1" />
          <Button size="sm" variant="ghost" className="w-5 h-5 p-0 hover:bg-primary/20">
            <Plus className="w-3 h-3 text-primary" />
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