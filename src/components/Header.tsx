
import { Gem, Zap, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { LoadingSpinner } from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, telegramUser, error: authError } = useAuth();
  const { userStats, loading, error: userDataError } = useUserData();
  const navigate = useNavigate();

  // Check if user has an active subscription
  const hasActiveSubscription = () => {
    if (!userStats?.subscription_end || !userStats?.tier) return false;
    
    const subscriptionEnd = new Date(userStats.subscription_end);
    const now = new Date();
    
    // User has active subscription if:
    // 1. Subscription hasn't expired AND
    // 2. Tier is not 'free'
    return subscriptionEnd > now && userStats.tier !== 'free';
  };

  const getMessageDisplay = () => {
    if (loading) return <LoadingSpinner size="sm" />;
    if (authError || userDataError) return <AlertCircle className="w-2.5 h-2.5 text-red-500" />;
    
    const messagesUsed = userStats?.messages_today || 0;
    
    if (hasActiveSubscription()) {
      return <span className="text-xs font-medium text-foreground">∞</span>;
    } else {
      return <span className="text-xs font-medium text-foreground">{messagesUsed}/50</span>;
    }
  };

  const getGemsDisplay = () => {
    if (loading) return <LoadingSpinner size="sm" />;
    if (authError || userDataError) return <AlertCircle className="w-2.5 h-2.5 text-red-500" />;
    return <span className="text-xs font-medium text-foreground">{userStats?.gems || 0}</span>;
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-white/20">
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
          <p className="text-xs text-muted-foreground">Your AI Companion</p>
        </div>
      </div>

      {/* Right side - Combined Stats and Plus button */}
      <div className="flex items-center space-x-2">
        {/* Combined Gems + Energy + Plus button pill */}
        <div className="flex items-center space-x-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/20">
          {/* Gems */}
          <div className="flex items-center space-x-0.5">
            <Gem className="w-2.5 h-2.5 text-blue-500" />
            {getGemsDisplay()}
          </div>

          {/* Divider */}
          <div className="w-px h-2.5 bg-white/20" />

          {/* Energy */}
          <div className="flex items-center space-x-0.5">
            <Zap className="w-2.5 h-2.5 text-yellow-500" />
            {getMessageDisplay()}
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
      </div>
    </header>
  );
};
