import React, { useState, ReactNode, FC } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  variant?: 'underline' | 'filled';
}

export const Tabs: FC<TabsProps> = ({ tabs, defaultActiveId, onTabChange, variant = 'underline' }) => {
  const [activeTabId, setActiveTabId] = useState(defaultActiveId || (tabs.length > 0 ? tabs[0].id : ''));

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div>
      <div className={variant === 'filled' ? 'flex items-center space-x-2 bg-card border border-border rounded-lg p-1 w-fit' : `flex border-b w-fit ${variant === 'underline' ? 'border-border' : ''} bg-background`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 ${variant === 'filled' ? '' : '-mb-px'} font-medium text-sm focus:outline-none flex items-center cursor-pointer ${
              variant === 'underline'
                ? activeTabId === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                : variant === 'filled'
                ? activeTabId === tab.id
                  ? 'bg-primary text-white rounded-md'
                  : 'text-muted-foreground hover:text-foreground rounded-md'
                : ''
            }`}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTabId === tab.id ? 0 : -1}
          >
            {tab.startIcon && <span className="mr-1 inline-flex items-center">{tab.startIcon}</span>}
            {tab.label}
            {tab.endIcon && <span className="ml-1 inline-flex items-center">{tab.endIcon}</span>}
          </button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel" id={`tabpanel-${activeTabId}`} aria-labelledby={`tab-${activeTabId}`}>
        {tabs.find((tab) => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};
