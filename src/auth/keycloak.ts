import type { CinnamonSession, OidcAuthLike } from "./types";

export type KeycloakPayload = {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  email?: string;
  name?: string;
  preferred_username?: string;
  sub?: string;
};

/**
 * Decodifica o payload do JWT sem validar assinatura.
 * - Não usar para autorização real no server
 * - Serve apenas para extrair claims/roles em fluxos client ou de adaptação
 */
export function unsafeDecodeJwtPayload<T = unknown>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    // atob só existe no browser; Buffer no Node
    const json =
      typeof atob === "function"
        ? decodeURIComponent(
            atob(padded)
              .split("")
              .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
              .join("")
          )
        : Buffer.from(padded, "base64").toString("utf-8");

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Extrai roles do token do Keycloak sem validar assinatura.
 * - Não usar para autorização real no server
 * - Mantém o comportamento legado: realm_access.roles
 */
export function unsafeDecodeRolesFromKeycloakAccessToken(accessToken: string): string[] {
  const payload = unsafeDecodeJwtPayload<KeycloakPayload>(accessToken);
  return payload?.realm_access?.roles ?? [];
}

// Novo helper da v2: transforma o provider client em CinnamonSession.
// Isso permite que o restante da autorização trabalhe com um contrato
// estável, independentemente do provider usado no consumer.
export function sessionFromOidcAuth(auth: OidcAuthLike): CinnamonSession {
  if (!auth.user) {
    return {
      isAuthenticated: false,
      roles: [],
    };
  }

  const profile = auth.user.profile;

  return {
    isAuthenticated: auth.isAuthenticated,
    roles: unsafeDecodeRolesFromKeycloakAccessToken(auth.user.access_token),
    user: {
      id: profile?.sub,
      email: profile?.email,
      name: profile?.name,
      username: profile?.preferred_username,
    },
    raw: auth.user,
  };
}
