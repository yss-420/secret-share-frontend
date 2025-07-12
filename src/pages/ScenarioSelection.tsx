import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const scenarios = {
  "Aria": [
    { name: "Dorm Room", description: "A cozy private space for intimate conversations", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" },
    { name: "Library", description: "Quiet study sessions and intellectual discussions", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" }
  ],
  "Kiara": [
    { name: "Gaming Setup", description: "Level up together in virtual worlds", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" },
    { name: "Coffee Shop", description: "Casual meetups over your favorite brew", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" }
  ],
  "Luna": [
    { name: "Mystic Garden", description: "Enchanted conversations under starlight", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" },
    { name: "Moonlit Balcony", description: "Romantic evening chats with city views", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" }
  ],
  "Valentina": [
    { name: "Dance Studio", description: "Express yourself through movement and rhythm", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" },
    { name: "Rooftop Terrace", description: "Elevated conversations above the city", image: "/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" }
  ]
};

export default function ScenarioSelection() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  
  const characterScenarios = name ? scenarios[name as keyof typeof scenarios] || [] : [];

  const handleScenarioSelect = (scenarioName: string) => {
    // Navigate to chat with character and scenario
    console.log(`Starting chat with ${name} in ${scenarioName}`);
    // For now, just log - you can implement chat page later
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient mb-2">
            Choose a Scenario with {name}
          </h1>
          <p className="text-muted-foreground">
            Select the perfect setting for your conversation
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characterScenarios.map((scenario) => (
            <Card 
              key={scenario.name}
              className="card-premium transition-smooth group overflow-hidden cursor-pointer rounded-lg"
              onClick={() => handleScenarioSelect(scenario.name)}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img 
                  src={scenario.image}
                  alt={scenario.name}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105 rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gradient mb-2">{scenario.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}