import { Gem, Zap, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border">
      {/* Left side - Profile and Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <img 
            src="/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Secret Share</h1>
          <p className="text-xs text-muted-foreground">AI Chat Platform</p>
        </div>
      </div>

      {/* Right side - Gems, Energy, and Menu */}
      <div className="flex items-center space-x-4">
        {/* Gems */}
        <div className="flex items-center space-x-1 bg-primary/10 px-3 py-1.5 rounded-full">
          <Gem className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">250</span>
        </div>

        {/* Energy */}
        <div className="flex items-center space-x-1 bg-secondary/10 px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-foreground">50/50</span>
        </div>

        {/* Plus button */}
        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
          <Plus className="w-4 h-4" />
        </Button>

        {/* Menu dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Purchase History</DropdownMenuItem>
            <DropdownMenuItem>Restore Purchase</DropdownMenuItem>
            <DropdownMenuItem>Contact Support</DropdownMenuItem>
            <DropdownMenuItem>Billing Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};