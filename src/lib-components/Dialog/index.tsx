"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DialogProps {
  type: "information" | "alert" | "decision" | "confirmation" | "error";
  title: string;
  children: React.ReactNode;
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptFunction?: () => void;
  rejectFunction?: () => void;
}

const typeToHeaderBg: Record<DialogProps["type"], string> = {
  information: "bg-primary",
  alert: "bg-amber-500",
  decision: "bg-sky-600",
  confirmation: "bg-emerald-600",
  error: "bg-red-600",
};

export function Dialog({
  type,
  title,
  children,
  visibility = false,
  setVisibility,
  acceptLabel = "Ok",
  rejectLabel = "Cancelar",
  acceptFunction,
  rejectFunction,
}: DialogProps) {
  const isSimple = type === "information" || type === "alert";
  const headerBg = typeToHeaderBg[type];

  function onHide() {
    setVisibility(false);
  }

  return (
    <DialogPrimitive.Root
      open={visibility}
      onOpenChange={(open) => setVisibility(open)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          )}
        />

        <DialogPrimitive.Content
        onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-md border border-border bg-background shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          )}
        >
          {/* header bar + title */}
          <div className={cn("flex items-center justify-between rounded-t-md px-4 py-3", headerBg)}>
            <DialogPrimitive.Title className="text-sm font-semibold text-white">
                {title}
            </DialogPrimitive.Title>

            <DialogPrimitive.Close className="rounded-sm p-1 text-white/80 hover:bg-white/20 focus:outline-none">
                ✕
            </DialogPrimitive.Close>
          </div>

          {/* body */}
          <div className="px-6 pb-6 text-sm text-foreground">
            {typeof children === "string" ? <p>{children}</p> : children}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            {isSimple ? (
              <Button type="button" onClick={onHide} className={cn("text-white", headerBg)}>
                {acceptLabel}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={rejectFunction ?? onHide}
                >
                  {rejectLabel}
                </Button>
                <Button
                  type="button"
                  onClick={acceptFunction ?? onHide}
                  className={cn("text-white", headerBg)}
                >
                  {acceptLabel}
                </Button>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
