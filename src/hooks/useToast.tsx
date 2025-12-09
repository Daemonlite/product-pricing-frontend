'use client'

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Toast } from '@/components/ui/toast';

interface ToastContextType {
  showToast: (message: string, variant: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    variant: 'success' | 'error' | 'info' | 'warning';
    duration: number;
  }>>([]);

  // Use useRef to create a counter that persists across renders
  const toastCounter = useRef(0);

  const showToast = (message: string, variant: 'success' | 'error' | 'info' | 'warning', duration = 3000) => {
    const id = `${Date.now()}-${toastCounter.current++}`;
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};