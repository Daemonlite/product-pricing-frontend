import React, { forwardRef } from 'react';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: boolean;
  success?: boolean;
  hint?: string;
  clearable?: boolean;
  required?: boolean;
  variant?: "outline" | "filled" | "underline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  rounded?: "rounded" | "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-full";
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error = false,
    success = false,
    hint,
    clearable = false,
    required = false,
    variant = "outline",
    startIcon,
    endIcon,
    rounded = "rounded-lg",
    rows = 3,
    className = "",
    value,
    onChange,
    disabled = false,
    ...props
  }, ref) => {
    // Base classes
    let baseClasses = `h-auto w-full appearance-none text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors duration-200 resize-none ${className}`;

    let paddingLeft = startIcon ? "pl-10" : "pl-4";
    let hasEndIcon = !!endIcon;
    let hasClear = clearable && !!value && !disabled;
    let rightIconCount = (hasEndIcon ? 1 : 0) + (hasClear ? 1 : 0);
    let paddingRight = rightIconCount === 0 ? "pr-4" : rightIconCount === 1 ? "pr-10" : "pr-16";

    if (variant === "outline") {
      baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} py-2.5 bg-background`;
    } else if (variant === "filled") {
      baseClasses += ` ${rounded} border ${paddingLeft} ${paddingRight} py-2.5 bg-muted`;
    } else if (variant === "underline") {
      baseClasses += ` border-0 border-b-2 ${paddingLeft} ${paddingRight} py-2.5 rounded-none bg-transparent`;
    }

    // Add styles for states
    let textareaClasses = baseClasses;
    if (disabled) {
      textareaClasses += ` text-muted-foreground border-border/50 bg-muted/50 cursor-not-allowed`;
    } else if (error) {
      textareaClasses += ` text-destructive-foreground border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10`;
    } else if (success) {
      textareaClasses += ` text-emerald-700 border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10`;
    } else {
      textareaClasses += ` text-foreground border-border/50 focus:border-primary focus:ring-1 focus:ring-primary`;
    }

    const handleClear = () => {
      if (onChange && !disabled) {
        const event = {
          target: {
            value: '',
            name: props.name || '',
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(event);
      }
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-foreground mb-1.5 dark:text-foreground"
          >
            {label}
            {required && <span className="text-red-500 ml-2">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className="absolute left-3 top-3 text-muted-foreground">
              {startIcon}
            </div>
          )}

          <textarea
            ref={ref}
            rows={rows}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={textareaClasses}
            {...props}
          />

          {/* End Icon */}
          {endIcon && (
            <div className={`absolute top-3 text-muted-foreground ${hasClear ? 'right-10' : 'right-3'}`}>
              {endIcon}
            </div>
          )}

          {/* Clear button */}
          {hasClear && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200"
              aria-label="Clear textarea"
            >
              <svg
                className="w-5 h-5"
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
  }
);

Textarea.displayName = 'Textarea';
