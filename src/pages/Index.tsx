
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompanionCard } from "@/components/CompanionCard";
import { NavigationBar } from "@/components/NavigationBar";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useDevMode } from "@/hooks/useDevMode";

const Index = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const navigate = useNavigate();
  const { user, telegramUser, isLoading, isAuthenticated } = useAuth();
  const { isDevMode } = useDevMode();

  const companions = [
    {
      name: "Aria",
      description: "Sweet college cutie who loves sharing intimate secrets",
      points: 1250,
      image: "/lovable-uploads/ed5f65c3-2811-4c61-95f0-bb60d3e98f47.png"
    },
    {
      name: "Kiara",
      description: "Playful gamer girl eager for late night adventures",
      points: 980,
      image: "/lovable-uploads/fb446c37-8762-4d69-9f23-3a78cc53c8e9.png"
    },
    {
      name: "Luna",
      description: "Enchanting mystic who reads your deepest hidden desires",
      points: 2100,
      image: "/lovable-uploads/f4cb3191-0f77-4b97-9c96-65a954a5dec7.png"
    },
    {
      name: "Valentina",
      description: "Passionate dancer ready to ignite your wildest fantasies",
      points: 1850,
      image: "/lovable-uploads/5d917985-c59f-4815-9c31-fbc3bb34a88d.png"
    },
    {
      name: "Scarlett",
      description: "Sophisticated executive who takes complete loving control",
      points: 1650,
      image: "/lovable-uploads/ff507a9a-caa3-4185-b987-c793493f0fbe.png"
    },
    {
      name: "Natasha",
      description: "Fit beauty who'll motivate your most intense workouts",
      points: 1420,
      image: "/lovable-uploads/a966a842-02ab-4922-a9dd-8ea904e06504.png"
    },
    {
      name: "Isabella",
      description: "Warm Italian goddess who nurtures your every craving",
      points: 1320,
      image: "/lovable-uploads/cf3cd7ac-d0a8-4d28-8cee-c3f7b9207c26.png"
    },
    {
      name: "Priyanka",
      description: "Bold adventurous spirit ready to explore forbidden pleasures",
      points: 1150,
      image: "/lovable-uploads/0c5dca49-a71d-43d9-a495-c79a2079aab2.png"
    }
  ];

  const handleCharacterSelect = (companionName: string) => {
    navigate(`/character/${companionName}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'upgrade') {
      navigate('/upgrade');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative px-4 pt-6 pb-4">
          <div className="text-center mb-2">
            {user && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                <span className="text-xs text-primary font-medium">
                  Welcome, {user.nickname || user.user_name || 'Developer'}!
                  {isDevMode && ' (Dev Mode)'}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-white mb-2 leading-tight">
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
                onClick={() => handleCharacterSelect(companion.name)}
              />
            ))}
        </div>
      </div>

      {/* Navigation */}
      <NavigationBar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default Index;
