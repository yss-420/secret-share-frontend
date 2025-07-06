import { CompanionCard } from "@/components/CompanionCard";
import { ActionCard } from "@/components/ActionCard";
import { NavigationBar } from "@/components/NavigationBar";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCharacters } from "@/data/mockData";
import { Search, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('characters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fantasy', 'Cheerful', 'Wise', 'Sci-Fi', 'Mysterious', 'Adventure'];

  const filteredCharacters = mockCharacters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || character.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartChat = (characterId: string) => {
    navigate(`/chat?character=${characterId}`);
  };

  const handleCreateCharacter = () => {
    console.log('Create character');
  };

  const handleDiscoverMore = () => {
    navigate('/store');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted pb-20 pt-16">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search companions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "premium" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Your Character Card */}
        <Card className="card-premium mb-6 p-4 border-dashed border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Create Your Character</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Design your perfect companion
              </p>
              <Button 
                variant="elegant" 
                size="sm"
                onClick={handleCreateCharacter}
              >
                Start Creating
              </Button>
            </div>
          </div>
        </Card>

        {/* Companions Grid */}
        <div className="grid gap-6 mb-6">
          {filteredCharacters.map((character) => (
            <div key={character.id} className="relative">
              <CompanionCard
                name={character.name}
                description={character.description}
                points={character.points}
                image={character.image}
                onStartChat={() => handleStartChat(character.id)}
              />
              {character.isLocked && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white rounded" />
                    </div>
                    <p className="text-white text-sm font-semibold">Locked</p>
                    <Button 
                      variant="premium" 
                      size="sm"
                      onClick={() => navigate('/store')}
                      className="mt-2"
                    >
                      Unlock Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Discover More */}
        <ActionCard
          title="Discover Premium Characters"
          description="Unlock exclusive companions with special abilities and personalities."
          buttonText="Browse Store"
          onAction={handleDiscoverMore}
        />
      </div>
      
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
