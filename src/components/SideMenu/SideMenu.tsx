// cinnamon-v2/src/components/SideMenu/SideMenu.tsx
"use client";

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
  visibility?: boolean;
  setVisibility: (open: boolean) => void;
  linkComponent?: LinkComponent;
  /**
   * href da rota atual. A lib é agnóstica de router: o consumidor passa
   * `usePathname()` (Next) ou `useLocation().pathname` (react-router).
   */
  activeHref?: string;
}

export function SideMenu({
  data,
  visibility = false,
  setVisibility,
  linkComponent,
  activeHref,
}: SideMenuProps) {
  // O drawer sobrepõe o Navbar (z-index maior, 100dvh a partir do topo) e é
  // modal: abre por cima de tudo, com backdrop cobrindo a barra também.
  return (
    <Sheet open={visibility} onOpenChange={setVisibility} modal>
      <SheetContent
        side="left"
        showCloseButton={false}
        style={{ top: 0, height: "100dvh" }}
        className="z-[60] w-48 max-w-48 gap-0 p-0"
        overlayClassName="z-[60]"
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
          onClose={() => setVisibility(false)}
          className="min-h-0 flex-1"
        />
      </SheetContent>
    </Sheet>
  );
}
