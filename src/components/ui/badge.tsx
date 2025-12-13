// components/ui/badge.tsx
import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'default' | 'lg'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Variant classes
    const variantClasses = {
      default: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
      secondary: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
      destructive: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800',
      outline: 'bg-transparent text-gray-800 border-gray-300 dark:text-gray-300 dark:border-gray-600',
      success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800',
      info: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-800',
    }

    // Size classes
    const sizeClasses = {
      sm: 'px-1.5 py-0.5 text-xs',
      default: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    }

    // Combine classes
    const combinedClasses = [
      'inline-flex items-center rounded-full border font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    ].filter(Boolean).join(' ')

    return (
      <div
        ref={ref}
        className={combinedClasses}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }