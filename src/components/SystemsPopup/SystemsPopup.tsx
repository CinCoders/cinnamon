"use client";

import type { System, LinkComponent } from "@/interfaces";
import { IconRenderer } from "@/lib-components/IconRender";
import { DefaultAnchor } from "@/lib/DefaultAnchor";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface SystemsPopupProps {
  systemsList?: System[];
  linkComponent?: LinkComponent;
}

export function SystemsPopup({ systemsList = [], linkComponent }: SystemsPopupProps) {
  const LinkImpl: LinkComponent = linkComponent ?? DefaultAnchor;
  return (
    <TooltipProvider>
      <div className="w-72 min-h-max rounded-xl bg-muted shadow-lg">
        <div className="grid min-h-max grid-cols-3 gap-2 p-1">
          {systemsList.map((system) => (
            <LinkImpl
              href={system.href}
              key={`system_${system.title}`}
              className="group flex h-24 flex-col items-center justify-center gap-2 rounded-md p-2 no-underline transition hover:bg-[#E6E6E6]"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <IconRenderer
                      iconUrl={system.iconUrl}
                      alt={system.title}
                      IconComponent={system.IconComponent}
                      iconId={system.iconId}
                      className="h-10 w-10 text-cinnamon-primary transition-transform group-hover:scale-105"
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
            </LinkImpl>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
