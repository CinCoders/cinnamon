import { describe, expect, it } from "vitest";
import { hasAccess } from "./hasAccess";
import { sessionFromOidcAuth, unsafeDecodeRolesFromKeycloakAccessToken } from "./keycloak";
import type { CinnamonSession, OidcAuthLike } from "./types";

function makeToken(payload: unknown): string {
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${b64}.sig`;
}

const authenticated: CinnamonSession = {
  isAuthenticated: true,
  roles: ["admin", "viewer"],
};

describe("hasAccess", () => {
  it("denies when not authenticated", () => {
    expect(hasAccess({ isAuthenticated: false, roles: ["admin"] }, ["admin"])).toBe(false);
  });

  it("denies for null / undefined subject", () => {
    expect(hasAccess(null, ["admin"])).toBe(false);
    expect(hasAccess(undefined, ["admin"])).toBe(false);
  });

  it("grants total access with '*'", () => {
    expect(hasAccess(authenticated, ["*"])).toBe(true);
    expect(hasAccess({ isAuthenticated: true, roles: [] }, ["*"])).toBe(true);
  });

  it("grants when at least one permitted role matches", () => {
    expect(hasAccess(authenticated, ["editor", "viewer"])).toBe(true);
  });

  it("denies when no permitted role matches", () => {
    expect(hasAccess(authenticated, ["editor"])).toBe(false);
  });

  it("normalizes an OidcAuthLike subject", () => {
    const auth: OidcAuthLike = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        access_token: makeToken({ realm_access: { roles: ["admin"] } }),
        profile: { sub: "u1" },
      },
      signinRedirect: () => {},
    };
    expect(hasAccess(auth, ["admin"])).toBe(true);
    expect(hasAccess(auth, ["nope"])).toBe(false);
  });
});

describe("unsafeDecodeRolesFromKeycloakAccessToken", () => {
  it("returns realm roles", () => {
    const token = makeToken({ realm_access: { roles: ["realm-a", "realm-b"] } });
    expect(unsafeDecodeRolesFromKeycloakAccessToken(token)).toEqual(["realm-a", "realm-b"]);
  });

  it("merges realm roles with all client roles by default", () => {
    const token = makeToken({
      realm_access: { roles: ["realm-a"] },
      resource_access: {
        "client-x": { roles: ["x-read"] },
        "client-y": { roles: ["y-write"] },
      },
    });
    expect(unsafeDecodeRolesFromKeycloakAccessToken(token).sort()).toEqual(
      ["realm-a", "x-read", "y-write"].sort(),
    );
  });

  it("restricts client roles to a given clientId", () => {
    const token = makeToken({
      realm_access: { roles: ["realm-a"] },
      resource_access: {
        "client-x": { roles: ["x-read"] },
        "client-y": { roles: ["y-write"] },
      },
    });
    expect(unsafeDecodeRolesFromKeycloakAccessToken(token, "client-x").sort()).toEqual(
      ["realm-a", "x-read"].sort(),
    );
  });

  it("dedupes roles present in both realm and resource access", () => {
    const token = makeToken({
      realm_access: { roles: ["shared"] },
      resource_access: { "client-x": { roles: ["shared", "x-only"] } },
    });
    expect(unsafeDecodeRolesFromKeycloakAccessToken(token).sort()).toEqual(
      ["shared", "x-only"].sort(),
    );
  });

  it("returns [] for a malformed token", () => {
    expect(unsafeDecodeRolesFromKeycloakAccessToken("not-a-jwt")).toEqual([]);
  });
});

describe("sessionFromOidcAuth", () => {
  it("maps an unauthenticated auth object", () => {
    const auth: OidcAuthLike = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      signinRedirect: () => {},
    };
    expect(sessionFromOidcAuth(auth)).toEqual({ isAuthenticated: false, roles: [] });
  });

  it("maps profile and roles from the access token", () => {
    const auth: OidcAuthLike = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        access_token: makeToken({ realm_access: { roles: ["admin"] } }),
        profile: {
          sub: "u1",
          email: "u1@example.com",
          name: "User One",
          preferred_username: "user1",
        },
      },
      signinRedirect: () => {},
    };
    const session = sessionFromOidcAuth(auth);
    expect(session.isAuthenticated).toBe(true);
    expect(session.roles).toEqual(["admin"]);
    expect(session.user).toEqual({
      id: "u1",
      email: "u1@example.com",
      name: "User One",
      username: "user1",
    });
  });

  it("forwards clientId to role extraction", () => {
    const auth: OidcAuthLike = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        access_token: makeToken({
          realm_access: { roles: ["realm-a"] },
          resource_access: {
            "client-x": { roles: ["x-read"] },
            "client-y": { roles: ["y-write"] },
          },
        }),
        profile: { sub: "u1" },
      },
      signinRedirect: () => {},
    };
    expect(sessionFromOidcAuth(auth, "client-x").roles.sort()).toEqual(
      ["realm-a", "x-read"].sort(),
    );
  });
});
