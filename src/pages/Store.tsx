
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Gem, Crown, ArrowLeft, Star, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Package mapping constants
const GEM_PACKAGE_MAP: Record<number, string> = {
  50: 'gems_50',     // 50 Stars → 45 Gems
  100: 'gems_100',   // 100 Stars → 95 Gems
  250: 'gems_250',   // 250 Stars → 250 Gems
  500: 'gems_500',   // 500 Stars → 525 Gems
  1000: 'gems_1000', // 1000 Stars → 1100 Gems
  2500: 'gems_2500', // 2500 Stars → 2600 Gems
  5000: 'gems_5000', // 5000 Stars → 4200 Gems
  10000: 'gems_10000' // 10000 Stars → 8500 Gems
};

const SUBSCRIPTION_MAP: Record<string, string> = {
  'Essential': 'sub_essential', // 400 Stars
  'Plus': 'sub_plus',          // 800 Stars  
  'Premium': 'sub_premium'     // 1600 Stars
};

const Store = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateGems, userStats } = useUserData();
  const { user: telegramUser } = useTelegramAuth();

  // Initialize Telegram WebApp
  useEffect(() => {
    console.log('Initializing Telegram WebApp...');
    console.log('window.Telegram:', window.Telegram);
    
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp found, initializing...');
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log('Telegram WebApp initialized');
      console.log('openInvoice method available:', typeof window.Telegram.WebApp.openInvoice);
    } else {
      console.warn('Telegram WebApp not found');
    }
  }, []);

  // Update user gems in Supabase after successful payment
  const updateUserGems = async (gemsToAdd: number) => {
    try {
      if (!telegramUser?.id) return;
      
      const { error } = await supabase
        .from('users')
        .update({ 
          gems: (userStats?.gems || 0) + gemsToAdd,
          last_seen: new Date().toISOString()
        })
        .eq('telegram_id', telegramUser.id);

      if (error) throw error;
      
      // Update local state via existing hook
      updateGems(gemsToAdd);
      
    } catch (error) {
      console.error('Failed to update gems:', error);
      toast({
        title: "Update Failed",
        description: "Gems were purchased but failed to update. Please refresh.",
        variant: "destructive",
      });
    }
  };

  // Update user subscription in Supabase after successful payment
  const updateUserSubscription = async (tier: string, gemsToAdd: number) => {
    try {
      if (!telegramUser?.id) return;
      
      const { error } = await supabase
        .from('users')
        .update({ 
          gems: (userStats?.gems || 0) + gemsToAdd,
          subscription_type: tier.toLowerCase(),
          last_seen: new Date().toISOString()
        })
        .eq('telegram_id', telegramUser.id);

      if (error) throw error;
      
      // Update local state via existing hook
      updateGems(gemsToAdd);
      
    } catch (error) {
      console.error('Failed to update subscription:', error);
      toast({
        title: "Update Failed", 
        description: "Subscription was purchased but failed to update. Please refresh.",
        variant: "destructive",
      });
    }
  };

  const handleGemPurchase = async (gemPackage: typeof gemPackages[0]) => {
    // Debug logging
    console.log('Telegram object:', window.Telegram);
    console.log('WebApp object:', window.Telegram?.WebApp);
    console.log('openInvoice available:', typeof window.Telegram?.WebApp?.openInvoice);
    
    if (!window.Telegram?.WebApp) {
      toast({
        title: "Telegram WebApp Error",
        description: "Telegram WebApp not found. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    if (typeof window.Telegram.WebApp.openInvoice !== 'function') {
      toast({
        title: "Payment Feature Unavailable", 
        description: "Telegram Stars payments are not available. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Extract stars from price string (e.g., "⭐️ 50" -> 50)
      const stars = parseInt(gemPackage.price.replace(/[^\d,]/g, '').replace(',', ''));

      // Create invoice link via backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${gemPackage.gems} Gems`,
          description: `Purchase ${gemPackage.gems} Gems for premium features`,
          payload: `gems_${stars}`,
          currency: "XTR",
          prices: [{ amount: stars, label: `${gemPackage.gems} Gems` }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const { invoiceLink } = await response.json();

      // Open Telegram payment using invoice link
      window.Telegram.WebApp.openInvoice(invoiceLink, async (status) => {
        if (status === "paid") {
          // Payment successful - update Supabase directly
          await updateUserGems(gemPackage.gems);
          toast({
            title: "Payment Successful! 💎",
            description: `${gemPackage.gems} gems added to your account.`,
          });
        } else if (status === "failed") {
          toast({
            title: "Payment Failed",
            description: "Payment was not completed. Please try again.",
            variant: "destructive",
          });
        } else if (status === "cancelled") {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment.",
          });
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubscribe = async (planName: string) => {
    // Debug logging
    console.log('Telegram object:', window.Telegram);
    console.log('WebApp object:', window.Telegram?.WebApp);
    console.log('openInvoice available:', typeof window.Telegram?.WebApp?.openInvoice);
    
    if (!window.Telegram?.WebApp) {
      toast({
        title: "Telegram WebApp Error",
        description: "Telegram WebApp not found. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    if (typeof window.Telegram.WebApp.openInvoice !== 'function') {
      toast({
        title: "Payment Feature Unavailable",
        description: "Telegram Stars payments are not available. Please ensure you're using the latest Telegram version.", 
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const tierPricing: Record<string, { stars: number; gems: number }> = {
        'Essential': { stars: 400, gems: 450 },
        'Plus': { stars: 800, gems: 1200 },
        'Premium': { stars: 1600, gems: 2500 }
      };

      const pricing = tierPricing[planName];
      if (!pricing) {
        throw new Error('Invalid subscription plan');
      }

      // Create invoice link via backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${planName} Subscription`,
          description: `Monthly ${planName} subscription with ${pricing.gems} gems`,
          payload: `sub_${planName.toLowerCase()}`,
          currency: "XTR",
          prices: [{ amount: pricing.stars, label: `${planName} Monthly` }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const { invoiceLink } = await response.json();

      // Open Telegram payment using invoice link
      window.Telegram.WebApp.openInvoice(invoiceLink, async (status) => {
        if (status === "paid") {
          // Payment successful - update Supabase directly
          await updateUserSubscription(planName, pricing.gems);
          toast({
            title: "Subscription Activated! 🎉",
            description: `${planName} subscription activated with ${pricing.gems} gems.`,
          });
        } else if (status === "failed") {
          toast({
            title: "Payment Failed",
            description: "Payment was not completed. Please try again.",
            variant: "destructive",
          });
        } else if (status === "cancelled") {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment.",
          });
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const gemPackages = [
    { gems: 45, price: "⭐️ 50", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 95, price: "⭐️ 100", color: "from-green-500 to-green-600", popular: false },
    { gems: 250, price: "⭐️ 250", color: "from-purple-500 to-purple-600", popular: false },
    { gems: 525, price: "⭐️ 500", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 1100, price: "⭐️ 1,000", color: "from-pink-500 to-pink-600", popular: true },
    { gems: 2600, price: "⭐️ 2,500", color: "from-red-500 to-red-600", popular: false },
    { gems: 4200, price: "⭐️ 5,000", color: "from-yellow-500 to-yellow-600", popular: false },
    { gems: 8500, price: "⭐️ 10,000", color: "from-indigo-500 to-indigo-600", popular: false },
  ];

  const subscriptionPlans = [
    {
      name: "Essential",
      price: "⭐️ 400",
      period: "Stars / month",
      icon: Star,
      color: "from-blue-500 to-blue-600",
      features: [
        "**450 Monthly Gems**",
        "Est. Value: 🎙️ 15+ Voice Notes or 📞 10+ Call Mins or 🎬 5+ Videos",
        "Unlimited Conversations",
        "Ad-Free Experience",
        "Priority Support"
      ]
    },
    {
      name: "Plus",
      price: "⭐️ 800",
      period: "Stars / month",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: true,
      features: [
        "**1,200 Monthly Gems**",
        "Est. Value: 🎙️ 40+ Voice Notes or 📞 25+ Call Mins or 🎬 15+ Videos",
        "Everything in Essential",
        "Media Priority Queue",
        "Enhanced Media Quality"
      ]
    },
    {
      name: "Premium",
      price: "⭐️ 1,600",
      period: "Stars / month",
      icon: Sparkles,
      color: "from-yellow-500 to-yellow-600",
      features: [
        "**2,500 Monthly Gems**",
        "Est. Value: 🎙️ 85+ Voice Notes or 📞 50+ Call Mins or 🎬 30+ Videos",
        "Everything in Plus",
        "Ultimate Priority Queue",
        "Early Access to New Characters",
        "Priority Access to New Features"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Store</h1>
      </div>

      <div className="px-4 py-3">
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="gems">Get Gems</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card key={plan.name} className="card-premium transition-smooth group p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gradient">{plan.name}</h3>
                          {plan.popular && (
                            <div className="bg-primary px-2 py-0.5 rounded-full text-xs font-bold text-primary-foreground">
                              Most Popular
                            </div>
                          )}
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {feature.includes('**') ? (
                            <span dangerouslySetInnerHTML={{
                              __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }} />
                          ) : (
                            feature
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="premium" 
                    size="lg" 
                    className="w-full"
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : "Subscribe"}
                  </Button>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="gems" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gemPackages.map((pkg) => (
                <Card key={pkg.gems} className="card-premium transition-smooth group p-4 text-center relative overflow-visible">
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-orange-500 px-1.5 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap">
                        Popular
                      </div>
                    </div>
                  )}
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                    <Gem className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <Gem className="w-4 h-4 text-primary mr-1" />
                    <span className="text-xl font-bold text-foreground">{pkg.gems.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Gems</div>
                  <div className="text-xl font-bold text-green-400 mb-3">{pkg.price}</div>
                  <Button 
                    variant="elegant" 
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white border-none" 
                    onClick={() => handleGemPurchase(pkg)}
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : "Purchase"}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Store;
