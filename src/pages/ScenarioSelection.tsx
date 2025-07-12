
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { openTelegramChat } from "@/utils/telegramDeepLink";
import { useToast } from "@/hooks/use-toast";

const scenarios = {
  "Aria": [
    { name: "Dorm Room", description: "A cozy private space for intimate conversations", image: "/lovable-uploads/1eac8510-8e36-4bb1-8c7a-a9f8f8e6eda3.png" },
    { name: "Library", description: "Quiet study sessions and intellectual discussions", image: "/lovable-uploads/50f94529-fde3-4503-a70e-fd535d66b29c.png" }
  ],
  "Kiara": [
    { name: "Gaming Cafe", description: "Level up together in virtual worlds", image: "/lovable-uploads/dc15c973-9dbe-4e7b-a777-d7a81585ba62.png" },
    { name: "Gaming Room", description: "Casual meetups over your favorite brew", image: "/lovable-uploads/025face0-1f9c-44c5-9dd5-4ca5ee5020cb.png" }
  ],
  "Luna": [
    { name: "Fortune Teller Shop", description: "Enchanted conversations under starlight", image: "/lovable-uploads/4fc5bc2f-3332-4366-b643-7d242a70219f.png" },
    { name: "Tarot Tent", description: "Romantic evening chats with city views", image: "/lovable-uploads/09630fd7-9981-4183-9829-86e68672db83.png" }
  ],
  "Valentina": [
    { name: "Dance Studio", description: "Express yourself through movement and rhythm", image: "/lovable-uploads/003d5bde-12bd-4f9c-bb6d-5f6851403243.png" },
    { name: "Latin Club", description: "Elevated conversations above the city", image: "/lovable-uploads/a9b6decd-ce26-4a00-a92b-4b3e22bfe115.png" }
  ],
  "Scarlett": [
    { name: "CEO Office", description: "Professional conversations in a sophisticated setting", image: "/lovable-uploads/d9ecc33d-d09a-40a7-bfb2-88d8a364fc49.png" },
    { name: "Hotel Room", description: "Intimate luxury conversations with city views", image: "/lovable-uploads/ee761090-99e3-4139-82ee-c831f51cbddb.png" }
  ],
  "Natasha": [
    { name: "Private Gym", description: "Fitness motivation and wellness conversations", image: "/lovable-uploads/92e25a99-523c-4c8d-a7a9-392d2097a740.png" },
    { name: "Yoga Studio", description: "Peaceful mindfulness and meditation sessions", image: "/lovable-uploads/caa59d97-289f-4c02-b5a2-4aa74dd9612c.png" }
  ],
  "Isabella": [
    { name: "Kitchen", description: "Cozy cooking sessions and intimate culinary conversations", image: "/lovable-uploads/186f6487-1060-44c9-9cd4-76948d7d3a62.png" },
    { name: "Wine Cellar", description: "Sophisticated tastings and deep conversations", image: "/lovable-uploads/8fb8fa40-1f8c-4100-85cf-70ab6d503156.png" }
  ],
  "Priyanka": [
    { name: "Chai Stall", description: "Authentic street-side conversations over warm chai", image: "/lovable-uploads/eb059d9a-7465-4767-b164-2994a6e730e3.png" },
    { name: "Wedding Hall", description: "Celebrate life's beautiful moments together", image: "/lovable-uploads/6392af8b-95ef-405a-99b3-27c2b6394070.png" }
  ]
};

export default function ScenarioSelection() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const characterScenarios = name ? scenarios[name as keyof typeof scenarios] || [] : [];

  const handleScenarioSelect = (scenarioName: string) => {
    if (!name) return;
    
    try {
      openTelegramChat(name, scenarioName);
      toast({
        title: "Opening Telegram Chat",
        description: `Starting ${scenarioName} scenario with ${name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open Telegram chat. Please try again.",
        variant: "destructive",
      });
    }
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
