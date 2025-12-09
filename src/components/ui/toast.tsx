'use client'

import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const toastVariants = cva(
  'fixed z-50 px-4 py-2.5 rounded-md text-white flex flex-col items-start max-w-xs w-full pointer-events-auto',
  {
    variants: {
      variant: {
        success: 'bg-green-600/40',
        error: 'bg-red-600/40',
        info: 'bg-blue-600/40',
        warning: 'bg-yellow-600/40',
      },
      position: {
        'bottom-right': 'bottom-5 right-5',
        'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2',
        'top-left': 'top-5 left-5',
        'top-right': 'top-5 right-5',
        'bottom-left': 'bottom-5 left-5',
      },
    },
    defaultVariants: {
      variant: 'info',
      position: 'top-right',
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  duration?: number;
  position?: 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'bottom-left';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, variant, position = 'top-right', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z" />
          </svg>
        );
      case 'info':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 5a7 7 0 110 14 7 7 0 010-14z" />
          </svg>
        );
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getInitialTransform = () => {
    if (position === 'bottom-center') return 'translateX(-50%) translateY(100%)';
    if (position?.startsWith('bottom-')) return 'translateY(-100%)';
    return 'translateY(100%)';
  };

  const getFinalTransform = () => {
    if (position === 'bottom-center') return 'translateX(-50%) translateY(0)';
    return 'translateY(0)';
  };

  return (
    <div
      className={toastVariants({ variant, position })}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ animation: 'toast-slide-in 0.3s ease forwards' }}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-0.5">
          {renderIcon()}
          <span className="font-medium capitalize">{variant}</span>
        </div>
      </div>
      <div className="ml-6 mt-0.5 text-sm font-normal">
        <span>{message}</span>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close notification"
        className="absolute top-1 right-3 text-white hover:bg-white/10 rounded-full p-1 focus:outline-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <style jsx>{`
        @keyframes toast-slide-in {
          0% {
            opacity: 0;
            transform: ${getInitialTransform()};
          }
          100% {
            opacity: 1;
            transform: ${getFinalTransform()};
          }
        }
      `}</style>
    </div>
  );
};
