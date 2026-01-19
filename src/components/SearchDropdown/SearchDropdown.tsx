"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  inputLabelList?: string[];
  searchFunction?: (searchString: string) => void;
  className?: string;
}

export function SearchDropdown({
  inputLabelList = [],
  searchFunction = () => {},
  className,
}: SearchDropdownProps) {
  const [inputList, setInputList] = React.useState<string[]>([]);

  // ✅ corrige o bug do legado: reage quando inputLabelList muda
  React.useEffect(() => {
    setInputList(Array.from({ length: inputLabelList.length }, () => ""));
  }, [inputLabelList]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setInputList((prev) => {
      const next = [...prev];
      next[index] = e.target.value;
      return next;
    });
  }

  function handleDropdownSearch() {
    const parts: string[] = [];

    for (let i = 0; i < inputLabelList.length; i++) {
      const label = inputLabelList[i];
      const value = inputList[i]?.trim();

      if (label && value) {
        parts.push(`${label.toLowerCase()}:(${value})`);
      }
    }

    searchFunction(parts.join(" "));

    // ✅ limpa sem mutar estado
    setInputList(Array.from({ length: inputLabelList.length }, () => ""));
  }

  return (
    <div className={cn("absolute top-10 w-full", className)}>
      <div className="grid gap-3 rounded-md border border-border bg-background p-6 shadow-md">
        {inputLabelList.map((label, index) => (
          <fieldset
            key={`field_${label}_${index}`}
            className="grid items-center gap-3 border-0"
            style={{ gridTemplateColumns: "minmax(90px, 15%) 1fr" }}
          >
            <label className="text-sm font-medium text-muted-foreground">
              {label}:
            </label>

            <Input
              type="text"
              value={inputList[index] ?? ""}
              onChange={(e) => handleInputChange(e, index)}
              className="h-8 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </fieldset>
        ))}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleDropdownSearch}
            className="relative overflow-hidden"
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
