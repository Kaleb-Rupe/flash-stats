import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-inherit rounded-lg shadow-md">
      <div className="flex space-x-2 pl-3 border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 rounded-t-lg transition-colors ${
              activeTab === index
                ? "bg-inherit text-blue-600 border-b-2 border-blue-600"
                : "bg-inherit text-gray-600"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-inherit rounded-b-lg rounded-tr-lg">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
