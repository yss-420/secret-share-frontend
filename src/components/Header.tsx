
import { Gem, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHeaderStats } from "@/hooks/useHeaderStats";
import { LoadingSpinner } from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { FreeGemsButton } from "./FreeGemsButton";
import { EarnModal } from "./EarnModal";
import { adService } from "@/services/adService";
import { useState } from "react";

export const Header = () => {
  const { user, telegramUser, error: authError } = useAuth();
  const { stats, loading } = useHeaderStats();
  const navigate = useNavigate();
  const [earnModalOpen, setEarnModalOpen] = useState(false);

  console.log('🔍 Header - Auth state:', { user, telegramUser, authError });

  // Check if user has an active subscription
  const hasActiveSubscription = () =>
    (stats?.subscription_type && stats.subscription_type !== 'free') || 
    stats?.daily_limit == null || 
    (stats?.intro?.is_active === true);

  const getMessageDisplay = () => {
    if (loading) return <LoadingSpinner size="sm" />;
    if (!stats) return <span className="text-xs font-medium text-muted-foreground">—</span>;
    
    if (stats.daily_limit == null) return <span className="text-xs font-medium text-foreground">∞</span>;
    const cap = stats.daily_limit ?? 50;
    return <span className="text-xs font-medium text-foreground">{(stats.messages_today||0)}/{cap}</span>;
  };

  const getGemsDisplay = () => {
    if (loading) return <LoadingSpinner size="sm" />;
    if (!stats) return <span className="text-xs font-medium text-muted-foreground">—</span>;
    return <span className="text-xs font-medium text-foreground">{stats.gems}</span>;
  };

  // Check if user should see Free Gems button
  const shouldShowFreeGems = !adService.isPaidUser(stats?.subscription_type);

  const handleFreeGemsClick = () => {
    setEarnModalOpen(true);
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

      {/* Right side - Combined Stats and Buttons */}
      <div className="flex items-center space-x-2">
        {/* Free Gems button (shown for Free and Intro users only) */}
        {shouldShowFreeGems && (
          <FreeGemsButton 
            onClick={handleFreeGemsClick}
            size="sm"
            variant="icon-only"
          />
        )}

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

      {/* Earn Modal */}
      <EarnModal 
        open={earnModalOpen}
        onOpenChange={setEarnModalOpen}
        userId={telegramUser?.id}
        subscriptionType={stats?.subscription_type}
      />
    </header>
  );
};
