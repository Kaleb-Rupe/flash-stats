import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavigation = ({
  navigationItems,
  address,
}: {
  navigationItems: any;
  address: string;
}) => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 pb-safe"
    >
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="grid grid-cols-3 gap-1">
          {navigationItems.map((item: any) => (
            <Link
              key={item.id}
              href={item.href(address)}
              className={`
                relative block p-2 rounded-lg
                touch-manipulation tap-highlight-transparent
                active:scale-95 transition-transform
                ${
                  pathname === item.href(address)
                    ? "text-white bg-gray-800"
                    : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <div className="flex flex-col items-center justify-center min-h-[48px]">
                <item.icon className="w-6 h-6" aria-hidden="true" />
                <span className="mt-1 text-xs font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileNavigation;
