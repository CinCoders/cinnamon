"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import type { SidebarData } from "@/interfaces";

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

export function useNavbar() {
  const ctx = React.useContext(NavbarContext);
  if (!ctx) throw new Error("Navbar context not available.");
  return {
    ...ctx.navbarProps,
    setTitle: (title: string) => ctx.setNavbarProps((p) => ({ ...p, title })),
    setHaveSearchBar: (haveSearchBar: boolean) =>
      ctx.setNavbarProps((p) => ({ ...p, haveSearchBar })),
    setSidebar: (sidebar: SidebarData) =>
      ctx.setNavbarProps((p) => ({ ...p, sidebar })),
    setSearchFunction: (searchFunction: (s: string) => void) =>
      ctx.setNavbarProps((p) => ({ ...p, searchFunction })),
  };
}
