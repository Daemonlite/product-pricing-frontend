import React from 'react';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6',
  };

  const knobSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-5' : 'translate-x-0.5',
    lg: checked ? 'translate-x-6' : 'translate-x-0.5',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-primary' : 'bg-muted'
      } ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span
        className={`inline-block bg-background rounded-full shadow transform transition-transform duration-200 ${knobSizeClasses[size]} ${translateClasses[size]}`}
      />
    </button>
  );
};
