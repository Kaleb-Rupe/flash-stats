"use client";

import { Tab } from "@headlessui/react";
import { useState } from "react";
import { Card } from "@tremor/react";

const tabs = ["Summary", "Performance", "Analytics"];

const TabNavigation = ({
  onTabChange,
}: {
  onTabChange: (index: number) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    onTabChange(index);
  };

  return (
    <Card className="p-1 ml-auto justify-end w-[50%] shadow-strong">
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
