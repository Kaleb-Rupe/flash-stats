// app/components/Sidebar.tsx
"use client";

import React, { useRef, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, spring } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  ChevronRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useSidebar } from "@/app/context/SidebarContext";

const exchanges = [
  {
    name: "Flash Trade",
    href: "https://beast.flash.trade?referral=Beast_2972",
    icon: BoltIcon,
  },
];

// Memoized navigation items
const navigationItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: (address: string) => `/${address}`,
    icon: HomeIcon,
  },
  {
    id: "transactions",
    name: "Transactions",
    href: (address: string) => `/${address}/transactions`,
    icon: TableCellsIcon,
  },
  {
    id: "charts",
    name: "Charts",
    href: (address: string) => `/${address}/charts`,
    icon: ChartBarIcon,
  },
] as const;

// Memoized navigation link component
const NavLink = memo(function NavLink({
  item,
  isActive,
  isCollapsed,
  address,
}: {
  item: (typeof navigationItems)[number];
  isActive: boolean;
  isCollapsed: boolean;
  address: string;
}) {
  return (
    <Link
      href={item.href(address)}
      className={`
        flex items-center px-4 py-3 text-sm font-medium rounded-lg
        transition-colors duration-200
        ${
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }
      `}
      data-nav-id={item.id}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );
});

function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Extract address from pathname
  const address = pathname?.split("/")[1] || "";

  // Skip rendering on certain pages
  if (pathname === "/" || pathname.includes("/loading")) {
    return null;
  }

  // Render mobile navigation
  if (isMobile) {
    return (
      <nav className="fixed bottom-3 left-3 right-3 bg-white dark:bg-gray-900 rounded-lg flex justify-around p-2 z-20 shadow-strong">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href(address)}
            className={`
              flex flex-col items-center rounded-lg py-2 px-4
              text-sm font-medium leading-5
              ${
                pathname === item.href(address)
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </nav>
    );
  }

  // Render desktop navigation
  return (
    <div ref={sidebarRef} className="h-screen">
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed m-3 h-[calc(100vh-25px)]
    transition-width duration-300 ease-in-out
    rounded-tremor-default ring-1 ring-zinc-800
    bg-tremor-background dark:bg-dark-tremor-background
    shadow-strong z-20 transform-gpu
    ${isCollapsed ? "w-17" : "w-64"}`}
      >
        {/* Header */}
        <div
          className={`p-3 mt-1 flex ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <Link href="/" className="text-xl font-bold tracking-tight">
              ⚡ Flash Stats
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0 }}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <div className="px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              isActive={pathname === item.href(address)}
              isCollapsed={isCollapsed}
              address={address}
            />
          ))}
          {/* Exchange section */}
          {!isCollapsed && (
            <div className="w-full p-4 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">
                {exchanges.length > 1 ? "Your Exchanges" : "Exchange"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-lg cursor-pointer">
                  <span className="text-sm">
                    {exchanges.map((exchange) => (
                      <Link
                        key={exchange.name}
                        href={exchange.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center space-x-2">
                          <exchange.icon className="flex items-center w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <p className="text-sm">{exchange.name}</p>
                        </div>
                      </Link>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
            <p className="text-sm text-center text-zinc-400">
              Made with ❤️ by{" "}
              <Link
                href="https://twitter.com/@MightieMags"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-200 transition-duration-200"
              >
                MightyMags
              </Link>
            </p>
          </div>
        )}
      </motion.nav>
    </div>
  );
}

export default memo(Sidebar);
