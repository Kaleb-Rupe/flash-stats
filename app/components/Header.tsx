"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { CryptoPrices } from "@/app/components/CryptoPrices";
import { Button } from "@tremor/react";
import { UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
export default function Header({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      setIsVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (pathname === "/" || pathname.includes("/loading")) {
      return; // Early return if on home or loading page
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, pathname]);

  if (pathname === "/" || pathname.includes("/loading")) {
    return null; // Return null if on home or loading page
  }

  return (
    <header
      className={`h-16 bg-transparent mx-4 md:mx-8 flex items-center justify-between fixed top-0 right-0 ${
        isCollapsed ? "left-16" : isMobile ? "left-0" : "left-64"
      } z-10 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {isMobile ? (
        <Link href="/">
          <h1
            className={`text-xl mt-2 font-bold tracking-tight ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            ⚡ Flash Tracker
          </h1>
        </Link>
      ) : (
        <></>
      )}
      {/* Trading pair prices */}
      {!isMobile ? (
        <div className="flex items-center justify-center space-x-4">
          <CryptoPrices />
        </div>
      ) : (
        <></>
      )}

      {/* User profile section */}
      <div className="flex items-center space-x-4 ">
        {!isMobile ? (
          <>
            <Button
              size="xs"
              color="gray"
              variant="light"
              icon={WalletIcon}
              className="shadow-strong rounded-full p-2 px-4 bg-gray-900 hover:text-zinc-200 transition-colors duration-200"
            >
              Connect Wallet
            </Button>
          </>
        ) : (
          <></>
        )}
        <Button
          size="xs"
          color="gray"
          variant="light"
          icon={UserIcon}
          className="shadow-strong rounded-full p-2 px-4 bg-gray-900 hover:text-zinc-200 transition-colors duration-200"
        >
          Profile
        </Button>
      </div>
    </header>
  );
}
