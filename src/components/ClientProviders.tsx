'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeCustomizerProvider } from "@/components/theme/ThemeProvider";
import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/hooks/useToast";
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Provider store={store}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        <ThemeCustomizerProvider>
          <AuthProvider>
            <ToastProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeCustomizerProvider>
      </NextThemesProvider>
    </Provider>
  );
}
