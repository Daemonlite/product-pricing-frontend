import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-foreground/10',
  {
    variants: {
      shape: {
        rectangle: '',
        circle: 'rounded-full',
        text: 'h-4 w-full max-w-sm',
      },
      size: {
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-8',
        xl: 'h-12',
        '2xl': 'h-16',
      },
    },
    defaultVariants: {
      shape: 'rectangle',
      size: 'md',
    },
  }
);

interface SkeletonProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
  width?: string;
  height?: string;
}

export function Skeleton({ shape, size, className = '', width, height, ...props }: SkeletonProps) {
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`${skeletonVariants({ shape, size })} ${className}`}
      style={style}
      {...props}
    />
  );
}
