import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-paper hover:bg-ink/90 dark:bg-dark-text-main dark:text-dark-canvas dark:hover:bg-dark-text-main/90 active:scale-[0.99]",
        destructive:
          "bg-vermillion text-white hover:bg-vermillion/90 dark:bg-dark-vermillion dark:hover:bg-dark-vermillion/90 active:scale-[0.99]",
        outline:
          "border border-hairline bg-transparent hover:bg-paper-dim text-ink dark:border-dark-hairline dark:hover:bg-dark-subtle dark:text-dark-text-main",
        secondary:
          "bg-paper-dim text-ink hover:bg-paper-dark dark:bg-dark-card dark:text-dark-text-main dark:hover:bg-dark-card-hover",
        ghost: "hover:bg-paper-dim text-ink dark:text-dark-text-main dark:hover:bg-dark-subtle",
        link: "text-ink underline-offset-4 hover:underline dark:text-dark-text-main",
        editorial:
          "bg-ink text-paper hover:bg-vermillion transition-all duration-200 dark:bg-dark-text-main dark:text-dark-canvas dark:hover:bg-dark-vermillion dark:hover:text-white active:scale-[0.99]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-13 px-8 text-sm",
        icon: "h-9 w-9",
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
