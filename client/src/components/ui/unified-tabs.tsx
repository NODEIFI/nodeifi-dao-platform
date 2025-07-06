import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface UnifiedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function UnifiedTabs({ tabs, activeTab, onTabChange, className }: UnifiedTabsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-6 py-2 rounded-full font-semibold transition-all duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            'backdrop-blur-sm border',
            activeTab === tab.id
              ? 'bg-primary text-black border-primary'
              : 'bg-white/5 border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              activeTab === tab.id
                ? 'bg-black/20 text-black'
                : 'bg-white/10 text-gray-300'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}