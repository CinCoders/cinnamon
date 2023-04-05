import Keycloak from 'keycloak-js';

export function hasAccess(keycloak: Keycloak, roles: Array<string>) {
  if (roles.includes('*')) return true;
  for (let i = 0; i < roles.length; i += 1) {
    if (keycloak.hasRealmRole(roles[i])) return true;
  }
  return false;
}
