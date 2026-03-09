import type { ReactNode } from "react";

export interface PageServerProps {
  children: ReactNode;
  centralized?: boolean;
  flexDirection?: "column" | "column-reverse" | "row";
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
        {components?.toastContainer ?? null}
        {children}
      </main>

      {components?.footer ?? null}
    </>
  );
}