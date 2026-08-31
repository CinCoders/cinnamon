"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

function readCookie(name: string): string {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : "anon";
}

// Mirrors the real Keycloak access token into an httpOnly cookie so Server
// Components (getServerSession) can validate it against the realm JWKS.
// Stands in for a BFF: in a real app the token would be set server-side in the
// OIDC callback and never touch client JS.
//
// /api/auth/session drops a readable "cinnamon_session_state" cookie (the user's
// sub, or "anon"). This bridge syncs only when that disagrees with the live OIDC
// state, then calls router.refresh() so Server Components re-render once.
export function ServerSessionBridge() {
  const auth = useAuth();
  const router = useRouter();
  const syncing = useRef(false);

  useEffect(() => {
    // Wait for react-oidc-context to finish loading / restoring from storage.
    if (auth.isLoading || auth.activeNavigator) return;
    if (syncing.current) return;

    const browserState = auth.isAuthenticated ? auth.user?.profile.sub ?? "anon" : "anon";
    const serverState = readCookie("cinnamon_session_state");
    if (serverState === browserState) return;

    syncing.current = true;
    const token = auth.isAuthenticated ? auth.user?.access_token ?? null : null;
    const req = token
      ? fetch("/api/auth/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ access_token: token }),
        })
      : fetch("/api/auth/session", { method: "DELETE" });

    req
      .then((res) => {
        if (res.ok) router.refresh();
      })
      .finally(() => {
        syncing.current = false;
      });
  }, [
    auth.isLoading,
    auth.activeNavigator,
    auth.isAuthenticated,
    auth.user?.access_token,
    auth.user?.profile.sub,
    router,
  ]);

  return null;
}
