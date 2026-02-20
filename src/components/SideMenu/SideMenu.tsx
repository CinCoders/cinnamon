// cinnamon-v2/src/components/SideMenu/SideMenu.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Link as CinnamonLink, SideMenuLink } from "@/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface SideMenuProps {
  links: SideMenuLink[];
  top: string; // ex: "64px"
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

function isExternal(link?: { external?: boolean; href?: string }) {
  return Boolean(link?.external);
}

/**
 * Força o ícone a ficar branco:
 * - img ok
 * - svg: força text/stroke/fill (cobre lucide, mui icons, svgs diversos)
 */
function ItemIcon({
  iconUrl,
  title,
  IconComponent,
  className,
}: {
  iconUrl?: string;
  title?: string;
  IconComponent?: React.JSXElementConstructor<any>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex w-10 items-center justify-center text-white",
        // força qualquer svg dentro a ser branco
        "[&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-white [&_svg]:stroke-white [&_svg]:fill-white",
        className
      )}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={`${title ?? "item"} icon`}
          className="h-5 w-5"
        />
      ) : IconComponent ? (
        <IconComponent />
      ) : null}
    </span>
  );
}

function SameTabLink({
  href,
  onClick,
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      onClick={onClick}
      className={cn(
        "flex min-h-[54px] w-full items-center justify-between px-2 text-white no-underline",
        className
      )}
    >
      {children}
    </a>
  );
}

function NewTabLink({
  href,
  onClick,
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "flex min-h-[54px] w-full items-center justify-between px-2 text-white no-underline",
        className
      )}
    >
      {children}
    </a>
  );
}

export function SideMenu({
  links,
  top,
  visibility = false,
  setVisibility,
}: SideMenuProps) {
  const [openGroups, setOpenGroups] = React.useState<Record<number, boolean>>(
    {}
  );

  React.useEffect(() => {
    const next: Record<number, boolean> = {};
    for (const l of links ?? []) next[l.id] = false;
    setOpenGroups(next);
  }, [links]);

  const close = React.useCallback(() => setVisibility(false), [setVisibility]);

  function toggleGroup(id: number) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function onNavigate() {
    close();
  }

  const topValue = top ?? "0px";
  const topNum = Number.parseFloat(topValue) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          visibility ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ top: topValue }}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 z-50 w-[250px] bg-[#272727] text-white shadow-xl",
          "transition-transform duration-200 ease-out",
          visibility ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          top: topValue,
          height: `calc(100vh - ${topNum}px)`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Side menu"
      >
        <nav
          className={cn(
            "h-full overflow-y-auto overflow-x-hidden py-4",
            // scrollbar (bem parecido com o legado)
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-track]:bg-[rgb(80,80,80)]",
            "[&::-webkit-scrollbar-thumb]:rounded-[10px]",
            "[&::-webkit-scrollbar-thumb]:bg-[rgb(50,50,50)]",
            "[&::-webkit-scrollbar-thumb]:border-[3px]",
            "[&::-webkit-scrollbar-thumb]:border-[rgb(50,50,50)]"
          )}
        >
          <ul className="flex flex-col">
            {links.map((link) => {
              const hasChildren = Boolean(link.children?.length);
              const isOpen = Boolean(openGroups[link.id]);
              const external = isExternal(link);

              const Row = external || !link.href ? NewTabLink : SameTabLink;

              return (
                <li key={link.id} className="w-full">
                  {/* Linha principal */}
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(link.id)}
                      className={cn(
                        "flex w-full items-center justify-between px-2",
                        "min-h-[54px]",
                        "border-b border-white/10",
                        "transition-colors duration-150",
                        "hover:bg-white/10 active:bg-white/15",
                        "active:scale-[0.99]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon
                          iconUrl={link.iconUrl}
                          title={link.title}
                          IconComponent={link.IconComponent}
                        />
                        <span className="text-sm">{link.title}</span>
                      </div>

                      <span className="pr-2 text-white">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <Row
                      href={link.href}
                      onClick={onNavigate}
                      className={cn(
                        "border-b border-white/10",
                        "transition-colors duration-150",
                        "hover:bg-white/10 active:bg-white/15",
                        "active:scale-[0.99]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon
                          iconUrl={link.iconUrl}
                          title={link.title}
                          IconComponent={link.IconComponent}
                        />
                        <span className="text-sm">{link.title}</span>
                      </div>

                      <span className="w-8" />
                    </Row>
                  )}

                  {/* Children (animação estilo legado) */}
                  {hasChildren && (
                    <div
                      className={cn(
                        "border-b border-white/10",
                        // animação sem plugin: height + opacity + translate
                        "overflow-hidden transition-all duration-200 ease-out",
                        isOpen ? "max-h-96" : "max-h-0"
                      )}
                    >
                      <ul
                        className={cn(
                          "transition-all duration-200 ease-out",
                          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                        )}
                      >
                        {link.children!.map((child: CinnamonLink) => {
                          const childExternal = isExternal(child);
                          const ChildRow = childExternal ? NewTabLink : SameTabLink;

                          return (
                            <li key={child.id} className="w-full">
                              <ChildRow
                                href={child.href}
                                onClick={onNavigate}
                                className={cn(
                                  "min-h-[35px] px-2",
                                  "transition-colors duration-150",
                                  "hover:bg-white/10 active:bg-white/15",
                                  "active:scale-[0.99]"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex w-10 items-center justify-center text-white/70">
                                    •
                                  </span>
                                  <span className="text-sm text-white/90">
                                    {child.title}
                                  </span>
                                </div>
                                <span className="w-8" />
                              </ChildRow>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
