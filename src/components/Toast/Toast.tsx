"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ToastType = "success" | "error" | "info" | "warning" | "default";

export interface ToastOptions {
  /** ms until auto-dismiss. 0 disables it. */
  duration?: number;
}

interface ToastItem {
  id: number;
  message: React.ReactNode;
  type: ToastType;
  duration: number;
}

type Position =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

// react-toastify accepted a superset of these; we keep the two the
// consumers actually pass so the call sites don't change.
export interface ToastContainerProps {
  toastProps?: {
    position?: Position;
    autoClose?: number | false;
  };
  topInitialPosition?: number;
}

const DEFAULT_DURATION = 3000;

// --- imperative store -------------------------------------------------------
// A single module-level store lets `toast.*` be called from anywhere without
// a context, matching the old react-toastify ergonomics.

const listeners = new Set<(items: ToastItem[]) => void>();
let items: ToastItem[] = [];
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener(items));
}

function add(message: React.ReactNode, type: ToastType, options?: ToastOptions) {
  const id = nextId++;
  const duration = options?.duration ?? DEFAULT_DURATION;
  items = [...items, { id, message, type, duration }];
  emit();
  return id;
}

function dismiss(id: number) {
  items = items.filter((item) => item.id !== id);
  emit();
}

type ToastFn = ((message: React.ReactNode, options?: ToastOptions) => number) & {
  success: (message: React.ReactNode, options?: ToastOptions) => number;
  error: (message: React.ReactNode, options?: ToastOptions) => number;
  info: (message: React.ReactNode, options?: ToastOptions) => number;
  warning: (message: React.ReactNode, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
};

export const toast: ToastFn = Object.assign(
  (message: React.ReactNode, options?: ToastOptions) =>
    add(message, "default", options),
  {
    success: (message: React.ReactNode, options?: ToastOptions) =>
      add(message, "success", options),
    error: (message: React.ReactNode, options?: ToastOptions) =>
      add(message, "error", options),
    info: (message: React.ReactNode, options?: ToastOptions) =>
      add(message, "info", options),
    warning: (message: React.ReactNode, options?: ToastOptions) =>
      add(message, "warning", options),
    dismiss,
  },
);

// --- presentation ---------------------------------------------------------

const icons: Record<ToastType, React.ReactNode> = {
  default: <Info className="h-5 w-5 text-slate-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
};

const tone: Record<ToastType, string> = {
  default: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
  error: "border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950",
  info: "border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
  success:
    "border-emerald-100 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950",
  warning:
    "border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
};

const enterX: Record<string, number> = { left: -50, right: 50, center: 0 };

function ToastRow({
  item,
  side,
  onClose,
}: {
  item: ToastItem;
  side: "left" | "right" | "center";
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (item.duration <= 0) return;
    const timer = setTimeout(onClose, item.duration);
    return () => clearTimeout(timer);
  }, [item.duration, onClose]);

  const x = enterX[side];

  return (
    <motion.div
      layout
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, x }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, scale: 0.8, x, transition: { duration: 0.15 } }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring" as const, bounce: 0.1, duration: 0.25 }
      }
      className={`pointer-events-auto flex w-80 items-center gap-3 rounded-lg border p-4 shadow-lg ${tone[item.type]}`}
    >
      <div className="flex-shrink-0">{icons[item.type]}</div>
      <p className="flex-1 text-sm text-foreground">{item.message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="flex-shrink-0 cursor-pointer rounded-full p-1 text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function anchorClasses(position: Position, top: number): React.CSSProperties {
  const vertical = position.startsWith("top")
    ? { top }
    : { bottom: 16 };
  const horizontal = position.endsWith("right")
    ? { right: 16 }
    : position.endsWith("left")
      ? { left: 16 }
      : { left: "50%", transform: "translateX(-50%)" };
  return { position: "fixed", zIndex: 9999, ...vertical, ...horizontal };
}

export function ToastContainer({
  toastProps,
  topInitialPosition = 0,
}: ToastContainerProps) {
  const position = toastProps?.position ?? "top-right";
  const autoClose = toastProps?.autoClose;
  const [list, setList] = React.useState<ToastItem[]>(items);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const listener = (next: ToastItem[]) => setList(next);
    listeners.add(listener);
    setList(items);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!mounted) return null;

  const side: "left" | "right" | "center" = position.endsWith("right")
    ? "right"
    : position.endsWith("left")
      ? "left"
      : "center";
  const column = position.startsWith("top")
    ? "flex-col"
    : "flex-col-reverse";

  return createPortal(
    <div
      className={`pointer-events-none flex ${column} gap-3`}
      style={anchorClasses(position, topInitialPosition + 16)}
    >
      <AnimatePresence initial={false}>
        {list.map((item) => (
          <ToastRow
            key={item.id}
            item={{
              ...item,
              // container-level autoClose overrides the per-call default,
              // but an explicit per-call duration still wins.
              duration:
                autoClose === false
                  ? 0
                  : item.duration === DEFAULT_DURATION && typeof autoClose === "number"
                    ? autoClose
                    : item.duration,
            }}
            side={side}
            onClose={() => dismiss(item.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
