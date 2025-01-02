// app/components/Header.tsx
"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@tremor/react";
import { UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { useSidebar } from "@/app/context/SidebarContext";
import { CryptoPrices } from "@/app/components/CryptoPrices";

// Memoized button components for better performance
const ConnectWalletButton = memo(() => (
  <Button
    size="xs"
    color="gray"
    variant="light"
    icon={WalletIcon}
    className="shadow-strong rounded-full p-2 px-4 bg-gray-900 hover:text-zinc-200 transition-colors duration-200"
  >
    Connect Wallet
  </Button>
));

const ProfileButton = memo(() => (
  <Button
    size="xs"
    color="gray"
    variant="light"
    icon={UserIcon}
    className="shadow-strong rounded-full p-2 px-4 bg-gray-900 hover:text-zinc-200 transition-colors duration-200"
  >
    Profile
  </Button>
));

ConnectWalletButton.displayName = "ConnectWalletButton";
ProfileButton.displayName = "ProfileButton";

function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { isCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);

  // Handle scroll with debounce for better performance
  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    // Only update if scroll position has changed significantly (by 5px or more)
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
      setIsVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    setMounted(true);

    if (pathname === "/" || pathname.includes("/loading")) {
      return;
    }

    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [handleScroll, pathname]);

  // Prevent hydration issues
  if (!mounted || pathname === "/" || pathname.includes("/loading")) {
    return null;
  }

  return (
    <header
      className={`
        h-16 bg-transparent fixed top-0 right-0
        transition-all duration-300 z-10
        mx-4 md:mx-8 
        flex items-center justify-between
        ${isMobile ? "left-0" : isCollapsed ? "left-[5rem]" : "left-[17rem]"}
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {isMobile && (
        <Link href="/">
          <h1 className="text-xl mt-2 font-bold tracking-tight block">
            ⚡ Flash Stats
          </h1>
        </Link>
      )}

      {/* Trading pair prices */}
      {!isMobile && (
        <div className="flex items-center justify-center space-x-4">
          <CryptoPrices />
        </div>
      )}

      {/* User profile section */}
      <div className="flex items-center space-x-4 mt-2">
        {!isMobile && <ConnectWalletButton />}
        <ProfileButton />
      </div>
    </header>
  );
}

// Utility function for scroll debouncing
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default memo(Header);
