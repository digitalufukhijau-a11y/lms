import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    primary: "bg-brand-500 text-white hover:bg-brand-700 shadow-sm transition-all duration-150",
    ghost: "border border-border bg-transparent text-ink-600 hover:bg-surface-2 transition-colors duration-150",
    danger: "bg-danger-500 text-white hover:bg-danger-500/90 transition-colors duration-150",
    link: "text-brand-500 hover:underline underline-offset-4 transition-colors duration-150",
  },
  size: {
    default: "h-10 px-4 py-2 rounded-lg text-base",
    sm: "h-9 px-3 py-2 rounded-lg text-sm",
    lg: "h-11 px-6 py-2 rounded-lg text-base",
    icon: "h-10 w-10 rounded-lg p-2",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
  loading?: boolean
}

/**
 * Button component with support for multiple variants and sizes.
 * 
 * @param asChild - If true, renders as Slot component for composition.
 *                  IMPORTANT: When asChild=true, the loading prop is ignored
 *                  because Slot requires exactly one child element.
 * @param loading - Shows loading spinner and disables button.
 *                  Only works when asChild=false.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = "primary", 
  size = "default",
  asChild = false,
  disabled,
  loading,
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  // When asChild is true, we cannot add loading spinner as it creates multiple children
  // Slot component requires exactly one child, so we skip loading state
  if (asChild) {
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-70 disabled:cursor-not-allowed",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
  
  // When asChild is false, we can safely add loading spinner
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-70 disabled:cursor-not-allowed",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button }
