// app/[address]/layout.tsx
"use client";

import { useIsMounted } from "@/app/hooks/useIsMounted";
import { motion } from "framer-motion";
import { useSidebar } from "@/app/context/SidebarContext";
import { useMediaQuery } from "react-responsive";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { SidebarProvider } from "@/app/context/SidebarContext";

function MainContent({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();
  const { isCollapsed } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Show a skeleton loader while mounting
  if (!isMounted) {
    return (
      <div className="flex-1 animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-800 mb-4" />
        <div className="space-y-4 p-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`
        flex-1 transition-all duration-300
        ${isMobile ? "m-0" : isCollapsed ? "ml-[5rem]" : "ml-[17rem]"}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <main className={`${isMobile ? "mb-24" : ""}`}>{children}</main>
    </motion.div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
