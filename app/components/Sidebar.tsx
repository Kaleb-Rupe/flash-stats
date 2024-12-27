"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChartBarIcon,
  TableCellsIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
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
    <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
