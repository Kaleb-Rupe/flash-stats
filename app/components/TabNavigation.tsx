"use client";

import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { Card } from "@tremor/react";

const tabs = ["Summary", "Performance", "Analytics"];

const TabNavigation = ({
  selectedTab,
  onTabChange,
}: {
  selectedTab: number;
  onTabChange: (index: number) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(selectedTab);

  useEffect(() => {
    setSelectedIndex(selectedTab);
  }, [selectedTab]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    onTabChange(index);
  };

  useEffect(() => {
    localStorage.setItem("selectedTab", selectedIndex.toString());
  }, [selectedIndex]);

  return (
    <Card className="p-1 ml-auto justify-end w-full sm:w-full lg:w-[50%] shadow-strong">
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-0 ${
                  selected
                    ? "text-white hover:shadow-strong disabled:cursor-not-allowed"
                    : "text-gray-400 hover:bg-white/[0.12] hover:text-white hover:shadow-strong"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </Card>
  );
};

export default TabNavigation;
