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
    <header className="flex items-center justify-between px-4 py-3 bg-card/30 backdrop-blur-sm border-b border-border/50">
      {/* Left side - Profile and Brand */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
          <img 
            src="/lovable-uploads/19b66d34-44b1-4308-ad36-a5bb744b2815.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground">Secret Share</h1>
          <p className="text-xs text-muted-foreground">AI Chat Platform</p>
        </div>
      </div>

      {/* Right side - Gems, Energy, and Menu */}
      <div className="flex items-center space-x-2">
        {/* Gems */}
        <div className="flex items-center space-x-1 bg-primary/15 px-2 py-1 rounded-full">
          <Gem className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-foreground">0</span>
        </div>

        {/* Energy */}
        <div className="flex items-center space-x-1 bg-accent/15 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium text-foreground">100/50</span>
        </div>

        {/* Plus button */}
        <Button size="sm" variant="outline" className="w-7 h-7 p-0 border-border/50">
          <Plus className="w-3 h-3" />
        </Button>

        {/* Menu dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
              <MoreVertical className="w-3 h-3" />
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