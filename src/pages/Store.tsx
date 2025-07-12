import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Gem, Crown, Gift, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Store = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const navigate = useNavigate();

  const gemPackages = [
    { gems: 85, price: "$0.99", color: "from-blue-500 to-blue-600", popular: false },
    { gems: 210, price: "$1.99", color: "from-green-500 to-green-600", popular: false },
    { gems: 540, price: "$4.99", color: "from-purple-500 to-purple-600", popular: true },
    { gems: 1360, price: "$9.99", color: "from-orange-500 to-orange-600", popular: false },
    { gems: 2720, price: "$19.99", color: "from-red-500 to-red-600", popular: false },
    { gems: 5000, price: "$29.99", color: "from-yellow-500 to-yellow-600", popular: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-4 border-b border-white/10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-gradient ml-3">Store</h1>
      </div>

      {/* Gem Packages */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Gem Packages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gemPackages.map((pkg) => (
            <Card key={pkg.gems} className="card-premium transition-smooth group p-4 text-center relative">
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary px-2 py-1 rounded-full text-xs font-bold text-primary-foreground">
                    Popular
                  </div>
                </div>
              )}
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-foreground mb-1">{pkg.gems.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mb-3">Gems</div>
              <Button variant="elegant" size="sm" className="w-full">
                {pkg.price}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* VIP Membership */}
      <div className="px-4 mb-6">
        <Card className="card-premium transition-smooth group p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">VIP Membership</h3>
                <p className="text-xs text-muted-foreground">Unlimited conversations & exclusive content</p>
              </div>
            </div>
            <Button variant="premium" size="sm">
              Upgrade
            </Button>
          </div>
        </Card>
      </div>

      {/* Daily Rewards */}
      <div className="px-4 mb-6">
        <Card className="card-premium transition-smooth group p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">Daily Rewards</h3>
                <p className="text-xs text-muted-foreground">Claim your free gems every day</p>
              </div>
            </div>
            <Button variant="elegant" size="sm">
              Claim
            </Button>
          </div>
        </Card>
      </div>

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Store;