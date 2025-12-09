import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "success" | "filled" | "tonal";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info" | "default";
  size?: "sm" | "md" | "lg";
  rounded?: "rounded" | "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-full";
  className?: string;
}

export const Chip = ({
  children,
  onRemove,
  startIcon,
  endIcon,
  variant = "default",
  color = "default",
  size = "md",
  rounded = "rounded-md",
  className = ""
}: ChipProps) => {
  let classes = `inline-flex items-center gap-1 text-sm font-medium transition-colors ${className}`;

  // Size
  if (size === "sm") {
    classes += " text-xs px-1.5 py-0.5";
  } else {
    classes += " text-sm px-2 py-1";
  }

  // Rounded
  classes += ` ${rounded}`;

  // Base variant
  let bg = "";
  let text = "text-foreground";
  let border = "";

  if (variant === "outline") {
    bg = "";
    text = "text-primary";
    border = "border border-primary";
  } else if (variant === "tonal") {
    bg = "bg-muted/50";
    text = "text-foreground";
    border = "";
  } else if (variant === "destructive") {
    bg = "bg-red-600";
    text = "text-destructive-foreground";
  } else if (variant === "success") {
    bg = "bg-green-600";
    text = "text-white";
  } else if (variant === "filled") {
    bg = "bg-foreground/10";
    text = "text-foreground";
  } else {
    bg = "bg-secondary";
    text = "text-secondary-foreground";
  }

  // Override with color
  if (color === "primary") {
    if (variant === "outline") {
      border = "border border-primary";
      text = "text-primary";
    } else if (variant === "tonal") {
      bg = "bg-primary/10";
      text = "text-primary";
      border = "";
    } else {
      bg = "bg-primary";
      text = "text-primary-foreground";
    }
  } else if (color === "secondary") {
    if (variant === "outline") {
      border = "border border-secondary";
      text = "text-secondary-foreground";
    } else if (variant === "tonal") {
      bg = "bg-secondary/10";
      text = "text-secondary-foreground";
      border = "";
    } else {
      bg = "bg-secondary";
      text = "text-secondary-foreground";
    }
  } else if (color === "success") {
    if (variant === "outline") {
      border = "border border-green-600";
      text = "text-green-600";
    } else if (variant === "tonal") {
      bg = "bg-green-700/10";
      text = "text-green-600";
      border = "";
    } else {
      bg = "bg-green-600";
      text = "text-white";
    }
  } else if (color === "error") {
    if (variant === "outline") {
      border = "border border-red-600";
      text = "text-destructive";
    } else if (variant === "tonal") {
      bg = "bg-red-600/10";
      text = "text-red-600";
      border = "";
    } else {
      bg = "bg-red-600";
      text = "text-white";
    }
  } else if (color === "warning") {
    if (variant === "outline") {
      border = "border border-yellow-500";
      text = "text-yellow-900";
    } else if (variant === "tonal") {
      bg = "bg-yellow-600/10";
      text = "text-yellow-600";
      border = "";
    } else {
      bg = "bg-yellow-500";
      text = "text-white";
    }
  } else if (color === "info") {
    if (variant === "outline") {
      border = "border border-blue-500";
      text = "text-blue-700";
    } else if (variant === "tonal") {
      bg = "bg-blue-600/10";
      text = "text-blue-600";
      border = "";
    } else {
      bg = "bg-blue-500";
      text = "text-white";
    }
  }

  classes += ` ${bg} ${text} ${border}`;

  return (
    <span className={classes}>
      {startIcon}
      {children}
      {endIcon}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
