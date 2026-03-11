import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 min-h-12 md:min-h-14",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-black/20 border border-primary/50",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-primary/30 bg-background/50 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/60",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm border border-secondary-foreground/10",
        ghost: "hover:bg-primary/10 text-foreground min-h-10 md:min-h-12",
        link: "text-primary underline-offset-4 hover:underline min-h-10",
      },
      size: {
        default: "h-12 px-6 py-2 md:h-14 md:px-8 md:text-base",
        sm: "h-10 px-4 min-h-10 text-xs md:text-sm",
        lg: "h-14 px-10 min-h-14 md:h-16 text-lg",
        icon: "h-12 w-12 min-h-12 min-w-12 md:h-14 md:w-14",
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
