// app/[address]/layout.tsx
"use client";

import { useMediaQuery } from "react-responsive";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { useSidebar } from "@/app/context/SidebarContext";

import { motion } from "framer-motion";

function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
      <main className={`${isMobile ? "mb-20" : ""}`}>{children}</main>
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
