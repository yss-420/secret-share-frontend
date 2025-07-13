
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-white/5 hover:bg-white/10 hover:text-accent-foreground backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/5 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "btn-premium text-white",
        elegant: "relative overflow-hidden rounded-lg bg-card text-card-foreground border border-border/50 hover:border-primary/50 transition-smooth hover:bg-card/80 hover:scale-[1.02]",
        chat: "relative overflow-hidden rounded-lg px-6 py-3 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/30 hover:border-primary/60 transition-smooth hover:from-primary/30 hover:to-accent/30 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-9 px-3 rounded-lg",
        lg: "h-11 px-8 rounded-lg",
        xl: "h-14 px-10 text-base font-semibold rounded-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
