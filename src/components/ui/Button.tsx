import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-neutral-white hover:bg-primary-600 shadow-sm hover:shadow-md",
        destructive: "bg-red-600 text-neutral-white hover:bg-red-700 shadow-sm hover:shadow-md",
        outline: "border border-secondary-300 bg-neutral-white hover:bg-secondary-50 hover:text-neutral-black hover:border-secondary-400",
        secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 border border-secondary-200",
        ghost: "hover:bg-primary-50 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-600",
        success: "bg-accent-green text-neutral-white hover:bg-accent-green/90 shadow-sm hover:shadow-md",
        warning: "bg-accent-yellow text-neutral-black hover:bg-accent-yellow/90 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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