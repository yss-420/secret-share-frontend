import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CompanionCardProps {
  name: string;
  description: string;
  points: number;
  image: string;
  onStartChat: () => void;
}

export const CompanionCard = ({ name, description, points, image, onStartChat }: CompanionCardProps) => {
  const userCount = Math.floor(points / 100); // Convert points to user count
  
  return (
    <Card className="card-premium transition-smooth group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjI1IDE1JSAxNSUpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iaHNsKDIxMCA0MCUgOTglKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <div className="absolute bottom-3 right-3 backdrop-blur-sm bg-black/50 rounded-full px-2 py-1 flex items-center gap-1">
          <Users className="w-3 h-3 text-white" />
          <span className="text-white font-medium text-xs">
            {userCount}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gradient mb-2">{name}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-3">
          {description}
        </p>
        <Button 
          variant="chat" 
          size="sm"
          onClick={onStartChat}
          className="w-full py-2"
        >
          Start Chatting
        </Button>
      </div>
    </Card>
  );
};