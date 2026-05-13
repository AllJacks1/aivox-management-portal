"use client";

import { useState } from "react";
import Sidebar from "@/components/sections/Navbar";
import Header from "@/components/sections/Header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FF]">
      {/* Sidebar receives collapse state */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content area - shrinks/grows with sidebar */}
      <div
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {/* Header with mobile menu button */}
        <Header
          showMenuButton={true}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}