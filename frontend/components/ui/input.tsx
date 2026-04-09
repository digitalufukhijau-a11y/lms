import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border bg-surface-0 px-3 py-2 text-base",
        "placeholder:text-ink-400",
        "focus:outline-none focus:ring-2 focus:ring-brand-50 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-400",
        "transition-colors duration-150",
        error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
        !error && "border-border",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
