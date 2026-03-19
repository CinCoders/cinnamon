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
 * Decodifica JWT (somente payload) de forma segura para browser/Node.
 * - Não valida assinatura (isso é trabalho do backend)
 * - Serve apenas para extrair claims/roles no CLIENT
 */
export function decodeJwtPayload<T = unknown>(token: string): T | null {
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
 * Extrai roles do token do Keycloak (realm roles).
 * - Por enquanto mantém o mesmo comportamento do legado: realm_access.roles
 * - Depois podemos evoluir para resource roles se precisar.
 */
export function rolesFromKeycloakAccessToken(accessToken: string): string[] {
  const payload = decodeJwtPayload<KeycloakPayload>(accessToken);
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
    roles: rolesFromKeycloakAccessToken(auth.user.access_token),
    user: {
      id: profile?.sub,
      email: profile?.email,
      name: profile?.name,
      username: profile?.preferred_username,
    },
    raw: auth.user,
  };
}
