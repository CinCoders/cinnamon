export type CinnamonUser = {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
};

// Contrato central da auth na Cinnamon.
// A ideia da v2 é que client e server conversem por este formato,
// sem obrigar a lib inteira a depender de um provider específico.
export type CinnamonSession = {
  isAuthenticated: boolean;
  roles: string[];

  // Opcional: útil pra Navbar/telemetria sem acoplar com OIDC
  user?: CinnamonUser;

  // Opcional: dados brutos pra debug/auditoria (não use no servidor se não precisar)
  raw?: unknown;
};

// Adaptador client-side: mantém compatibilidade com react-oidc-context
// sem transformar esse provider no contrato principal da biblioteca.
export type OidcAuthLike = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?:
    | {
      access_token: string;
      profile?: {
        sub?: string;
        email?: string;
        name?: string;
        preferred_username?: string;
        given_name?: string;
        family_name?: string;
      };
    }
    | null;
  signinRedirect: () => Promise<unknown> | unknown;
  signoutRedirect?: () => Promise<unknown> | unknown;
};
