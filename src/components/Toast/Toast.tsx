"use client";

import * as React from "react";
import {
  ToastContainer as ToastifyContainer,
  toast,
} from "react-toastify";
import type { ToastContainerProps as ToastProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContainerProps {
  toastProps: ToastProps;
  topInitialPosition: number;
}

export function ToastContainer({ topInitialPosition, toastProps }: ToastContainerProps) {
  const top = (topInitialPosition ?? 0) + 16;

  return (
    <>
      <style>{`
        .Toastify__toast-container--top-right { top: ${top}px; }
      `}</style>
      <ToastifyContainer {...toastProps} />
    </>
  );
}

export { toast };
