// src/components/SideMenu/SideMenu.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Link as CinnamonLink, SideMenuLink } from "@/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * SideMenu (cinnamon-v2)
 * - Tailwind only (sem shadcn Collapsible)
 * - Suporta links internos/externos via `external`
 * - Suporta `children` com animação tipo fade/slide (legado)
 * - Drawer simples (overlay + panel) com `top` (offset do header)
 */

export interface SideMenuProps {
  links: SideMenuLink[];
  top: string; // ex: "64px"
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

function isExternal(link?: { external?: boolean; href?: string }) {
  return Boolean(link?.external);
}

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
  // Mantém igual ao legado: SameTabLink era react-router Link.
  // Como cinnamon-v2 é lib, a gente usa <a>. Quem consome decide integrar com router.
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
  // Estado de expand/collapse dos grupos
  const [openGroups, setOpenGroups] = React.useState<Record<number, boolean>>(
    {}
  );

  React.useEffect(() => {
    // reseta/initializa quando lista muda
    const next: Record<number, boolean> = {};
    for (const l of links ?? []) next[l.id] = false;
    setOpenGroups(next);
  }, [links]);

  const close = React.useCallback(() => setVisibility(false), [setVisibility]);

  function toggleGroup(id: number) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function onNavigate() {
    // no legado: clicar fecha o drawer
    close();
  }

  // Top pode ser "64px". Converte pra número pra usar calc.
  const topValue = top ?? "0px";
  const topNum = Number.parseFloat(topValue) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
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

              const Row =
                external || !link.href ? NewTabLink : SameTabLink;

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
                        "hover:bg-white/10 transition-colors",
                        "border-b border-white/10"
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
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <Row
                      href={link.href}
                      onClick={onNavigate}
                      className={cn(
                        "hover:bg-white/10 transition-colors",
                        "border-b border-white/10"
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

                      {/* Espaçador pra alinhar com linhas que tem chevron */}
                      <span className="w-8" />
                    </Row>
                  )}

                  {/* Children (fade/slide “tipo legado”) */}
                  {hasChildren && isOpen && (
                    <ul
                      className={cn(
                        "border-b border-white/10",
                        "animate-in fade-in slide-in-from-top-1"
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
                                "hover:bg-white/10 transition-colors"
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
