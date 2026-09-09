// cinnamon-v2/src/components/SideMenu/SideMenu.tsx
"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppSidebar } from "@/components/sidebar-01/app-sidebar";
import { DefaultAnchor } from "@/lib/DefaultAnchor";
import type { LinkComponent, SidebarData } from "@/interfaces";

export interface SideMenuProps {
  data: SidebarData;
  top: string; // ex: "64px"
  visibility?: boolean;
  setVisibility: (open: boolean) => void;
  linkComponent?: LinkComponent;
  /**
   * href da rota atual. A lib é agnóstica de router: o consumidor passa
   * `usePathname()` (Next) ou `useLocation().pathname` (react-router).
   */
  activeHref?: string;
}

// o header do Navbar é `position: sticky`. Quando o consumidor coloca uma
// faixa acima dele (banner de ambiente, aviso, etc.) o topo real do drawer
// deixa de ser o valor fixo do prop `top` e passa a acompanhar a borda
// inferior do header enquanto a página rola. Medimos essa borda em runtime.
const NAVBAR_SELECTOR = ".cinnamon-navbar-inner";

function useResolvedTop(fallback: string) {
  const [top, setTop] = React.useState(fallback);

  React.useEffect(() => {
    const header =
      typeof document === "undefined"
        ? null
        : document.querySelector<HTMLElement>(NAVBAR_SELECTOR);

    if (!header) {
      setTop(fallback);
      return;
    }

    const measure = () => {
      const bottom = header.getBoundingClientRect().bottom;
      setTop(`${Math.max(0, bottom)}px`);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(header);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [fallback]);

  return top;
}

export function SideMenu({
  data,
  top,
  visibility = false,
  setVisibility,
  linkComponent,
  activeHref,
}: SideMenuProps) {
  const topValue = useResolvedTop(top ?? "0px");

  // `modal={false}` + backdrop deslocado abaixo do topo do Navbar: a barra
  // continua visível e clicável (incl. o botão que fecha o drawer), sem
  // ficar sob o scrim. O drawer é "parte" do Navbar, não o sobrepõe.
  return (
    <Sheet open={visibility} onOpenChange={setVisibility} modal={false}>
      <SheetContent
        side="left"
        showCloseButton={false}
        style={{ top: topValue, height: `calc(100dvh - ${topValue})` }}
        className="z-40 w-64 max-w-64 gap-0 p-0"
        overlayClassName="z-40"
        overlayStyle={{ top: topValue }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navegação principal da aplicação</SheetDescription>
        </SheetHeader>

        <AppSidebar
          data={data}
          linkComponent={linkComponent ?? DefaultAnchor}
          activeHref={activeHref}
          onNavigate={() => setVisibility(false)}
          className="min-h-0 flex-1"
        />
      </SheetContent>
    </Sheet>
  );
}
