
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
import { useTranslation } from 'react-i18next';

// Package mapping constants
const GEM_PACKAGE_MAP: Record<number, string> = {
  100: 'gems_100',     // 100 Stars → 100 Gems
  200: 'gems_220',     // 200 Stars → 220 Gems
  400: 'gems_450',     // 400 Stars → 450 Gems
  750: 'gems_850',     // 750 Stars → 850 Gems
  1000: 'gems_1200',   // 1000 Stars → 1200 Gems
  2000: 'gems_2500',   // 2000 Stars → 2500 Gems
  4000: 'gems_5200',   // 4000 Stars → 5200 Gems
  7500: 'gems_10000'   // 7500 Stars → 10000 Gems
};

const SUBSCRIPTION_MAP: Record<string, string> = {
  'Essential': 'sub_essential', // 500 Stars
  'Plus': 'sub_plus',          // 1000 Stars  
  'Premium': 'sub_premium'     // 2000 Stars
};

const Store = () => {
  const [loadingGems, setLoadingGems] = useState<{[key: number]: boolean}>({});
  const [loadingSubscriptions, setLoadingSubscriptions] = useState<{[key: string]: boolean}>({});
  const [loadingIntro, setLoadingIntro] = useState(false);
  const navigate = useNavigate();
  const { updateGems, userStats, refreshUserData } = useUserData();
  const { user: telegramUser } = useTelegramAuth();
  const { t } = useTranslation();

  // Refresh user function to call after payments
  const refreshUser = async () => {
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

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

  const handleGemPurchase = async (gemPackage: typeof gemPackages[0], index: number) => {
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

    setLoadingGems(prev => ({ ...prev, [index]: true }));

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
        window.Telegram.WebApp.openInvoice(data.invoice_url, async (status) => {
          if (status === "paid") {
            // Fire BeMob pixel for successful gem purchase
            const cid = localStorage.getItem('bemob_cid');
            if (cid) {
              const txid = (crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`);
              
              // Deduplication check using sessionStorage
              const firedTxids = JSON.parse(sessionStorage.getItem('bemob_fired_txids') || '[]');
              if (!firedTxids.includes(txid)) {
                const payout = stars; // Stars amount for this purchase
                
                console.log('Firing BeMob pixel for gem purchase:', { cid, txid, payout });
                
                // Fire conversion pixel using Image object to avoid CORS
                new Image().src = `https://jerd8.bemobtrcks.com/conversion.gif?cid=${encodeURIComponent(cid)}&txid=${encodeURIComponent(txid)}&payout=${payout}&_=${Date.now()}`;
                
                // Store txid to prevent duplicates
                firedTxids.push(txid);
                sessionStorage.setItem('bemob_fired_txids', JSON.stringify(firedTxids));
              }
            }

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
            refreshUser();
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
          setLoadingGems(prev => ({ ...prev, [index]: false }));
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
      setLoadingGems(prev => ({ ...prev, [index]: false }));
    } finally {
      refreshUser();
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

    setLoadingSubscriptions(prev => ({ ...prev, [planName]: true }));

    try {
      const packageType = `sub_${planName.toLowerCase()}`;

      // Create invoice via backend using the new subscription endpoint
      const response = await fetch('https://secret-share-backend-production.up.railway.app/create_invoice_link', {
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
        // Show toast for Telegram payment
        toast({
          title: t('store.completePaymentInTelegram'),
          description: t('store.paymentRedirectMessage'),
        });

        // Open Telegram payment using invoice link
        window.Telegram.WebApp.openInvoice(data.invoice_url, async (status) => {
          if (status === "paid") {
            // Fire BeMob pixel for successful subscription purchase
            const cid = localStorage.getItem('bemob_cid');
            if (cid) {
              const txid = (crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`);
              
              // Deduplication check using sessionStorage
              const firedTxids = JSON.parse(sessionStorage.getItem('bemob_fired_txids') || '[]');
              if (!firedTxids.includes(txid)) {
                // Get subscription price in stars
                const subscriptionPrices = { 'Essential': 300, 'Plus': 700, 'Premium': 1400 };
                const payout = subscriptionPrices[planName as keyof typeof subscriptionPrices] || 0;
                
                console.log('Firing BeMob pixel for subscription:', { cid, txid, payout, planName });
                
                // Fire conversion pixel using Image object to avoid CORS
                new Image().src = `https://jerd8.bemobtrcks.com/conversion.gif?cid=${encodeURIComponent(cid)}&txid=${encodeURIComponent(txid)}&payout=${payout}&_=${Date.now()}`;
                
                // Store txid to prevent duplicates
                firedTxids.push(txid);
                sessionStorage.setItem('bemob_fired_txids', JSON.stringify(firedTxids));
              }
            }

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
            refreshUser();
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
          setLoadingSubscriptions(prev => ({ ...prev, [planName]: false }));
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
      setLoadingSubscriptions(prev => ({ ...prev, [planName]: false }));
    } finally {
      refreshUser();
    }
  };

  const handleIntroSubscribe = async () => {
    if (!window.Telegram?.WebApp) {
      toast({
        title: "Telegram WebApp Error",
        description: "Telegram WebApp not found. Please ensure you're using the latest Telegram version.",
        variant: "destructive",
      });
      return;
    }

    if (!telegramUser?.id) {
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

    setLoadingIntro(true);

    try {
      // Create invoice via backend using the intro package type
      const response = await fetch('https://secret-share-backend-production.up.railway.app/api/create_invoice_link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: telegramUser.id,
          package_type: 'intro_3d'
        })
      });

      const data = await response.json();

      if (data.success && data.invoice_url) {
        // Show toast for Telegram payment
        toast({
          title: "Complete Payment in Telegram",
          description: "You'll be redirected to complete your payment.",
        });

        // Open Telegram payment using invoice link
        window.Telegram.WebApp.openInvoice(data.invoice_url, async (status) => {
          if (status === "paid") {
            // Fire BeMob pixel for successful intro purchase
            const cid = localStorage.getItem('bemob_cid');
            if (cid) {
              const txid = (crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`);
              
              // Deduplication check using sessionStorage
              const firedTxids = JSON.parse(sessionStorage.getItem('bemob_fired_txids') || '[]');
              if (!firedTxids.includes(txid)) {
                const payout = 50; // 50 stars for intro package
                
                console.log('Firing BeMob pixel for intro subscription:', { cid, txid, payout });
                
                // Fire conversion pixel using Image object to avoid CORS
                new Image().src = `https://jerd8.bemobtrcks.com/conversion.gif?cid=${encodeURIComponent(cid)}&txid=${encodeURIComponent(txid)}&payout=${payout}&_=${Date.now()}`;
                
                // Store txid to prevent duplicates
                firedTxids.push(txid);
                sessionStorage.setItem('bemob_fired_txids', JSON.stringify(firedTxids));
              }
            }

            // Poll user status for 10-15 seconds after payment
            let pollCount = 0;
            const maxPolls = 15;
            const pollInterval = setInterval(async () => {
              pollCount++;
              try {
                await refreshUser();
                if (pollCount >= maxPolls) {
                  clearInterval(pollInterval);
                }
              } catch (error) {
                console.error('Error polling user status:', error);
              }
            }, 1000);

            if (typeof window.Telegram.WebApp.showAlert === 'function') {
              try {
                window.Telegram.WebApp.showAlert('Intro subscription activated! 🎉');
              } catch (error) {
                console.warn('showAlert not supported:', error);
                toast({ title: "Intro Activated! 🎉", description: "Your 3-day intro is now active." });
              }
            } else {
              toast({ title: "Intro Activated! 🎉", description: "Your 3-day intro is now active." });
            }
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
          setLoadingIntro(false);
        });
      } else {
        throw new Error(data.error || 'Failed to create invoice');
      }

    } catch (error) {
      console.error('Intro subscription error:', error);
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
      setLoadingIntro(false);
    }
  };

  const gemPackages = [
    { gems: 100, price: "⭐️ 100", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 220, price: "⭐️ 200", color: "from-green-500 to-green-600", popular: false },
    { gems: 450, price: "⭐️ 400", color: "from-purple-500 to-purple-600", popular: false },
    { gems: 850, price: "⭐️ 750", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 1200, price: "⭐️ 1,000", color: "from-pink-500 to-pink-600", popular: true },
    { gems: 2500, price: "⭐️ 2,000", color: "from-red-500 to-red-600", popular: false },
    { gems: 5200, price: "⭐️ 4,000", color: "from-yellow-500 to-yellow-600", popular: false },
    { gems: 10000, price: "⭐️ 7,500", color: "from-indigo-500 to-indigo-600", popular: false },
  ];

  const subscriptionPlans = [
    {
      name: "Intro",
      price: "⭐️ 50",
      period: "/ 3 days",
      icon: Star,
      color: "from-emerald-500 to-emerald-600",
      features: [
        "**80 Gems**",
        "Multiple Languages",
        "Access to All Features",
        "Top-up Messages"
      ],
      isIntro: true
    },
    {
      name: "Essential",
      oldPrice: "⭐️ 400",
      price: "⭐️ 300",
      period: t('store.month'), 
      icon: Star,
      color: "from-blue-500 to-blue-600",
      features: [
        `**500 ${t('store.monthlyGems')}**`,
        t('store.features.everythingInIntro'),
        t('store.features.noBlurredImages'),
        t('store.features.unlimitedConversations'),
        t('store.features.adFreeExperience'),
        t('store.features.prioritySupport')
      ]
    },
    {
      name: "Plus",
      oldPrice: "⭐️ 800",
      price: "⭐️ 700",
      period: t('store.month'),
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: true,
      features: [
        `**1,200 ${t('store.monthlyGems')}**`,
        t('store.features.everythingInEssential'),
        t('store.features.fasterRenderingSpeed'),
        t('store.features.skipChatQueue'),
        t('store.features.mediaPriorityQueue'),
        t('store.features.enhancedMediaQuality')
      ]
    },
    {
      name: "Premium",
      oldPrice: "⭐️ 1,600",
      price: "⭐️ 1,400",
      period: t('store.month'),
      icon: Sparkles,
      color: "from-yellow-500 to-yellow-600",
      features: [
        `**2,500 ${t('store.monthlyGems')}**`,
        t('store.features.everythingInPlus'),
        t('store.features.advancedAIEngines'),
        t('store.features.extendedChatHistory'),
        t('store.features.ultimatePriorityQueue'),
        t('store.features.earlyAccessNewCharacters'),
        t('store.features.priorityAccessNewFeatures')
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
        <h1 className="text-base font-semibold text-gradient ml-3">{t('store.title', 'Store')}</h1>
      </div>

      <div className="px-4 py-3">
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="subscriptions">{t('store.subscriptions')}</TabsTrigger>
            <TabsTrigger value="gems">{t('store.getGems')}</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card key={plan.name} className="card-premium transition-smooth group p-6 relative">
                  {/* Launch Offer Pill - Don't show for Intro */}
                  {!plan.isIntro && (
                    <div className="absolute top-3 right-3 z-10">
                       <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm flicker">
                         {t('store.launchOffer')}
                       </div>
                    </div>
                  )}

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
                               {t('store.popular')}
                             </div>
                          )}
                        </div>
                         <div className="flex items-baseline gap-2 flex-wrap sm:flex-nowrap">
                           {plan.oldPrice && <span className="text-sm text-muted-foreground/60 line-through whitespace-nowrap">{plan.oldPrice}</span>}
                            <div className="flex items-center gap-1">
                              <span className="text-2xl font-bold text-foreground whitespace-nowrap">{plan.price}</span>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">{plan.period}</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                     {plan.features.map((feature, index) => {
                       const isGems = feature.includes('Monthly Gems') || feature.includes('Gems');
                       const IconToUse = isGems ? Gem : Check;
                      
                      return (
                         <div key={index} className="flex items-center space-x-2">
                           <IconToUse className={`${isGems ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0 ${isGems ? 'text-emerald-400' : 'text-primary'}`} />
                           <span className={`${isGems ? 'text-base' : 'text-sm'} text-foreground`}>
                            {feature.includes('**') ? (
                              <span dangerouslySetInnerHTML={{
                                __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }} />
                            ) : (
                              feature
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                   <Button 
                     variant="premium" 
                     size="lg" 
                     className="w-full"
                     onClick={() => plan.isIntro ? handleIntroSubscribe() : handleSubscribe(plan.name)}
                     disabled={plan.isIntro ? loadingIntro : (loadingSubscriptions[plan.name] || false)}
                   >
                     {plan.isIntro 
                       ? (loadingIntro ? <LoadingSpinner size="sm" /> : "Pay 50⭐")
                       : (loadingSubscriptions[plan.name] ? <LoadingSpinner size="sm" /> : t('store.subscribe'))
                     }
                  </Button>
                </Card>
              );
            })}
          </TabsContent>

           <TabsContent value="gems" className="space-y-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {gemPackages.map((pkg, index) => (
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
                     onClick={() => handleGemPurchase(pkg, index)}
                     disabled={loadingGems[index] || false}
                   >
                     {loadingGems[index] ? <LoadingSpinner size="sm" /> : t('store.buyGems')}
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
