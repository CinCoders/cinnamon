'use client';

import { cn } from '@/lib/utils';
import { NavGroup } from '@/components/sidebar-01/nav-collapsible';
import { NavMain } from '@/components/sidebar-01/nav-main';
import type { LinkComponent, SidebarData } from '@/interfaces';

export interface AppSidebarProps {
  data: SidebarData;
  linkComponent: LinkComponent;
  activeHref?: string;
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({
  data,
  linkComponent,
  activeHref,
  onNavigate,
  className,
}: AppSidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-y-auto bg-sidebar text-sidebar-foreground',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {(data.appName || data.appLogoSrc) && (
        <div className="flex items-center gap-2 px-4 py-4">
          {data.appLogoSrc && (
            <img
              src={data.appLogoSrc}
              alt=""
              className="h-8 w-8 shrink-0 object-contain"
            />
          )}
          {data.appName && (
            <span className="truncate text-lg font-semibold text-cinnamon-dark">
              {data.appName}
            </span>
          )}
        </div>
      )}
      <NavMain
        items={data.navMain}
        linkComponent={linkComponent}
        activeHref={activeHref}
        onNavigate={onNavigate}
      />
      {data.navGroups?.map((group) => (
        <NavGroup
          key={group.id}
          group={group}
          linkComponent={linkComponent}
          activeHref={activeHref}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
