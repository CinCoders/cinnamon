"use client";

import * as React from "react";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import { Navbar } from "@/lib-components/Navbar/Navbar";
import type { FooterProps } from "@/lib-components/Footer/Footer";
import { Footer } from "@/lib-components/Footer/Footer";
import { ToastContainer } from "@/components/Toast/Toast";

type ShellTarget = "nav" | "footer";
type ShellStore = {
  heights: Record<ShellTarget, number>;
  listeners: Set<() => void>;
};

declare global {
  interface Window {
    __cinnamonShellStore?: ShellStore;
  }
}

const cssVarMap: Record<ShellTarget, string> = {
  nav: "--cinnamon-shell-nav-height",
  footer: "--cinnamon-shell-footer-height",
};

function getShellStore(): ShellStore {
  if (typeof window === "undefined") {
    return {
      heights: { nav: 0, footer: 0 },
      listeners: new Set(),
    };
  }

  if (!window.__cinnamonShellStore) {
    window.__cinnamonShellStore = {
      heights: { nav: 0, footer: 0 },
      listeners: new Set(),
    };
  }

  return window.__cinnamonShellStore;
}

function notifyListeners() {
  const store = getShellStore();
  store.listeners.forEach((listener) => listener());
}

function updateCssVar(name: string, value: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(name, `${value}px`);
}

function setShellHeight(target: ShellTarget, value: number) {
  const store = getShellStore();
  store.heights[target] = value;
  updateCssVar(cssVarMap[target], value);
  const offset = store.heights.nav + store.heights.footer;
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
  const [height, setHeight] = React.useState(() => getShellStore().heights[target]);

  React.useEffect(() => {
    const store = getShellStore();
    const listener = () => setHeight(getShellStore().heights[target]);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
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
