"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      expand
      position="top-right"
    />
  );
}
