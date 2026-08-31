"use client";

import React from "react";
import { AuthProvider as OidcAuthProvider, useAuth, type AuthProviderProps } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

// Single real OIDC provider for the whole demo (Authorization Code + PKCE, public client).
// Wraps the app in app/layout.tsx so client pages and the server-session bridge
// share one Keycloak session.
const KC_AUTHORITY = process.env.NEXT_PUBLIC_KC_AUTHORITY;
const KC_CLIENT_ID = process.env.NEXT_PUBLIC_KC_CLIENT_ID;

// The dev server is always http://localhost:3000. Keep the redirect URI STABLE
// (not window.location.pathname) so react-oidc-context doesn't loop the callback.
const APP_ORIGIN = "http://localhost:3000";

// Strip ?code=&state= after the redirect callback, keeping the user on the page
// they started login from.
function onSigninCallback() {
  const url = new URL(window.location.href);
  for (const p of ["code", "state", "session_state", "iss"]) url.searchParams.delete(p);
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

// Built once at module load — a fresh object or store per render makes
// react-oidc-context re-init the UserManager and flip isLoading forever.
const oidcConfig: AuthProviderProps | null =
  KC_AUTHORITY && KC_CLIENT_ID
    ? {
        authority: KC_AUTHORITY,
        client_id: KC_CLIENT_ID,
        redirect_uri: `${APP_ORIGIN}/`,
        post_logout_redirect_uri: `${APP_ORIGIN}/login`,
        response_type: "code",
        scope: "openid profile email",
        automaticSilentRenew: true,
        onSigninCallback,
        userStore:
          typeof window !== "undefined"
            ? new WebStorageStateStore({ store: window.localStorage })
            : undefined,
      }
    : null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!oidcConfig) {
    return (
      <div style={{ padding: "1rem", background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 6, margin: "1rem" }}>
        <strong>AuthProvider:</strong> defina <code>NEXT_PUBLIC_KC_AUTHORITY</code> e{" "}
        <code>NEXT_PUBLIC_KC_CLIENT_ID</code> (veja <code>.env</code>). Suba o Keycloak com{" "}
        <code>docker compose up -d</code>.
      </div>
    );
  }

  return <OidcAuthProvider {...oidcConfig}>{children}</OidcAuthProvider>;
}

export { useAuth };
