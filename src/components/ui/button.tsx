import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex whitespace-nowrap items-center justify-center text-sm cursor-pointer font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-ring',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
        destructive: 'bg-red-600 text-white hover:bg-destructive/90 focus:ring-ring',
        outline: 'border border-input bg-transparent hover:bg-accent focus:ring-ring',
        ghost: 'hover:bg-accent/10 hover:text-accent focus:ring-ring',
        tonal: '',
      },
      color: {
        primary: '',
        success: '',
        error: '',
        warning: '',
        info: '',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      // Solid variants with colors
      {
        variant: 'primary',
        color: 'success',
        class: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      },
      {
        variant: 'primary',
        color: 'error',
        class: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      {
        variant: 'primary',
        color: 'warning',
        class: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
      },
      {
        variant: 'primary',
        color: 'info',
        class: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
      },
      
      // Outline variants with colors
      {
        variant: 'outline',
        color: 'primary',
        class: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
      },
      {
        variant: 'outline',
        color: 'success',
        class: 'border border-green-600 bg-transparent text-green-600 hover:bg-green-600/10',
      },
      {
        variant: 'outline',
        color: 'error',
        class: 'border border-red-600 bg-transparent text-red-600 hover:bg-red-600/10',
      },
      {
        variant: 'outline',
        color: 'warning',
        class: 'border border-yellow-600 bg-transparent text-yellow-600 hover:bg-yellow-600/10',
      },
      {
        variant: 'outline',
        color: 'info',
        class: 'border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600/10',
      },
      
      // Ghost variants with colors
      {
        variant: 'ghost',
        color: 'success',
        class: 'hover:bg-green-600/10 hover:text-green-700 focus:ring-green-500 text-green-600',
      },
      {
        variant: 'ghost',
        color: 'error',
        class: 'hover:bg-red-600/10 hover:text-red-700 focus:ring-red-500 text-red-600',
      },
      {
        variant: 'ghost',
        color: 'warning',
        class: 'hover:bg-yellow-600/10 hover:text-yellow-700 focus:ring-yellow-500 text-yellow-600',
      },
      {
        variant: 'ghost',
        color: 'info',
        class: 'hover:bg-blue-600/10 hover:text-blue-700 focus:ring-blue-500 text-blue-600',
      },
      
      // Tonal variants with colors
      {
        variant: 'tonal',
        color: 'success',
        class: 'bg-green-600/10 text-green-700 hover:bg-green-600/20 focus:ring-green-500',
      },
      {
        variant: 'tonal',
        color: 'error',
        class: 'bg-red-600/10 text-red-700 hover:bg-red-600/20 focus:ring-red-500',
      },
      {
        variant: 'tonal',
        color: 'warning',
        class: 'bg-yellow-600/10 text-yellow-700 hover:bg-yellow-600/20 focus:ring-yellow-500',
      },
      {
        variant: 'tonal',
        color: 'info',
        class: 'bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 focus:ring-blue-500',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      color: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function Button({ variant, size, rounded, color, className, children, loading, startIcon, endIcon, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, rounded, color, className })} disabled={loading} {...props}>
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {startIcon && <span className={children ? 'mr-2' : ''}>{startIcon}</span>}
          {children}
          {endIcon && <span className={children ? 'ml-2' : ''}>{endIcon}</span>}
        </>
      )}
    </button>
  );
}