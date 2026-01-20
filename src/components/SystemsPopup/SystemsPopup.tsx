"use client";

import * as React from "react";
import type { System } from "@/interfaces"; // ajuste se o path for outro
import { IconRenderer } from "@/lib-components/IconRender";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface SystemsPopupProps {
  systemsList?: System[];
}

export function SystemsPopup({ systemsList = [] }: SystemsPopupProps) {
  return (
    <TooltipProvider>
      <div className="w-72 min-h-max rounded-xl bg-muted shadow-lg">
        <div className="grid min-h-max grid-cols-3 gap-2 p-1">
          {systemsList.map((system) => (
            <a
              href={system.href}
              key={`system_${system.title}`}
              className="flex h-24 flex-col items-center justify-center gap-2 rounded-md p-2 no-underline transition hover:bg-accent"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <IconRenderer
                        iconUrl={system.iconUrl}
                        alt={system.title}
                        IconComponent={system.IconComponent}
                        className="h-10 w-10"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {system.description}
                </TooltipContent>
              </Tooltip>

              <h3 className="m-0 text-center text-[10px] font-medium text-foreground">
                {system.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
