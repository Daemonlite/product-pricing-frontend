import React from 'react';

interface RadioButtonProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange?.(value);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />
        <div
          className={`border-2 rounded-full transition-colors duration-200 flex items-center justify-center ${
            checked
              ? 'bg-transparent border-primary'
              : 'bg-background border-primary hover:border-primary/50'
          } ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''}`}
        >
          {checked && (
            <div className={`bg-primary rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`} />
          )}
        </div>
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>
          {label}
          {required && <span className="text-red-500 ml-2">*</span>}
        </span>
      )}
    </label>
  );
};
