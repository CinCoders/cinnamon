'use client';

import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavItemRow } from '@/components/sidebar-01/nav-main';
import type { LinkComponent, SidebarNavGroup } from '@/interfaces';

export interface NavGroupProps {
  group: SidebarNavGroup;
  linkComponent: LinkComponent;
  activeHref?: string;
  onNavigate?: () => void;
}

export function NavGroup({
  group,
  linkComponent,
  activeHref,
  onNavigate,
}: NavGroupProps) {
  return (
    <Collapsible
      defaultOpen={group.defaultOpen}
      className="group/collapsible flex flex-col px-2"
    >
      <CollapsibleTrigger className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        {group.label}
        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-open/collapsible:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-px pt-px">
        {group.items.map((item) => (
          <NavItemRow
            key={item.id}
            item={item}
            linkComponent={linkComponent}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
