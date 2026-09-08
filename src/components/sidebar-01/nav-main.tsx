'use client';

import { cn } from '@/lib/utils';
import { IconRenderer } from '@/lib-components/IconRender';
import type { LinkComponent, SidebarNavItem } from '@/interfaces';

export interface NavItemsProps {
  items: SidebarNavItem[];
  linkComponent: LinkComponent;
  activeHref?: string;
  onNavigate?: () => void;
}

export function NavItemRow({
  item,
  linkComponent: Link,
  activeHref,
  onNavigate,
}: {
  item: SidebarNavItem;
  linkComponent: LinkComponent;
  activeHref?: string;
  onNavigate?: () => void;
}) {
  const isActive = !!activeHref && item.href === activeHref;
  const className = cn(
    'flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-colors',
    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    isActive
      ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
      : 'text-sidebar-foreground/80',
  );
  const content = (
    <>
      {(item.IconComponent || item.iconId) && (
        <IconRenderer
          IconComponent={item.IconComponent}
          iconId={item.iconId}
          className="h-4 w-4 shrink-0"
        />
      )}
      <span className="truncate">{item.title}</span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href ?? '#'}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

export function NavMain({
  items,
  linkComponent,
  activeHref,
  onNavigate,
}: NavItemsProps) {
  return (
    <nav className="flex flex-col gap-px px-2 py-2">
      {items.map((item) => (
        <NavItemRow
          key={item.id}
          item={item}
          linkComponent={linkComponent}
          activeHref={activeHref}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
