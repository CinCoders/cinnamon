import React from "react";

interface ServerBoundaryProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  showDetails?: boolean;
}

/**
 * Server Component Boundary (RSC)
 * Borda vermelha conforme especificação.
 * Executa estritamente no Node.js runtime do servidor.
 */
export function ServerBoundary({
  title,
  description,
  children,
  showDetails = true,
}: ServerBoundaryProps) {
  const serverTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const isServer = typeof window === "undefined";

  return (
    <div
      style={{
        border: "2px solid #ef4444",
        borderRadius: "12px",
        padding: "1.25rem",
        margin: "1rem 0",
        backgroundColor: "rgba(254, 242, 242, 0.4)",
        boxShadow: "0 1px 3px rgba(239, 68, 68, 0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          paddingBottom: "0.75rem",
          marginBottom: "1rem",
          borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.6rem",
              borderRadius: "9999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span style={{ fontSize: "0.65rem" }}>🔴</span> Server Component (RSC)
          </span>
          {title && (
            <span style={{ fontWeight: 600, color: "#991b1b", fontSize: "0.95rem" }}>
              {title}
            </span>
          )}
        </div>

        {showDetails && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.75rem",
              color: "#b91c1c",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <span>Ambiente: <strong>{isServer ? "Node.js (Server)" : "Client"}</strong></span>
            <span>•</span>
            <span>SSR Render: <strong>{serverTime}</strong></span>
          </div>
        )}
      </div>

      {description && (
        <p
          style={{
            fontSize: "0.825rem",
            color: "#7f1d1d",
            margin: "0 0 1rem 0",
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      )}

      <div>{children}</div>
    </div>
  );
}
