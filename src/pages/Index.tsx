import { useState } from "react";
import { CompanionCard } from "@/components/CompanionCard";
import { ActionCard } from "@/components/ActionCard";
import { NavigationBar } from "@/components/NavigationBar";
import { Header } from "@/components/Header";

const Index = () => {
  const [activeTab, setActiveTab] = useState('characters');

  const companions = [
    {
      name: "Aria",
      description: "Sweet college cutie who loves sharing intimate secrets",
      points: 1250,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjI1IDE1JSAxNSUpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iaHNsKDIxMCA0MCUgOTglKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFyaWE8L3RleHQ+PC9zdmc+"
    },
    {
      name: "Kiara",
      description: "Playful gamer girl eager for late night adventures",
      points: 980,
      image: "https://color-state-95490294.figma.site/_assets/v10/53d3bf1f13b3edbdfa6c5ebde9ccb8c4580055ca.png"
    },
    {
      name: "Luna",
      description: "Enchanting mystic who reads your deepest hidden desires",
      points: 2100,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjI1IDE1JSAxNSUpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iaHNsKDIxMCA0MCUgOTglKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkx1bmE8L3RleHQ+PC9zdmc+"
    },
    {
      name: "Valentina",
      description: "Passionate dancer ready to ignite your wildest fantasies",
      points: 1850,
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&auto=format"
    },
    {
      name: "Scarlett",
      description: "Sophisticated executive who takes complete loving control",
      points: 1650,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&auto=format"
    },
    {
      name: "Natasha",
      description: "Fit beauty who'll motivate your most intense workouts",
      points: 1420,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjI1IDE1JSAxNSUpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iaHNsKDIxMCA0MCUgOTglKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5hdGFzaGE8L3RleHQ+PC9zdmc+"
    },
    {
      name: "Isabella",
      description: "Warm Italian goddess who nurtures your every craving",
      points: 1320,
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&h=600&fit=crop&auto=format"
    },
    {
      name: "Priyanka",
      description: "Bold adventurous spirit ready to explore forbidden pleasures",
      points: 1150,
      image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400&h=600&fit=crop&auto=format"
    }
  ];

  const handleStartChat = (companionName: string) => {
    console.log(`Starting chat with ${companionName}`);
  };

  const handleVisitStore = () => {
    console.log("Visiting store for new characters");
  };

  const handleOpenSettings = () => {
    console.log("Opening personalization settings");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative px-4 pt-6 pb-4">
          <div className="text-center mb-2">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full mr-2 animate-pulse" />
              <span className="text-xs text-destructive font-medium">
                Using demo data - configure Supabase for real data
              </span>
              <button className="ml-2 text-xs text-destructive underline">
                Retry
              </button>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gradient mb-2 leading-tight">
            Choose Your Companion
          </h1>
          <p className="text-muted-foreground text-sm">
            {companions.length} characters available for intimate conversations
          </p>
        </div>
      </div>

      {/* Companions Grid */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {companions.map((companion) => (
            <CompanionCard
              key={companion.name}
              name={companion.name}
              description={companion.description}
              points={companion.points}
              image={companion.image}
              onStartChat={() => handleStartChat(companion.name)}
            />
          ))}
        </div>
      </div>

      {/* Action Cards Section */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <ActionCard
            title="Discover New Characters"
            description="More companions are being added regularly"
            buttonText="Visit Store"
            onAction={handleVisitStore}
          />
          <ActionCard
            title="Personalize Experience"
            description="Customize your chat preferences and style"
            buttonText="Open Settings"
            onAction={handleOpenSettings}
          />
        </div>
      </div>

      {/* Navigation */}
      <NavigationBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
