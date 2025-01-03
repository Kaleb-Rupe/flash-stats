// app/context/SidebarContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
  }, []);

  const toggleCollapse = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", String(newState));
      return newState;
    });

    // Allow time for the animation to complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const setCollapsed = (value: boolean) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsCollapsed(value);
    localStorage.setItem("sidebarCollapsed", String(value));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleCollapse, setCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
