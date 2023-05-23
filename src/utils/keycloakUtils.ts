import Keycloak from 'keycloak-js';

export function hasAccess(keycloak: Keycloak, roles: Array<string>) {
  if (roles.includes('*')) return true;
  for (const role of roles) {
    if (keycloak.hasRealmRole(role)) return true;
  }
  return false;
}
