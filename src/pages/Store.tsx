
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Gem, Crown, Gift, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { apiService } from "@/services/api";

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

  const handleDailyReward = async () => {
    setLoading(true);
    const success = await apiService.claimDailyReward('dev-user-123');
    if (success) {
      updateGems(10);
    }
    setLoading(false);
  };

  const gemPackages = [
    { gems: 85, price: "$10.00", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 210, price: "$21.00", color: "from-green-500 to-green-600", popular: false },
    { gems: 540, price: "$45.00", color: "from-purple-500 to-purple-600", popular: true },
    { gems: 1360, price: "$95.00", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 2720, price: "$160.00", color: "from-pink-500 to-pink-600", popular: false },
    { gems: 5000, price: "$225.00", color: "from-red-500 to-red-600", popular: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-4 border-b border-white/10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-gradient ml-3">Store</h1>
      </div>

      <div className="px-4 py-6">
        <p className="text-muted-foreground mb-6">Enhance your experience with premium content</p>
        
        {/* Gem Packages */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Gem Packages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

        {/* VIP Membership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="card-premium transition-smooth group p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gradient">VIP Membership</h3>
                  <p className="text-sm text-muted-foreground">Unlock exclusive content & features</p>
                </div>
              </div>
              <Button 
                variant="elegant" 
                size="sm" 
                className="bg-slate-600 hover:bg-slate-500 text-white border-none"
                onClick={() => navigate('/upgrade')}
              >
                Learn More
              </Button>
            </div>
          </Card>

          {/* Daily Rewards */}
          <Card className="card-premium transition-smooth group p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gradient">Daily Rewards</h3>
                  <p className="text-sm text-muted-foreground">Claim your free daily gems</p>
                </div>
              </div>
              <Button 
                variant="elegant" 
                size="sm" 
                className="bg-slate-600 hover:bg-slate-500 text-white border-none"
                onClick={handleDailyReward}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Claim"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Store;
