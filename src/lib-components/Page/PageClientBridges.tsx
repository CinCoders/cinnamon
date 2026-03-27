"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import { Navbar } from "@/lib-components/Navbar/Navbar";
import type { FooterProps } from "@/lib-components/Footer/Footer";
import { Footer } from "@/lib-components/Footer/Footer";
import { ToastContainer } from "@/components/Toast/Toast";

type ShellTarget = "nav" | "footer";

const cssVarMap: Record<ShellTarget, string> = {
  nav: "--cinnamon-shell-nav-height",
  footer: "--cinnamon-shell-footer-height",
};

const shellHeights: Record<ShellTarget, number> = {
  nav: 0,
  footer: 0,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function updateCssVar(name: string, value: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(name, `${value}px`);
}

function setShellHeight(target: ShellTarget, value: number) {
  shellHeights[target] = value;
  updateCssVar(cssVarMap[target], value);
  const offset = shellHeights.nav + shellHeights.footer;
  updateCssVar("--cinnamon-shell-offset", offset);
  notifyListeners();
}

function useShellMeasurement(target: ShellTarget) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const next = element.getBoundingClientRect().height;
      setShellHeight(target, next);
    };

    measure();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(element);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", measure);
      }
      setShellHeight(target, 0);
    };
  }, [target]);

  return ref;
}

function useShellHeight(target: ShellTarget) {
  const [height, setHeight] = React.useState(() => shellHeights[target]);

  React.useEffect(() => {
    const listener = () => setHeight(shellHeights[target]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [target]);

  return height;
}

export function NavbarClientShell(props: NavbarProps) {
  const ref = useShellMeasurement("nav");

  return (
    <div ref={ref}>
      <Navbar {...props} />
    </div>
  );
}

export function FooterClientShell(props: FooterProps) {
  const ref = useShellMeasurement("footer");

  return (
    <div ref={ref}>
      <Footer {...props} />
    </div>
  );
}

export function ToastClientShell() {
  const navHeight = useShellHeight("nav");

  return (
    <ToastContainer
      toastProps={{ position: "top-right" }}
      topInitialPosition={navHeight}
    />
  );
}
