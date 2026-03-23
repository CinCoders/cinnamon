// "use client";

// import { createContext, useEffect, useMemo, useRef, useState } from "react";
// import { ToastContainer } from "../../components/Toast";
// import { Footer, type FooterProps } from "../Footer";
// import { Navbar, type NavbarProps } from "../Navbar";
// import { NavbarContextValue } from "./useNavbar";

// export interface PageProps {
//   navbar?: NavbarProps;
//   footer?: FooterProps;
//   children: JSX.Element | JSX.Element[];
//   centralized?: boolean;
//   flexDirection?: "column" | "column-reverse" | "row";
//   haveToast?: boolean;
//   components?: {
//     navbar?: JSX.Element;
//     footer?: JSX.Element;
//     toastContainer?: JSX.Element;
//   };
//   createNavbarContext: boolean;
// }

// interface Dimensions {
//   navHeight: number;
//   footHeight: number;
// }

// export const NavbarContext = createContext<NavbarContextValue | undefined>(
//   undefined,
// );

// export function Page({
//   navbar,
//   footer,
//   children,
//   centralized = false,
//   flexDirection,
//   haveToast = false,
//   components,
//   createNavbarContext = true,
// }: PageProps) {
//   const navbarRef = useRef<HTMLDivElement>(null);
//   const footerRef = useRef<HTMLDivElement>(null);

//   const [dimensions, setDimensions] = useState<Dimensions>({
//     navHeight: 0,
//     footHeight: 0,
//   });
//   const firstRender = useRef<boolean>(true);

//   useEffect(() => {
//     setDimensions({
//       navHeight: navbarRef.current ? navbarRef.current.offsetHeight : 0,
//       footHeight: footerRef.current ? footerRef.current.offsetHeight : 0,
//     });
//   }, [navbarRef.current?.offsetHeight, footerRef.current?.offsetHeight]);

//   let diff = navbar ? dimensions.navHeight : 0;
//   diff += footer ? dimensions.footHeight : 0;

//   const [navbarProps, setNavbarProps] = useState<NavbarProps>({
//     ...(navbar ?? {}),
//   });

//   useEffect(() => {
//     if (createNavbarContext && !firstRender.current) {
//       setNavbarProps({ ...(navbar ?? {}) });
//     } else {
//       firstRender.current = false;
//     }
//   }, [navbar, createNavbarContext]);

//   const navbarContextClass = useMemo(() => {
//     if (createNavbarContext) {
//       return new NavbarContextValue({ ...navbarProps }, setNavbarProps);
//     }
//     return undefined;
//   }, [createNavbarContext, navbarProps]);

//   useEffect(() => {
//     firstRender.current = true;
//   }, [navbarContextClass]);

//   const cinnamonNavbar: JSX.Element = navbar ? <Navbar {...navbar} /> : <></>;
//   const cinnamonFooter: JSX.Element = footer ? <Footer {...footer} /> : <></>;

//   return (
//     <NavbarContext.Provider value={navbarContextClass}>
//       <div ref={navbarRef} style={{ display: "inline" }}>
//         {components?.navbar ? components.navbar : cinnamonNavbar}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//         <main
//           className="flex bg-white px-[clamp(10px,2%,40px)] py-5"
//           style={{
//             minHeight: `calc(100vh - ${diff}px)`,
//             alignItems: centralized ? "center" : "normal",
//             justifyContent: centralized ? "center" : "normal",
//             flexDirection: flexDirection ?? "column",
//             flexGrow: 1,
//             zIndex: 1000,
//           }}
//         >
//           {haveToast &&
//             (components?.toastContainer ? (
//               components.toastContainer
//             ) : (
//               <ToastContainer
//                 toastProps={{ position: "top-right" }}
//                 topInitialPosition={dimensions.navHeight}
//               />
//             ))}

//           {children}
//         </main>
//       </div>

//       <div ref={footerRef} style={{ display: "inline" }}>
//         {components?.footer ? components.footer : cinnamonFooter}
//       </div>
//     </NavbarContext.Provider>
//   );
// }

// src/lib-components/Page/Page.tsx
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
    // quando recebe novas props externas
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
