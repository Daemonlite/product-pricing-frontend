'use client';

import { Eye, EyeOff } from "lucide-react";
import React, { FC, useState } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  clearable?: boolean;
  required?: boolean;
  variant?: "outline" | "filled" | "underline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  rounded?: "rounded" | "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-full";
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  label,
  clearable = false,
  required = false,
  variant = "outline",
  startIcon,
  endIcon,
  rounded = "rounded-lg",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Base classes based on variant
  let baseClasses = `h-11 w-full appearance-none text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors duration-200 ${className}`;

  let paddingLeft = startIcon ? "pl-10" : "pl-4";
  let hasEndIcon = !!endIcon;
  let hasClear = clearable && !!value && !disabled;
  let hasPasswordToggle = type === "password";
  let rightIconCount = (hasEndIcon ? 1 : 0) + (hasClear ? 1 : 0) + (hasPasswordToggle ? 1 : 0);
  let paddingRight = rightIconCount === 0 ? "pr-4" : rightIconCount === 1 ? "pr-10" : "pr-16";

  if (variant === "outline") {
    baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} py-2.5 bg-background`;
  } else if (variant === "filled") {
    baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} py-2.5 bg-muted`;
  } else if (variant === "underline") {
    baseClasses += ` border-0 border-b-2 ${paddingLeft} ${paddingRight} py-2.5 rounded-none bg-transparent`;
  }

  // Add styles for the different states
  let inputClasses = baseClasses;
  if (disabled) {
    inputClasses += ` text-muted-foreground border-border/50 bg-muted/50 cursor-not-allowed`;
  } else if (error) {
    inputClasses += ` text-destructive-foreground border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10`;
  } else if (success) {
    inputClasses += ` text-emerald-700 border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10`;
  } else {
    inputClasses += ` text-foreground border-border/50 focus:border-primary focus:ring-1 focus:ring-primary`;
  }

  const handleClear = () => {
    if (onChange && !disabled) {
      // Create a synthetic event to clear the input
      const event = {
        target: {
          value: '',
          name: name || '',
          type: type
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1.5 dark:text-foreground"
        >
          {label}
          {required && <span className="text-red-600 ml-1.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}

        <input
          type={type === "password" && showPassword ? "text" : type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />

        {/* End Icon */}
        {endIcon && (
          <div className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground ${hasClear && hasPasswordToggle ? 'right-16' : (hasClear || hasPasswordToggle) ? 'right-10' : 'right-3'}`}>
            {endIcon}
          </div>
        )}

        {/* Clear button */}
        {hasClear && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute top-1/2 cursor-pointer transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200 ${hasPasswordToggle ? 'right-10' : 'right-3'}`}
            aria-label="Clear input"
          >
            <svg
              className="w-5 h-5 bg-muted rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Password toggle button */}
        {hasPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 cursor-pointer transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200 right-3"
            aria-label="Toggle password visibility"
          >
            {/* Password toggle icon */}
              {showPassword ? (
                <>
                  <Eye className="w-5 h-5" />
                </>
              ) : (
                <>
                  <EyeOff className="w-5 h-5" />
                </>
              )}
          </button>
        )}
      </div>

      {/* Hint Text */}
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

export default Input;
