import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

export type SearchInputProps = Omit<InputProps, "type">;

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Buscar…", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("pl-9", className)}
          {...props}
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
