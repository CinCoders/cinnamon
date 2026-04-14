"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import { NavbarContext } from "./useNavbar";

export interface NavbarClientProviderProps {
  navbar?: NavbarProps;
  children: React.ReactNode;
}

export function NavbarClientProvider({
  navbar,
  children,
}: NavbarClientProviderProps) {
  const [navbarProps, setNavbarProps] = React.useState<NavbarProps>({
    ...(navbar ?? {}),
  });

  React.useEffect(() => {
    setNavbarProps({ ...(navbar ?? {}) });
  }, [navbar]);

  const ctxValue = React.useMemo(
    () => ({ navbarProps, setNavbarProps }),
    [navbarProps],
  );

  return <NavbarContext.Provider value={ctxValue}>{children}</NavbarContext.Provider>;
}
