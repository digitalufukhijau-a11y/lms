import * as React from "react"
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

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  disabled,
  loading,
  children,
  ...props 
}, ref) => {
  return (
    <button
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
    </button>
  )
})
Button.displayName = "Button"

export { Button }
