import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import "@/styles/flatpickr-theme.css";
import { X, Calendar } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import InputField from "@/components/ui/Input-field"
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

const datePickerVariants = cva(
  "rounded-lg w-full border appearance-none px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none bg-input text-foreground border-border focus:border-primary focus:ring-1 ",
  {
    variants: {
      variant: {
        outline:
          "border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-primary",
        filled:
          "border border-border bg-muted focus:border-primary focus:ring-1 focus:ring-primary",
        underline:
          "border-0 border-b-2 rounded-none bg-transparent focus:border-primary focus:ring-1 focus:ring-primary",
      },
      size: {
        sm: "h-8 text-xs px-3 py-2",
        md: "h-11 text-sm px-4 py-2.5",
        lg: "h-14 text-base px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
);

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
} & VariantProps<typeof datePickerVariants>;

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  variant,
  size,
}: PropsType) {
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    const flatPickr = flatpickr(element, {
      mode: mode || "single",
      allowInput: false,
      monthSelectorType: "static",
      dateFormat: mode === "time" ? "H:i" : "Y-m-d",
      defaultDate,
      onChange: (selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => {
        setHasValue(selectedDates.length > 0);
        if (onChange) {
          if (Array.isArray(onChange)) {
            onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
          } else {
            onChange(selectedDates, dateStr, instance);
          }
        }
      },
    });

    if (flatPickr) {
      fpRef.current = flatPickr;
    }

    return () => {
      if (fpRef.current && typeof fpRef.current.destroy === 'function') {
        fpRef.current.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  const clearDate = () => {
    if (fpRef.current && typeof fpRef.current.clear === 'function') {
      fpRef.current.clear();
      setHasValue(false);
    }
  };

  // Icon size and position based on size prop
  const iconSizeClass = size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5";
  const iconRightPosition = "right-2 bg-muted rounded-full p-1";

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative cursor-pointer w-full">
        <InputField
          id={id}
          placeholder={placeholder}
          className={datePickerVariants({ variant, size })}
          startIcon={<Calendar className={iconSizeClass} />}
          />
        {hasValue && (
          <X
            className={`absolute top-1/2 -translate-y-1/2 ${iconRightPosition} cursor-pointer ${iconSizeClass}`}
            onClick={clearDate}
          />
        )}
      </div>
    </div>
  );
}
