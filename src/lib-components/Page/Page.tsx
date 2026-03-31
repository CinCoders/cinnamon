"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import type { FooterProps } from "@/lib-components/Footer/Footer";
import { Navbar } from "@/lib-components/Navbar/Navbar";
import { Footer } from "@/lib-components/Footer/Footer";
import { NavbarContext } from "./useNavbar";
import { ToastContainer } from "@/components/Toast/Toast";

export interface PageProps {
  navbar?: NavbarProps;
  footer?: FooterProps;
  children: React.ReactNode;
  centralized?: boolean;
  flexDirection?: "column" | "column-reverse" | "row";
  haveToast?: boolean;
  components?: {
    navbar?: React.ReactNode;
    footer?: React.ReactNode;
    toastContainer?: React.ReactNode;
  };
  createNavbarContext?: boolean;
}

export function Page({
  navbar,
  footer,
  children,
  centralized = false,
  flexDirection = "column",
  haveToast = false,
  components,
  createNavbarContext = true,
}: PageProps) {
  const navbarRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  const [navHeight, setNavHeight] = React.useState(0);
  const [footHeight, setFootHeight] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      setNavHeight(navbarRef.current?.offsetHeight ?? 0);
      setFootHeight(footerRef.current?.offsetHeight ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const diff = (navbar ? navHeight : 0) + (footer ? footHeight : 0);

  const [navbarProps, setNavbarProps] = React.useState<NavbarProps>({
    ...(navbar ?? {}),
  });

  React.useEffect(() => {
    if (createNavbarContext && navbar) setNavbarProps({ ...navbar });
  }, [createNavbarContext, navbar]);

  const ctxValue = React.useMemo(
    () => (createNavbarContext ? { navbarProps, setNavbarProps } : undefined),
    [createNavbarContext, navbarProps],
  );

  const cinnamonNavbar = navbar ? <Navbar {...navbar} /> : null;
  const cinnamonFooter = footer ? <Footer {...footer} /> : null;

  return (
    <NavbarContext.Provider value={ctxValue}>
      <div ref={navbarRef}>{components?.navbar ?? cinnamonNavbar}</div>

      <main
        className="cinnamon-page-main flex w-full bg-white"
        style={{
          minHeight: `calc(100vh - ${diff}px)`,
          padding: "20px clamp(10px, 2%, 40px)",
          alignItems: centralized ? "center" : "normal",
          justifyContent: centralized ? "center" : "normal",
          flexDirection,
          flexGrow: 1,
        }}
      >
        {haveToast &&
          (components?.toastContainer ?? (
            <ToastContainer
              toastProps={{ position: "top-right" }}
              topInitialPosition={navHeight}
            />
          ))}

        {children}
      </main>

      <div ref={footerRef}>{components?.footer ?? cinnamonFooter}</div>
    </NavbarContext.Provider>
  );
}
