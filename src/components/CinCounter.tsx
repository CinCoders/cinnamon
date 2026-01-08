"use client";

import { useState } from "react";

export function CinCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ marginBottom: 8 }}>Count: {count}</div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
