import type { OidcAuthLike } from "@cincoders/cinnamon";
import type { AuthContextProps } from "react-oidc-context";

// Narrow react-oidc-context's auth object to the structural type the Cinnamon
// client components accept. No token is fabricated — access_token is the real one
// minted by Keycloak.
export function toOidcAuthLike(auth: AuthContextProps): OidcAuthLike {
  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user
      ? {
          access_token: auth.user.access_token,
          profile: {
            sub: auth.user.profile.sub,
            email: auth.user.profile.email,
            name: auth.user.profile.name,
            preferred_username: auth.user.profile.preferred_username,
            given_name: auth.user.profile.given_name as string | undefined,
            family_name: auth.user.profile.family_name as string | undefined,
          },
        }
      : null,
    signinRedirect: () => auth.signinRedirect(),
    signoutRedirect: () => auth.signoutRedirect(),
  };
}
