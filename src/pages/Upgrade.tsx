import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, Star, Crown, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Upgrade = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (planName: string) => {
    setLoading(true);
    
    // Simulate subscription process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Subscription Started!",
      description: `Welcome to ${planName}! Your free trial has begun.`,
    });
    
    setLoading(false);
    // TODO: Integrate with actual payment processor
  };

  const plans = [
    {
      name: "Basic Premium",
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
      name: "Premium Plus",
      price: "$19.99",
      period: "/month",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: true,
      features: [
        "Everything in Basic Premium",
        "Exclusive content",
        "Advanced AI responses",
        "Custom character creation",
        "Voice messages"
      ]
    },
    {
      name: "Ultimate VIP",
      price: "$39.99",
      period: "/month",
      icon: Sparkles,
      color: "from-yellow-500 to-yellow-600",
      features: [
        "Everything in Premium Plus",
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
      <div className="flex items-center px-4 py-4 border-b border-white/10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-gradient ml-3">Upgrade to Premium</h1>
      </div>

      {/* Trial notice */}
      <div className="px-4 py-4">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <Star className="w-3 h-3 text-primary mr-2" />
            <span className="text-xs text-primary font-medium">
              7-day free trial available
            </span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 pb-6">
        <div className="space-y-4">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.name} className="card-premium transition-smooth group p-6 relative">
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary px-3 py-1 rounded-full text-xs font-bold text-primary-foreground">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gradient">{plan.name}</h3>
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
                  variant={plan.popular ? "premium" : "elegant"} 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : "Start Free Trial"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;