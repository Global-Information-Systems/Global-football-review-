
import React from 'react';
import { TabDefinition, TabId } from '../types';
import { motion } from 'motion/react';

interface TabsProps {
  tabs: TabDefinition[];
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onSelectTab }) => {
  return (
    <div className="flex bg-chocolate-dark/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
      {tabs.map((tab: TabDefinition) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap relative
            ${activeTab === tab.id 
              ? 'text-white' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
          `}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div 
              layoutId="activeTab"
              className="absolute inset-0 bg-pitch-green rounded-xl -z-10 shadow-lg shadow-pitch-green-dark/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
