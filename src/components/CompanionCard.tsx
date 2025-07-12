import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CompanionCardProps {
  name: string;
  description: string;
  points: number;
  image: string;
  onClick: () => void;
}

export const CompanionCard = ({ name, description, points, image, onClick }: CompanionCardProps) => {
  return (
    <Card 
      className="card-premium transition-smooth group overflow-hidden cursor-pointer rounded-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105 rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjI1IDE1JSAxNSUpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iaHNsKDIxMCA0MCUgOTglKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <div className="absolute bottom-2 right-2 backdrop-blur-sm bg-black/60 rounded-lg px-1.5 py-0.5 flex items-center gap-1">
          <Users className="w-2.5 h-2.5 text-white" />
          <span className="text-white font-medium text-xs">
            {points.toLocaleString()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-bold text-gradient mb-1.5 line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
};