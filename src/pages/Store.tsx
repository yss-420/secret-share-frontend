
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
  100: 'gems_50',     // 100 Stars → 50 Gems
  200: 'gems_100',    // 200 Stars → 100 Gems
  400: 'gems_250',    // 400 Stars → 250 Gems
  750: 'gems_500',    // 750 Stars → 500 Gems
  1500: 'gems_1000', // 1500 Stars → 1000 Gems
  4000: 'gems_2500', // 4000 Stars → 2500 Gems
  7500: 'gems_5000', // 7500 Stars → 5000 Gems
  10000: 'gems_10000' // 10000 Stars → 10000 Gems
};

const SUBSCRIPTION_MAP: Record<string, string> = {
  'Essential': 'sub_essential', // 500 Stars
  'Plus': 'sub_plus',          // 1000 Stars  
  'Premium': 'sub_premium'     // 2000 Stars
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

  // Validate Telegram user on component mount
  useEffect(() => {
    console.log('Store component mounted');
    console.log('window.Telegram:', window.Telegram);
    console.log('WebApp available:', !!window.Telegram?.WebApp);
    
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      try {
        tg.ready();
        tg.expand();
        console.log('Telegram WebApp initialized');
        
        // Check if we're in actual Telegram environment
        if (!tg.initDataUnsafe?.user) {
          console.log('No Telegram user found');
          // Only use Telegram methods if they're actually supported
          if (typeof tg.showAlert === 'function') {
            try {
              tg.showAlert('Please open this store from the Telegram bot!');
              if (typeof tg.close === 'function') {
                tg.close();
              }
            } catch (error) {
              console.warn('Telegram WebApp methods not supported in this environment:', error);
              // Fallback for development environment
              alert('This store is designed to work within the Telegram bot. You\'re viewing a preview.');
            }
          } else {
            console.log('Development environment detected - Telegram methods not available');
            // Show a development notice instead
            toast({
              title: "Development Preview",
              description: "This store is designed to work within the Telegram bot.",
            });
          }
        } else {
          console.log('Telegram user found:', tg.initDataUnsafe.user);
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
        toast({
          title: "Preview Mode",
          description: "You're viewing a preview. This store works best in Telegram.",
        });
      }
    } else {
      console.log('Telegram WebApp not available - showing preview mode');
      toast({
        title: "Preview Mode",
        description: "You're viewing a preview. This store is designed for Telegram.",
      });
    }
  }, []);

  const handleGemPurchase = async (gemPackage: typeof gemPackages[0]) => {
    if (!window.Telegram?.WebApp) {
      toast({
        title: "Telegram WebApp Error",
        description: "Telegram WebApp not found. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    if (!telegramUser?.id) {
      // Use safe method calling
      if (window.Telegram.WebApp.showAlert && typeof window.Telegram.WebApp.showAlert === 'function') {
        try {
          window.Telegram.WebApp.showAlert('User not authenticated!');
        } catch (error) {
          console.warn('showAlert not supported:', error);
          toast({
            title: "Authentication Required",
            description: "Please open this store from the Telegram bot.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Authentication Required", 
          description: "Please open this store from the Telegram bot.",
          variant: "destructive",
        });
      }
      return;
    }

    setLoading(true);

    try {
      // Extract stars from price string (e.g., "⭐️ 100" -> 100)
      const stars = parseInt(gemPackage.price.replace(/[^\d,]/g, '').replace(',', ''));
      const packageType = `gems_${gemPackage.gems}`;

      // Create invoice via backend using the approved method
      const response = await fetch('https://secret-share-backend-production.up.railway.app/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUser.id,
          package_type: packageType
        })
      });

      const data = await response.json();

      if (data.success && data.invoice_url) {
        // Open Telegram payment using invoice link
        window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
          if (status === "paid") {
            // Safe alert call
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Payment successful! 🎉');
              } catch (error) {
                console.warn('showAlert not supported:', error);
                toast({ title: "Payment Successful! 🎉", description: "Your gems have been added." });
              }
            } else {
              toast({ title: "Payment Successful! 🎉", description: "Your gems have been added." });
            }
            window.location.reload();
          } else if (status === "cancelled") {
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Payment cancelled.');
              } catch (error) {
                toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
              }
            } else {
              toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
            }
          } else {
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Payment failed. Please try again.');
              } catch (error) {
                toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
              }
            } else {
              toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
            }
          }
          setLoading(false);
        });
      } else {
        throw new Error(data.error || 'Failed to create invoice');
      }

    } catch (error) {
      console.error('Payment error:', error);
      if (typeof window.Telegram.WebApp.showAlert === 'function') {
        try {
          window.Telegram.WebApp.showAlert('Error creating payment. Please try again.');
        } catch (alertError) {
          toast({
            title: "Payment Error",
            description: "Unable to process payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Payment Error",
          description: "Unable to process payment. Please try again.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const handleSubscribe = async (planName: string) => {
    if (!window.Telegram?.WebApp) {
      toast({
        title: "Telegram WebApp Error",
        description: "Telegram WebApp not found. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    if (!telegramUser?.id) {
      // Use safe method calling
      if (window.Telegram.WebApp.showAlert && typeof window.Telegram.WebApp.showAlert === 'function') {
        try {
          window.Telegram.WebApp.showAlert('User not authenticated!');
        } catch (error) {
          console.warn('showAlert not supported:', error);
          toast({
            title: "Authentication Required",
            description: "Please open this store from the Telegram bot.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Authentication Required", 
          description: "Please open this store from the Telegram bot.",
          variant: "destructive",
        });
      }
      return;
    }

    setLoading(true);

    try {
      const packageType = `sub_${planName.toLowerCase()}`;

      // Create invoice via backend using the approved method
      const response = await fetch('https://secret-share-backend-production.up.railway.app/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUser.id,
          package_type: packageType
        })
      });

      const data = await response.json();

      if (data.success && data.invoice_url) {
        // Open Telegram payment using invoice link
        window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
          if (status === "paid") {
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Subscription activated! 🎉');
              } catch (error) {
                console.warn('showAlert not supported:', error);
                toast({ title: "Subscription Activated! 🎉", description: "Your subscription is now active." });
              }
            } else {
              toast({ title: "Subscription Activated! 🎉", description: "Your subscription is now active." });
            }
            window.location.reload();
          } else if (status === "cancelled") {
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Payment cancelled.');
              } catch (error) {
                toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
              }
            } else {
              toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
            }
          } else {
            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Payment failed. Please try again.');
              } catch (error) {
                toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
              }
            } else {
              toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
            }
          }
          setLoading(false);
        });
      } else {
        throw new Error(data.error || 'Failed to create invoice');
      }

    } catch (error) {
      console.error('Subscription error:', error);
      if (typeof window.Telegram.WebApp.showAlert === 'function') {
        try {
          window.Telegram.WebApp.showAlert('Error creating payment. Please try again.');
        } catch (alertError) {
          toast({
            title: "Subscription Failed",
            description: "Unable to process payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Subscription Failed",
          description: "Unable to process payment. Please try again.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const gemPackages = [
    { gems: 50, price: "⭐️ 100", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 100, price: "⭐️ 200", color: "from-green-500 to-green-600", popular: false },
    { gems: 250, price: "⭐️ 400", color: "from-purple-500 to-purple-600", popular: false },
    { gems: 500, price: "⭐️ 750", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 1000, price: "⭐️ 1,500", color: "from-pink-500 to-pink-600", popular: true },
    { gems: 2500, price: "⭐️ 4,000", color: "from-red-500 to-red-600", popular: false },
    { gems: 5000, price: "⭐️ 7,500", color: "from-yellow-500 to-yellow-600", popular: false },
    { gems: 10000, price: "⭐️ 10,000", color: "from-indigo-500 to-indigo-600", popular: false },
  ];

  const subscriptionPlans = [
    {
      name: "Essential",
      price: "⭐️ 500",
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
      price: "⭐️ 1,000",
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
      price: "⭐️ 2,000",
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
