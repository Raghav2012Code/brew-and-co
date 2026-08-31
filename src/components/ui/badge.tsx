import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ink text-paper dark:bg-dark-text-main dark:text-dark-canvas",
        secondary:
          "border-hairline bg-paper-dim text-ink-muted dark:border-dark-hairline dark:bg-dark-card dark:text-dark-text-muted",
        destructive:
          "border-transparent bg-vermillion text-white dark:bg-dark-vermillion",
        outline:
          "text-ink border-hairline dark:text-dark-text-main dark:border-dark-hairline",
        editorial:
          "border-vermillion text-vermillion bg-vermillion/5 dark:border-dark-vermillion dark:text-dark-vermillion dark:bg-dark-vermillion/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
