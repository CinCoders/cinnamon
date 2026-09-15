import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

export interface SearchInputProps extends Omit<InputProps, "type"> {
  defaultValue?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Buscar…", value, defaultValue, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const isControlled = value !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("pl-9", className)}
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
