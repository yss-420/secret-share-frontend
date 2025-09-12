import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeGemsButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
  disabled?: boolean;
}

export const FreeGemsButton = ({ 
  onClick, 
  size = 'sm', 
  variant = 'full',
  className,
  disabled = false
}: FreeGemsButtonProps) => {
  const sizeClasses = {
    sm: variant === 'icon-only' ? 'w-6 h-6 p-1' : 'px-2 py-1 text-xs',
    md: variant === 'icon-only' ? 'w-8 h-8 p-1.5' : 'px-3 py-1.5 text-sm',
    lg: variant === 'icon-only' ? 'w-10 h-10 p-2' : 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5', 
    lg: 'w-4 h-4'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className={cn(
        // Base styles
        "relative font-medium transition-all duration-300",
        sizeClasses[size],
        
        // Green theme with pulsing animation
        "bg-emerald-600 hover:bg-emerald-700 text-white",
        "border border-emerald-500/50",
        "shadow-lg hover:shadow-emerald-500/25",
        
        // Pulse animation
        !disabled && "animate-gem-pulse hover:animate-none",
        
        // Glass effect
        "backdrop-blur-sm bg-emerald-600/90 hover:bg-emerald-700/90",
        
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed animate-none",
        
        className
      )}
    >
      <Gem className={cn(iconSizes[size], "text-emerald-100")} />
      {variant === 'full' && (
        <span className="ml-1 font-semibold">Free Gems</span>
      )}
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-sm bg-emerald-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
};