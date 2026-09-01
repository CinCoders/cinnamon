"use client";

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
  const mergedStyle = {
    ...(toastProps.style ?? {}),
    top,
  };

  return (
    <ToastifyContainer {...toastProps} style={mergedStyle} />
  );
}

export { toast };
