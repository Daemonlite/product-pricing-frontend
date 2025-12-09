import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

const accordionVariants = cva('border border-border rounded-md', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const AccordionItemContext = createContext<{ value: string } | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('useAccordion must be used within Accordion');
  return context;
}

interface AccordionProps extends VariantProps<typeof accordionVariants> {
  children: ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={`border-b last:border-b-0 ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  const itemContext = useContext(AccordionItemContext);
  if (!itemContext) throw new Error('AccordionTrigger must be used within AccordionItem');
  const { value } = itemContext;
  const isOpen = openItems.includes(value);

  return (
    <button
      className={`flex cursor-pointer items-center bg-card justify-between w-full p-4 text-left hover:bg-muted focus:outline-none transition-colors ${className}`}
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown className={`h-6 w-6 bg-muted p-1 rounded-full transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const itemContext = useContext(AccordionItemContext);
  if (!itemContext) throw new Error('AccordionContent must be used within AccordionItem');
  const { value } = itemContext;
  const isOpen = openItems.includes(value);

  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} ${className}`}>
      <div className="p-4 pt-0">
        {children}
      </div>
    </div>
  );
}

export function Accordion({ children, type = 'multiple', defaultValue = [], size, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : typeof defaultValue === 'string' ? [defaultValue] : []
  );

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value]);
    } else {
      setOpenItems(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={accordionVariants({ size, className })}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
