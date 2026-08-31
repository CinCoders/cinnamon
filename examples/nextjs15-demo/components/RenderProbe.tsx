"use client";

import { useEffect, useState } from "react";

type RenderProbeProps = {
  label?: string;
};

export function RenderProbe({ label }: RenderProbeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render nothing until hydration is complete to avoid mismatch.
  // After hydration the badge flips to CLIENT.
  const where = isClient ? "CLIENT" : "SERVER";
  const color = isClient ? "#2563eb" : "#16a34a";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 4,
        background: color,
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1,
        marginLeft: 8,
      }}
    >
      {label ? `${label}: ` : ""}
      {where}
    </span>
  );
}
