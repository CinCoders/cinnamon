import type { ReactNode } from "react";

export interface PageServerProps {
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

export function PageServer({
  children,
  centralized = false,
  flexDirection = "column",
  haveToast = false,
  components,
}: PageServerProps) {
  return (
    <>
      {components?.navbar ?? null}

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

      {components?.footer ?? null}
    </>
  );
}
