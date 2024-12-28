// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  TableCellsIcon,
  HomeIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  collapsed,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center px-4 py-3 text-sm font-medium rounded-lg
        transition-colors duration-200
        ${
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const address = pathname.split("/")[1];

  // Don't show sidebar on home page or loading page
  if (pathname === "/" || pathname.includes("/loading")) {
    return null;
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: `/${address}`,
      icon: HomeIcon,
    },
    {
      name: "Transactions",
      href: `/${address}/transactions`,
      icon: TableCellsIcon,
    },
    {
      name: "Charts",
      href: `/${address}/charts`,
      icon: ChartBarIcon,
    },
  ];

  return (
    <aside
      className={`
        fixed 
        bg-[#1C1C27] border-r border-zinc-800
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-17" : "w-64"}
        h-full
        z-20
      `}
    >
      {/* Logo section */}
      <div
        className={`p-2 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link href="/">
          <h1
            className={`text-xl ml-4 font-bold tracking-tight ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            ⚡ Flash Tracker
          </h1>
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavLink
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={item.name}
              isActive={isActive}
              collapsed={isCollapsed}
            />
          );
        })}
      </nav>

      {/* Exchange section */}
      {!isCollapsed && (
        <div className="absolute w-full p-4 border-t border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">
            Your Exchanges
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-lg cursor-pointer">
              <span className="text-sm">
                <BoltIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </span>
              <Link
                href="https://beast.flash.trade?referral=Beast_2972"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm">Flash Trade</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
        <p className="text-sm text-center text-zinc-400">
          Made with ❤️ by{" "}
          <a href="https://twitter.com/@MightieMags">MightyMags</a>
        </p>
      </div>
    </aside>
  );
}
