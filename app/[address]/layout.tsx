"use client";

// app/[address]/layout.tsx
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar - Fixed position */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content wrapper - Fills remaining space */}
      <div
        className={`flex-1 m-8 transition-all duration-300 ${
          isCollapsed ? "ml-28" : "ml-72"
        }`}
      >
        {/* Header - Fixed position */}
        <Header isCollapsed={isCollapsed} />

        {/* Main content - Scrollable with padding for fixed header */}
        <main>{children}</main>
      </div>
    </div>
  );
}
