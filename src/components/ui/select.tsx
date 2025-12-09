import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, X, Check, Search } from 'lucide-react';
import { Chip } from './chip';

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiselect?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean;
  success?: boolean;
  hint?: string;
  required?: boolean;
  variant?: "outline" | "filled" | "underline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  rounded?: "rounded" | "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-full";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  multiselect = false,
  clearable = false,
  searchable = false,
  placeholder = 'Select...',
  label,
  error = false,
  success = false,
  hint,
  required = false,
  variant = "outline",
  startIcon,
  endIcon,
  rounded = "rounded-lg",
  size = 'md',
  disabled = false,
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiselect ? (value as string[] || []) : (value ? [value as string] : []);
  const selectedLabels = options.filter(opt => selectedValues.includes(opt.value)).map(opt => opt.label);
  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) setSearchTerm('');
    }
  };

  const handleSelect = (optionValue: string) => {
    if (multiselect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange?.(multiselect ? [] : '');
  };

  const handleRemoveChip = (val: string) => {
    if (multiselect) {
      const newValues = selectedValues.filter(v => v !== val);
      onChange?.(newValues);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updatePosition();

    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Base classes
  let baseClasses = `flex items-center w-full text-left focus:outline-none transition-colors duration-200 cursor-pointer ${className}`;

  let paddingLeft = startIcon ? "pl-10" : "pl-3";
  let hasClear = clearable && selectedValues.length > 0 && !disabled;
  let paddingRight = "pr-20";

  // Size
  let sizeClasses = '';
  if (size === 'sm') {
    sizeClasses = 'text-xs py-2';
  } else if (size === 'md') {
    sizeClasses = 'text-sm py-3';
  } else if (size === 'lg') {
    sizeClasses = 'text-base py-3';
  }

  if (variant === "outline") {
    baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} bg-background ${sizeClasses}`;
  } else if (variant === "filled") {
    baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} bg-muted ${sizeClasses}`;
  } else if (variant === "underline") {
    baseClasses += ` border-0 border-b-2 ${paddingLeft} ${paddingRight} rounded-none bg-transparent ${sizeClasses}`;
  }

  // States
  let buttonClasses = baseClasses;
  if (disabled) {
    buttonClasses += ` text-muted-foreground border-border/50 bg-muted/50 cursor-not-allowed`;
  } else if (error) {
    buttonClasses += ` text-destructive-foreground border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10`;
  } else if (success) {
    buttonClasses += ` text-emerald-700 border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10`;
  } else {
    buttonClasses += ` text-foreground border-border focus:ring-1 focus:ring-primary`;
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5 dark:text-foreground">
          {label}
          {required && <span className="text-red-600 ml-2">*</span>}
        </label>
      )}
      <div ref={selectRef} className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        <button
          type="button"
          className={buttonClasses}
          onClick={handleToggle}
          disabled={disabled}
        >
          <div className="flex-1 truncate">
            {selectedLabels.length > 0 ? (
              multiselect ? (
                <div className="flex flex-wrap gap-1">
                  {selectedLabels.map((label, idx) => (
                    <Chip key={selectedValues[idx]} variant='filled' size="md" onRemove={() => handleRemoveChip(selectedValues[idx])}>
                      {label}
                    </Chip>
                  ))}
                </div>
              ) : (
                selectedLabels[0]
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </button>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {endIcon ? (
            <div className="text-muted-foreground">
              {endIcon}
            </div>
          ) : (
            <div className="w-4 h-4" />
          )}
          {hasClear ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5 bg-muted rounded-full p-1" />
            </span>
          ) : (
            <div className="w-4 h-4" />
          )}
          <span onClick={handleToggle} className="cursor-pointer">
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>
        {isOpen && ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 999999,
            }}
            className="bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-input">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-input rounded focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-foreground/10 cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                {multiselect && (
                  <div className="mr-2">
                    {selectedValues.includes(option.value) && <Check className="w-4 h-4" />}
                  </div>
                )}
                <span className={selectedValues.includes(option.value) ? 'font-medium' : ''}>
                  {option.label}
                </span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No options found
              </div>
            )}
          </div>,
          document.body
        )}
      </div>
      {hint && (
        <p
          className={`mt-1.5 text-xs transition-colors duration-200 ${
            error
              ? "text-destructive-foreground"
              : success
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};