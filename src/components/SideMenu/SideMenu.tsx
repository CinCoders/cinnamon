// cinnamon-v2/src/components/SideMenu/SideMenu.tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Link as CinnamonLink, SideMenuLink, LinkComponent } from "@/interfaces";
import { DefaultAnchor } from "@/lib/DefaultAnchor";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IconRenderer } from "@/lib-components/IconRender";

export interface SideMenuProps {
  links: SideMenuLink[];
  top: string; // ex: "64px"
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  linkComponent?: LinkComponent;
  /**
   * href da rota atual. A lib é agnóstica de router: o consumidor passa
   * `usePathname()` (Next) ou `useLocation().pathname` (react-router).
   * Quando bate com o `href` de um item, o trilho de acento o destaca.
   */
  activeHref?: string;
}

// deslocamento vertical da curva que liga o trilho ao item (px)
const RAIL_CORNER = 8;
const RAIL_DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

function isExternal(link?: { external?: boolean; href?: string }) {
  return Boolean(link?.external);
}

/**
 * Trilho de acento animado: linha vertical + curva que segue o centro
 * vertical de um item (ativo ou sob hover/foco). Portado do HookSidebar.
 */
function Rail({
  from = 0,
  y,
  visible,
  color,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const travel = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn("pointer-events-none absolute inset-y-0 left-0 w-3", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - RAIL_CORNER - from) }}
        transition={travel}
        style={{ backgroundImage: RAIL_DASH }}
        className="absolute left-1 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - RAIL_CORNER }}
        transition={travel}
        width="12"
        height="9"
        viewBox="0 0 12 9"
        fill="none"
        className="absolute left-1"
      >
        <path
          d="M0.5 0a8 8 0 0 0 8 8H12"
          stroke="currentColor"
          strokeDasharray="2 2"
        />
      </motion.svg>
    </motion.span>
  );
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
  iconId,
  className,
}: {
  iconUrl?: string;
  title?: string;
  IconComponent?: React.ComponentType<{ className?: string }>;
  iconId?: SideMenuLink["iconId"];
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
      ) : iconId ? (
        <IconRenderer iconId={iconId} className="h-5 w-5" />
      ) : null}
    </span>
  );
}

function SameTabLink({
  href,
  onClick,
  children,
  className,
  linkComponent,
  "aria-current": ariaCurrent,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  linkComponent: LinkComponent;
  "aria-current"?: React.AriaAttributes["aria-current"];
}) {
  const LinkImpl = linkComponent;
  return (
    <LinkImpl
      href={href ?? "#"}
      onClick={onClick}
      aria-current={ariaCurrent}
      className={cn(
        "flex min-h-[54px] w-full cursor-pointer items-center justify-between px-2 text-white no-underline",
        className
      )}
    >
      {children}
    </LinkImpl>
  );
}

function NewTabLink({
  href,
  onClick,
  children,
  className,
  "aria-current": ariaCurrent,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  // aceito por compat com SameTabLink no ponto de uso; links externos sempre usam <a>
  linkComponent?: LinkComponent;
  "aria-current"?: React.AriaAttributes["aria-current"];
}) {
  return (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-current={ariaCurrent}
      className={cn(
        "flex min-h-[54px] w-full cursor-pointer items-center justify-between px-2 text-white no-underline",
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
  linkComponent,
  activeHref,
}: SideMenuProps) {
  const LinkImpl = linkComponent ?? DefaultAnchor;
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

  // --- trilho de acento -----------------------------------------------------
  // Um índice por item de topo (grupos são medidos pela linha principal, não
  // pelos filhos): mede o centro vertical relativo à <ul>.
  const listRef = React.useRef<HTMLUListElement>(null);
  const rowRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = React.useState<number[]>([]);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [pointerInside, setPointerInside] = React.useState(false);
  const [focusInside, setFocusInside] = React.useState(false);

  const activeIndex =
    activeHref === undefined
      ? -1
      : links.findIndex((l) => l.href === activeHref);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        rowRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0
        )
      );

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [links, openGroups]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  // acima do item ativo o trilho de acento já cobre o vão: desenha só a curva
  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - RAIL_CORNER)
      : (activeY ?? 0);

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
          transform: visibility ? "translateX(0)" : "translateX(-100%)",
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
          <ul
            ref={listRef}
            className="relative flex flex-col"
            onMouseLeave={() => {
              setPointerInside(false);
              setHoverIndex(null);
            }}
          >
            <Rail
              from={hoverFrom}
              y={hoverY}
              visible={
                (pointerInside || focusInside) && hoverIndex !== activeIndex
              }
              className="text-white/30"
            />
            <Rail
              y={activeY}
              visible={activeY !== null}
              color="var(--color-cinnamon-primary)"
            />

            {links.map((link, index) => {
              const hasChildren = Boolean(link.children?.length);
              const isOpen = Boolean(openGroups[link.id]);
              const external = isExternal(link);
              const isActive = index === activeIndex;

              const Row = external || !link.href ? NewTabLink : SameTabLink;

              return (
                <li
                  key={link.id}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="w-full"
                  onMouseEnter={() => {
                    setHoverIndex(index);
                    setPointerInside(true);
                  }}
                  onFocus={() => {
                    setHoverIndex(index);
                    setFocusInside(true);
                  }}
                  onBlur={() => setFocusInside(false)}
                >
                  {/* Linha principal */}
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(link.id)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between px-2",
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
                          iconId={link.iconId}
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
                      linkComponent={LinkImpl}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "border-b border-white/10",
                        "transition-colors duration-150",
                        "hover:bg-white/10 active:bg-white/15",
                        "active:scale-[0.99]",
                        isActive && "bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon
                          iconUrl={link.iconUrl}
                          title={link.title}
                          IconComponent={link.IconComponent}
                          iconId={link.iconId}
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
                          const childActive =
                            activeHref !== undefined && child.href === activeHref;

                          return (
                            <li key={child.id} className="w-full">
                              <ChildRow
                                href={child.href}
                                onClick={onNavigate}
                                linkComponent={LinkImpl}
                                aria-current={childActive ? "page" : undefined}
                                className={cn(
                                  "min-h-[35px] px-2",
                                  "transition-colors duration-150",
                                  "hover:bg-white/10 active:bg-white/15",
                                  "active:scale-[0.99]",
                                  childActive && "bg-white/10"
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
