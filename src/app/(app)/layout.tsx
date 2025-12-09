"use client";

import { useSidebar } from "../../context/SidebarContext";
import { Header } from "../../components/layout/Header";
import { Sidebar } from "../../components/layout/Sidebar";
import React, { useEffect } from "react";
import ThemeCustomizer from "../../components/theme/ThemeCustomizer";
import { Footer } from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all space-y-6 duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  );
}
