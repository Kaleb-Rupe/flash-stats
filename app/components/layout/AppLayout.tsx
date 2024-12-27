"use client";

import React, { useState } from "react";
import {
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Card } from "@tremor/react";

// Main Layout Component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#14141F] text-white">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-[#1C1C27] border-r border-gray-800">
        {/* Logo Area */}
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center">
            ⚡ Flash Tracker
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                icon={item.icon}
                name={item.name}
                href={item.href}
                current={item.current}
              />
            ))}
          </div>
        </nav>

        {/* Exchange Section */}
        <div className="p-4 border-t border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Your Exchanges
          </h3>
          <div className="space-y-2">
            {exchanges.map((exchange) => (
              <ExchangeItem
                key={exchange.name}
                name={exchange.name}
                icon={exchange.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 bg-[#1C1C27] px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type here..."
                className="w-full pl-10 pr-4 py-2 bg-[#14141F] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Trevor Brown</span>
              <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#14141F] overflow-auto">
          <Card className="bg-[#1C1C27] border-gray-800">{children}</Card>
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({
  icon: Icon,
  name,
  href,
  current,
}: {
  icon: any;
  name: string;
  href: string;
  current: boolean;
}) => (
  <a
    href={href}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      current ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-800"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{name}</span>
  </a>
);

// Exchange Item Component
const ExchangeItem = ({ name, icon: Icon }: { name: string; icon: any }) => (
  <div className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer">
    <Icon className="h-5 w-5" />
    <span className="text-sm">{name}</span>
  </div>
);

// Navigation Items Configuration
const navItems = [
  { name: "Dashboard", href: "/", icon: ChartBarIcon, current: true },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowPathIcon,
    current: false,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: MagnifyingGlassIcon,
    current: false,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: DocumentTextIcon,
    current: false,
  },
];

// Exchange Items Configuration
const exchanges = [
  { name: "Binance", icon: ChartBarIcon },
  { name: "FTX", icon: ChartBarIcon },
  { name: "Bitmex", icon: ChartBarIcon },
];

export default AppLayout;
