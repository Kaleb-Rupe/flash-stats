import React, { useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { ClientOnly } from "@/app/components/ClientOnly";
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  ChevronRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useSidebar } from "@/app/context/SidebarContext";

// Constants moved outside component for better performance
const exchanges = [
  {
    name: "Flash Trade",
    href: "https://beast.flash.trade?referral=Beast_2972",
    icon: BoltIcon,
  },
];

const navigationItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: (address: string) => `/${address}`,
    icon: HomeIcon,
    className: "",
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

// Animation variants
const sidebarVariants = {
  expanded: { width: "16rem" },
  collapsed: { width: "4.5rem" },
};

const NavLink = React.memo(function NavLink({
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
  const Icon = item.icon;

  return (
    <Link
      href={item.href(address)}
      className={`
        group flex items-center px-4 py-3 text-sm font-medium rounded-lg
        transition-colors duration-200 transform-gpu
        ${
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }
      `}
      data-nav-id={item.id}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="truncate"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
});

function SidebarContent() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const address = useMemo(() => pathname?.split("/")[1] || "", [pathname]);

  const shouldRender = pathname !== "/" && !pathname.includes("/loading");

  const handleToggle = useCallback(() => {
    requestAnimationFrame(toggleCollapse);
  }, [toggleCollapse]);

  if (!shouldRender) return null;

  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-3 left-3 right-3 bg-white dark:bg-gray-900 rounded-lg flex justify-around p-2 z-20 shadow-strong touch-action-manipulation"
      >
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href(address)}
            className={`
    flex flex-col items-center justify-center rounded-lg py-3 px-2
    text-sm font-medium leading-5 transform-gpu transition-colors
    hover:bg-gray-200 dark:hover:bg-gray-800 group
    ${pathname === item.href(address) ? "text-white" : "text-gray-400"}
    w-full h-full min-h-[64px] active:bg-gray-300 dark:active:bg-gray-700
  `}
            aria-label={item.name}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="mb-1">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs">{item.name}</span>
            </div>
          </Link>
        ))}
      </motion.nav>
    );
  }

  return (
    <div ref={sidebarRef} className="h-screen">
      <motion.nav
        layout
        variants={sidebarVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed m-3 h-[calc(100vh-25px)]
          rounded-tremor-default ring-1 ring-zinc-800
          bg-tremor-background dark:bg-dark-tremor-background
          shadow-strong z-20 overflow-hidden"
      >
        <div
          className={`p-3 mt-1 flex items-center justify-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="truncate"
              >
                <Link href="/" className="text-xl font-bold tracking-tight">
                  ⚡ Flash Stats
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleToggle}
            className="p-2 rounded-lg transition-colors transform-gpu"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>

        <motion.div className="px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              isActive={pathname === item.href(address)}
              isCollapsed={isCollapsed}
              address={address}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 truncate"
            >
              <div className="w-full p-4 border-t border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">
                  {exchanges.length > 1 ? "Your Exchanges" : "Exchange"}
                </h3>
                {exchanges.map((exchange) => (
                  <Link
                    key={exchange.name}
                    href={exchange.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <exchange.icon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{exchange.name}</span>
                  </Link>
                ))}
              </div>

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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <ClientOnly>
      <SidebarContent />
    </ClientOnly>
  );
}
