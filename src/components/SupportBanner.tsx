import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SupportBannerProps {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const SupportBanner: React.FC<SupportBannerProps> = ({ isExpanded, isHovered, isMobileOpen }) => {
  return (
    <div className="px-4 py-4">
      <div className="bg-white/40 backdrop-blur-lg px-4 py-10 flex items-center gap-3">
        <HelpCircle className="w-5 h-5 text-white flex-shrink-0" />
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="text-white text-sm">
            Need Support? <a href="mailto:support@example.com" className="underline hover:text-white/80">Contact Us</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportBanner;
