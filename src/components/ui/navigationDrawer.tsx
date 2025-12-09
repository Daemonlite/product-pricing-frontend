import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavItem[];
  location?: 'left' | 'right' | 'top' | 'bottom';
  title?: string;
  headerContent?: React.ReactNode;
  width?: string;
  children?: React.ReactNode;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, navItems = [], location = 'left', title = 'Navigation', headerContent, width = '16rem', children }) => {

  const getDrawerClasses = () => {
    const baseClasses = 'fixed bg-card z-50 transform transition-transform duration-300 ease-in-out';
    switch (location) {
      case 'left':
        return `${baseClasses} left-0 top-0 h-full border-r border-border ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;
      case 'right':
        return `${baseClasses} right-0 top-0 h-full border-l border-border ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;
      case 'top':
        return `${baseClasses} top-0 left-0 right-0 w-full border-b border-border ${isOpen ? 'translate-y-0' : '-translate-y-full'}`;
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 right-0 w-full border-t border-border ${isOpen ? 'translate-y-0' : 'translate-y-full'}`;
      default:
        return `${baseClasses} left-0 top-0 h-full border-r border-border ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;
    }
  };

  const sizeStyle = location === 'left' || location === 'right' ? { width } : { height: width };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm h-full z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={getDrawerClasses()}
        style={sizeStyle}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 cursor-pointer hover:bg-foreground/10 transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {headerContent}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
