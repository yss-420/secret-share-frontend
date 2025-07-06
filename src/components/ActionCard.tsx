import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

export const ActionCard = ({ title, description, buttonText, onAction }: ActionCardProps) => {
  return (
    <Card className="card-premium transition-smooth group p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gradient mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {description}
      </p>
      
      <Button 
        variant="elegant" 
        size="lg"
        onClick={onAction}
        className="w-full"
      >
        {buttonText}
      </Button>
    </Card>
  );
};