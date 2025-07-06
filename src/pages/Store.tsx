import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { mockGemPackages } from "@/data/mockData";
import { Gem, Crown, Zap } from "lucide-react";
import { useState } from "react";

export default function Store() {
  const [activeTab, setActiveTab] = useState('upgrade');

  const handlePurchase = (packageId: string) => {
    console.log('Purchase package:', packageId);
    // Handle purchase logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted pb-20 pt-16">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Unlimited Energy Section */}
        <Card className="card-premium mb-6 p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gradient mb-2">Unlimited Energy</h2>
            <p className="text-muted-foreground text-sm">
              Never run out of energy again! Chat with your companions anytime, anywhere.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground">$9.99</span>
            <span className="text-sm text-muted-foreground line-through">$19.99</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-accent/20">
              50% OFF
            </Badge>
          </div>
          
          <Button 
            variant="premium" 
            size="lg" 
            className="w-full mb-2"
            onClick={() => handlePurchase('unlimited')}
          >
            <Crown className="w-5 h-5 mr-2" />
            Get Unlimited Energy
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Limited time offer • Cancel anytime
          </p>
        </Card>

        {/* Gem Packages Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Gem className="w-5 h-5 text-blue-400" />
            Gem Packages
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {mockGemPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`card-premium transition-smooth group p-4 relative ${
                  pkg.isPopular ? 'ring-2 ring-primary/50' : ''
                }`}
              >
                {pkg.isPopular && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1"
                  >
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-1">{pkg.name}</h4>
                  <p className="text-lg font-bold text-gradient mb-1">
                    {pkg.gems.toLocaleString()}
                  </p>
                  
                  {pkg.bonus && (
                    <p className="text-xs text-green-400 mb-2">{pkg.bonus}</p>
                  )}
                  
                  <p className="text-sm font-semibold text-foreground mb-3">
                    ${pkg.price}
                  </p>
                  
                  <Button 
                    variant={pkg.isPopular ? "premium" : "elegant"}
                    size="sm"
                    onClick={() => handlePurchase(pkg.id)}
                    className="w-full text-xs"
                  >
                    Buy Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <Card className="card-premium p-4 text-center">
          <h4 className="font-semibold text-sm mb-2">Why Choose Gems?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Unlock premium characters</li>
            <li>• Access exclusive features</li>
            <li>• Support app development</li>
            <li>• No ads, pure experience</li>
          </ul>
        </Card>
      </div>
      
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}