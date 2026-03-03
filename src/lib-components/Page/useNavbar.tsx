// src/lib-components/Page/useNavbar.tsx
"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";

export interface NavbarContextValue {
  navbarProps: NavbarProps;
  setNavbarProps: React.Dispatch<React.SetStateAction<NavbarProps>>;
}

export const NavbarContext = React.createContext<
  NavbarContextValue | undefined
>(undefined);

export function useNavbarContext() {
  return React.useContext(NavbarContext);
}

// igual legado (mas simplificado)
export function useNavbar() {
  const ctx = React.useContext(NavbarContext);
  if (!ctx) throw new Error("Navbar context not available.");
  return {
    ...ctx.navbarProps,
    setTitle: (title: string) => ctx.setNavbarProps((p) => ({ ...p, title })),
    setHaveSearchBar: (haveSearchBar: boolean) =>
      ctx.setNavbarProps((p) => ({ ...p, haveSearchBar })),
    setSideMenuLinks: (sideMenuLinks: any) =>
      ctx.setNavbarProps((p) => ({ ...p, sideMenuLinks })),
    setSearchFuncion: (searchFunction: any) =>
      ctx.setNavbarProps((p) => ({ ...p, searchFunction })),
  };
}
