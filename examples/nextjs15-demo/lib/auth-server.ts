import "server-only";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { CinnamonSession } from "@cincoders/cinnamon/server";

export const SESSION_COOKIE = "cinnamon_session";
export const SESSION_STATE_COOKIE = "cinnamon_session_state";

const ISSUER = process.env.KC_ISSUER ?? process.env.NEXT_PUBLIC_KC_AUTHORITY ?? "";
const AUDIENCE = process.env.NEXT_PUBLIC_KC_CLIENT_ID;

// Keycloak access tokens are RS256-signed; verify against the realm's published keys.
const jwks = ISSUER ? createRemoteJWKSet(new URL(`${ISSUER}/protocol/openid-connect/certs`)) : null;

type KeycloakClaims = JWTPayload & {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  email?: string;
  name?: string;
  preferred_username?: string;
};

export async function verifyAccessToken(token: string): Promise<KeycloakClaims | null> {
  if (!jwks) return null;
  try {
    const { payload } = await jwtVerify<KeycloakClaims>(token, jwks, {
      issuer: ISSUER,
      // Keycloak puts the client in `azp`; `aud` is often just "account".
      // Skip strict audience check and rely on issuer + signature + azp below.
    });
    if (AUDIENCE && payload.azp && payload.azp !== AUDIENCE) return null;
    return payload;
  } catch {
    return null;
  }
}

function rolesFromClaims(claims: KeycloakClaims): string[] {
  const realm = claims.realm_access?.roles ?? [];
  const resource = Object.values(claims.resource_access ?? {}).flatMap((c) => c.roles ?? []);
  return Array.from(new Set([...realm, ...resource]));
}

/**
 * Real server-side session: reads the httpOnly cookie set after Keycloak login,
 * verifies the JWT signature/issuer against the realm JWKS, and maps it to the
 * Cinnamon auth contract. Returns an unauthenticated session when there is no
 * valid token (expired, tampered, or logged out).
 */
export async function getServerSession(): Promise<CinnamonSession> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { isAuthenticated: false, roles: [] };

  const claims = await verifyAccessToken(token);
  if (!claims) return { isAuthenticated: false, roles: [] };

  return {
    isAuthenticated: true,
    roles: rolesFromClaims(claims),
    user: {
      id: claims.sub,
      name: claims.name,
      email: claims.email,
      username: claims.preferred_username,
    },
    raw: { iss: claims.iss, exp: claims.exp },
  };
}
