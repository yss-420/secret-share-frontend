
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Gem, Crown, ArrowLeft, Star, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Store = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateGems } = useUserData();

  const handleGemPurchase = async (gemPackage: typeof gemPackages[0]) => {
    setLoading(true);
    const success = await apiService.purchaseGems({
      gems: gemPackage.gems,
      price: gemPackage.price,
      package_type: gemPackage.popular ? 'popular' : 'standard'
    });
    
    if (success) {
      updateGems(gemPackage.gems);
    }
    setLoading(false);
  };

  const handleSubscribe = async (planName: string) => {
    setLoading(true);
    
    // Simulate subscription process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Subscription Started!",
      description: `Welcome to ${planName}! Your subscription has begun.`,
    });
    
    setLoading(false);
    // TODO: Integrate with actual payment processor
  };

  const gemPackages = [
    { gems: 85, price: "$10.00", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 210, price: "$21.00", color: "from-green-500 to-green-600", popular: false },
    { gems: 540, price: "$45.00", color: "from-purple-500 to-purple-600", popular: true },
    { gems: 1360, price: "$95.00", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 2720, price: "$160.00", color: "from-pink-500 to-pink-600", popular: false },
    { gems: 5000, price: "$225.00", color: "from-red-500 to-red-600", popular: false },
  ];

  const subscriptionPlans = [
    {
      name: "Essential",
      price: "$9.99",
      period: "/month",
      icon: Star,
      color: "from-blue-500 to-blue-600",
      features: [
        "Unlimited conversations",
        "Premium characters",
        "Ad-free experience",
        "Priority support"
      ]
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: true,
      features: [
        "Everything in Essential",
        "Exclusive content",
        "Advanced AI responses",
        "Custom character creation",
        "Voice messages"
      ]
    },
    {
      name: "Premium",
      price: "$39.99",
      period: "/month",
      icon: Sparkles,
      color: "from-yellow-500 to-yellow-600",
      features: [
        "Everything in Pro",
        "VIP-only characters",
        "Unlimited gems",
        "Priority new features",
        "Personal assistant",
        "Custom scenarios"
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

      <div className="px-4 py-6">
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
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
                        <span className="text-sm text-foreground">{feature}</span>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gemPackages.map((pkg) => (
                <Card key={pkg.gems} className="card-premium transition-smooth group p-6 text-center relative">
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                    <Gem className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <Gem className="w-4 h-4 text-primary mr-1" />
                    <span className="text-xl font-bold text-foreground">{pkg.gems.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Gems</div>
                  <div className="text-xl font-bold text-green-400 mb-4">{pkg.price}</div>
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
