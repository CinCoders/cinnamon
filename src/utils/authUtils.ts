import { Buffer } from 'buffer';
import { AuthContextProps } from 'react-oidc-context';

export function jwtDecode(token: string): KeycloakPayload {
  const parsedToken = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
  );
  return parsedToken;
}

export function hasAccess(auth: AuthContextProps, roles: Array<string>) {
  if (auth.user) {
    const { realm_access } = jwtDecode(auth.user.access_token);
    if (realm_access.roles?.includes('*')) return true;
    for (const role of roles) {
      if (realm_access.roles?.includes(role)) return true;
    }
  }
  return false;
}

export interface KeycloakPayload {
  acr?: string | string[];
  'allowed-origins'?: string[];
  auth_time?: number;
  azp?: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  name: string;
  preferred_username?: string;
  realm_access: {
    roles?: string[];
  };
  resource_access: {
    account: {
      roles?: string[];
    };
  };
  scope?: string;
  session_state: string;
  sid?: string;
  type: string;
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}
