import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Zap, Gift, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { adService } from "@/services/adService";
import { useAdEligibility } from "@/hooks/useAdEligibility";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/useUserData";

interface EarnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
  subscriptionType?: string;
  highlightTile?: 'quick' | 'bonus';
}

export const EarnModal = ({ 
  open, 
  onOpenChange, 
  userId, 
  subscriptionType,
  highlightTile 
}: EarnModalProps) => {
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [loadingBonus, setLoadingBonus] = useState(false);
  const [preventInteraction, setPreventInteraction] = useState(false);
  const { refreshUserData } = useUserData();
  
  const quickEligibility = useAdEligibility(userId, 'quick');
  const bonusEligibility = useAdEligibility(userId, 'bonus');

  // Refresh eligibility when modal opens
  useEffect(() => {
    if (open && userId) {
      quickEligibility.refresh();
      bonusEligibility.refresh();
    }
  }, [open, userId]);

  // Prevent accidental outside tap for 200ms when modal opens
  useEffect(() => {
    if (open) {
      setPreventInteraction(true);
      const timer = setTimeout(() => setPreventInteraction(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Check if user should see ads
  const isPaidUser = adService.isPaidUser(subscriptionType);
  const isIntroUser = adService.isIntroUser(subscriptionType);
  const showAds = !isPaidUser || isIntroUser;

  const handleQuickEarn = async () => {
    if (!userId || loadingQuick || loadingBonus) return;

    setLoadingQuick(true);
    try {
      const result = await adService.showQuickEarnAd(userId);
      
      if (result.success) {
        toast({
          title: "Gems Earned! 💎",
          description: result.message,
        });
        refreshUserData();
        await quickEligibility.refresh(); // Refresh to get updated counter
      } else {
        toast({
          title: "Ad Not Completed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Quick earn failed:', error);
      toast({
        title: "Ad Unavailable",
        description: "Ad unavailable, try again soon.",
        variant: "destructive",
      });
    } finally {
      setLoadingQuick(false);
    }
  };

  const handleBigBonus = async () => {
    if (!userId || loadingQuick || loadingBonus) return;

    setLoadingBonus(true);
    try {
      const result = await adService.showBigBonusAd(userId);
      
      if (result.success) {
        toast({
          title: "Big Bonus Earned! 🎉",
          description: result.message,
        });
        refreshUserData();
        await bonusEligibility.refresh(); // Refresh to get updated availability
      } else {
        toast({
          title: "Bonus Pending",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Big bonus failed:', error);
      toast({
        title: "Ad Unavailable",
        description: "Ad unavailable, try again soon.",
        variant: "destructive",
      });
    } finally {
      setLoadingBonus(false);
    }
  };

  const handleInteractOutside = (e: Event) => {
    if (preventInteraction) {
      e.preventDefault();
      return;
    }
    onOpenChange(false);
  };

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-[100vw] bg-black/60 backdrop-blur-sm overscroll-contain">
      <div 
        className="fixed inset-0" 
        onClick={() => !preventInteraction && onOpenChange(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-[min(640px,100vw)] max-h-[85dvh] rounded-t-2xl bg-[#111318] overflow-y-auto">
        {!showAds ? (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Gem className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Free Gems</h2>
            </div>
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Free gems are not available with your current subscription.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Thank you for supporting our premium service! 🎉
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Gem className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Earn Free Gems</h2>
            </div>
            
            <div className="space-y-4">
              {/* Quick Earn Tile */}
              <Card className={`transition-all duration-300 ${
                highlightTile === 'quick' ? 'ring-2 ring-primary' : ''
              } ${quickEligibility.eligibility?.allowed ? 'hover:shadow-lg cursor-pointer' : 'opacity-75'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Quick Earn
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Gem className="w-4 h-4" />
                      <span className="font-bold">10</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Watch a short ad to earn gems instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {quickEligibility.loading ? (
                    <LoadingSpinner size="sm" />
                  ) : quickEligibility.eligibility?.allowed ? (
                    <div className="space-y-2">
                      {quickEligibility.eligibility.remaining_today !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          {quickEligibility.eligibility.remaining_today} remaining today
                        </p>
                      )}
                      <Button 
                        onClick={handleQuickEarn}
                        disabled={loadingQuick || loadingBonus}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        {loadingQuick ? <LoadingSpinner size="sm" /> : 'Watch Ad'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {quickEligibility.eligibility?.cooldown_seconds && 
                          `Next in ${quickEligibility.formatCooldown(quickEligibility.eligibility.cooldown_seconds)}`
                        }
                        {quickEligibility.eligibility?.next_available_at && 
                          `Available ${quickEligibility.formatNextAvailable(quickEligibility.eligibility.next_available_at)}`
                        }
                      </div>
                      <Button disabled className="w-full">
                        Not Available
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Big Bonus Tile */}
              <Card className={`transition-all duration-300 ${
                highlightTile === 'bonus' ? 'ring-2 ring-primary' : ''
              } ${bonusEligibility.eligibility?.allowed ? 'hover:shadow-lg cursor-pointer' : 'opacity-75'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-500" />
                      Big Bonus
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Gem className="w-4 h-4" />
                      <span className="font-bold">50</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Complete an offer for a massive gem bonus
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {bonusEligibility.loading ? (
                    <LoadingSpinner size="sm" />
                  ) : bonusEligibility.eligibility?.allowed ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Available once per week
                      </p>
                      <Button 
                        onClick={handleBigBonus}
                        disabled={loadingQuick || loadingBonus}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {loadingBonus ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span>Pending...</span>
                          </div>
                        ) : 'Start Offer'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {bonusEligibility.eligibility?.next_available_at && 
                          `Next: ${bonusEligibility.formatNextAvailable(bonusEligibility.eligibility.next_available_at)}`
                        }
                      </div>
                      <Button disabled className="w-full">
                        Not Available
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Section */}
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Tips for earning gems:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Watch ads completely to earn rewards</li>
                    <li>• Check back daily for new opportunities</li>
                    <li>• Stay connected for the best experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};