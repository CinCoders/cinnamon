import type { ReactNode } from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import type { FooterProps } from "@/lib-components/Footer/Footer";

import { Navbar } from "@/lib-components/Navbar/Navbar";
import { Footer } from "@/lib-components/Footer/Footer";

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

/* 
TO DO
- Tornar PageServer padrão, com isso os componentes Navbar e Footer, que são clients, devem ser renderizados apenas quando chegar no front
*/

export function PageServer({
  navbar,
  footer,
  children,
  centralized = false,
  flexDirection = "column",
  haveToast = false,
  components,
}: PageServerProps) {
  const cinnamonNavbar = navbar ? <Navbar {...navbar} /> : null;
  const cinnamonFooter = footer ? <Footer {...footer} /> : null;

  return (
    <>
      {components?.navbar ?? cinnamonNavbar}

      <main
        className="flex w-full bg-white"
        style={{
          minHeight: "100vh",
          padding: "20px clamp(10px, 2%, 40px)",
          alignItems: centralized ? "center" : "normal",
          justifyContent: centralized ? "center" : "normal",
          flexDirection,
          flexGrow: 1,
        }}
      >
        {haveToast ? (components?.toastContainer ?? null) : null}
        {children}
      </main>

      {components?.footer ?? cinnamonFooter}
    </>
  );
}
