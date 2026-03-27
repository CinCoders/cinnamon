import type { ReactNode } from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import type { FooterProps } from "@/lib-components/Footer/Footer";

import { ToastClientShell, NavbarClientShell, FooterClientShell } from "./PageClientBridges";

export interface PageServerProps {
  navbar?: NavbarProps;
  footer?: FooterProps;
  children: ReactNode;
  centralized?: boolean;
  flexDirection?: "column" | "column-reverse" | "row";
  haveToast?: boolean;
  components?: {
    navbar?: ReactNode;
    footer?: ReactNode;
    toastContainer?: ReactNode;
  };
}

export function PageServer({
  navbar,
  footer,
  children,
  centralized = false,
  flexDirection = "column",
  haveToast = false,
  components,
}: PageServerProps) {
  const renderedNavbar =
    components?.navbar ?? (navbar ? <NavbarClientShell {...navbar} /> : null);
  const renderedFooter =
    components?.footer ?? (footer ? <FooterClientShell {...footer} /> : null);
  const renderedToast =
    haveToast && !components?.toastContainer ? (
      <ToastClientShell />
    ) : (
      components?.toastContainer ?? null
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {renderedNavbar}

      <main
        className="cinnamon-page-main flex w-full flex-1 bg-white"
        style={{
          minHeight: "calc(100vh - var(--cinnamon-shell-offset, 0px))",
          padding: "20px clamp(10px, 2%, 40px)",
          alignItems: centralized ? "center" : "normal",
          justifyContent: centralized ? "center" : "normal",
          flexDirection,
        }}
      >
        {renderedToast}
        {children}
      </main>

      {renderedFooter}
    </div>
  );
}
