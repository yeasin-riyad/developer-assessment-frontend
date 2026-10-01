"use client";

import {
  useState,
  type ReactNode,
} from "react";

import {
  DashboardSidebar,
} from "./dashboard-sidebar";

import {
  DashboardHeader,
} from "./dashboard-header";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      >
        <SheetContent
          side="left"
          className="w-72 p-0"
        >
          <DashboardSidebar
            onNavigate={() =>
              setMobileSidebarOpen(false)
            }
          />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="md:pl-64">
        <DashboardHeader
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}