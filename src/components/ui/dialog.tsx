import React, { useEffect, useRef, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from './button';

const dialogVariants = cva(
  'relative bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50',
  {
    variants: {
      size: {
        sm: 'max-w-sm w-full',
        md: 'max-w-md w-full',
        lg: 'max-w-lg w-full',
        xl: 'max-w-xl w-full',
        '2xl': 'max-w-2xl w-full',
        '3xl': 'max-w-3xl w-full',
        '4xl': 'max-w-4xl w-full',
        full: 'w-full',
      },
      color: {
        none: '',
        primary: 'bg-primary',
        error: 'bg-error',
        success: 'bg-success',
        warning: 'bg-warning',
        info: 'bg-info',
        secondary: 'bg-secondary',
        muted: 'bg-muted',
        accent: 'bg-accent',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'none',
    },
  }
);

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  color?: 'none' | 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary' | 'muted' | 'accent' | 'destructive';
}

export function Dialog({ isOpen, onClose, title, children, actions, size = 'md', color = 'none' }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-muted/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        ref={dialogRef}
        className={dialogVariants({ size, className: 'overflow-y-auto max-h-[600px] min-h-[200px]' })}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-border ${color !== 'none' ? `bg-${color}` : ''}`}>
          {title && (
            <h2 id="dialog-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto p-1 cursor-pointer hover:bg-foreground/10 transition-colors rounded-full"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 ">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="flex items-center justify-end gap-2 p-4 bg-muted">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
