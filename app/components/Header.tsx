"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CryptoPrices } from "@/app/components/CryptoPrices";

export default function Header({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  // Don't show sidebar on home page or loading page
  if (pathname === "/" || pathname.includes("/loading")) {
    return null;
  }

  return (
    <header
      className={`h-16 bg-transparent px-4 md:px-8 flex items-center justify-between fixed top-0 right-0 ${
        isCollapsed ? "left-16" : "left-64"
      } z-10`}
    >
      {/* Trading pair prices */}
      <div className="flex items-center justify-center space-x-4">
        <CryptoPrices />
      </div>

      {/* User profile section */}
      <div className="flex items-center space-x-4">
        <button className="bg-zinc-800 px-3 py-1.5 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
          Connect Wallet
        </button>
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
          👤
        </div>
      </div>
    </header>
  );
}
