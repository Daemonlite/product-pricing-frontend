import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />
        <div
          className={`border-2 rounded transition-colors duration-200 flex items-center justify-center ${
            checked
              ? 'bg-primary border-primary text-white hover:bg-primary/90'
              : 'bg-background border-primary hover:border-primary/50'
          } ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''}`}
        >
          {checked && <Check className={iconSizeClasses[size]} />}
        </div>
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
      )}
    </label>
  );
};
