"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function createRipple(
  e: React.PointerEvent<HTMLElement>,
  color: string
) {
  const target = e.currentTarget as HTMLElement;

  // garante que o ripple apareça “dentro” do botão
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.backgroundColor = color;

  target.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

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
  /** Mantém o diálogo aberto após acionar accept/reject (default: fecha). */
  keepOpen?: boolean;
}

const dialogAccents: Record<DialogProps["type"], string> = {
  information: "#9C27B0", // MUI secondary.main
  alert: "#ED6C02", // MUI warning.main
  decision: "#0288D1", // MUI info.dark
  confirmation: "#2E7D32", // MUI success.main
  error: "#D32F2F", // MUI error.main
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
  keepOpen = false,
}: DialogProps) {
  const isSimple = type === "information" || type === "alert";
  const accent = dialogAccents[type];

  function onHide() {
    setVisibility(false);
  }

  function handleAccept() {
    acceptFunction?.();
    if (!keepOpen) onHide();
  }

  function handleReject() {
    rejectFunction?.();
    if (!keepOpen) onHide();
  }

  return (
    <DialogPrimitive.Root
      open={visibility}
      onOpenChange={(open) => setVisibility(open)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity duration-150",
            "data-starting-style:opacity-0 data-ending-style:opacity-0"
          )}
        />

        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-md border border-border bg-background shadow-lg",
            "transition-[transform,scale,opacity] duration-150",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0"
          )}
        >
          {/* header bar */}
          <div
            className="h-8 w-full rounded-t-md"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />

          {/* title + message */}
          <div className="px-8 pt-6">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>

            {typeof children === "string" ? (
              <DialogPrimitive.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {children}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description
                render={
                  <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {children}
                  </div>
                }
              />
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-8 py-6">
            {isSimple ? (
              <Button
                type="button"
                onClick={onHide}
                className="text-white"
                style={{ backgroundColor: accent }}
              >
                {acceptLabel}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReject}
                  className="relative overflow-hidden"
                  style={{ color: accent }}
                  onPointerDown={(e) => createRipple(e, `${accent}55`)} // 55 ~ alpha
                >
                  {rejectLabel}
                </Button>
                <Button
                  type="button"
                  onClick={handleAccept}
                  className="relative overflow-hidden text-white"
                  style={{ backgroundColor: accent }}
                  onPointerDown={(e) => createRipple(e, "rgba(255,255,255,.35)")}
                >
                  {acceptLabel}
                </Button>
              </>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
