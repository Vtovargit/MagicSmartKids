import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-neutral-white hover:bg-primary-600",
        secondary: "border-secondary-200 bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
        destructive: "border-transparent bg-red-600 text-neutral-white hover:bg-red-700",
        outline: "text-neutral-black border-secondary-200 hover:bg-secondary-50",
        success: "border-transparent bg-accent-green text-neutral-white hover:bg-accent-green/90",
        warning: "border-transparent bg-accent-yellow text-neutral-black hover:bg-accent-yellow/90",
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