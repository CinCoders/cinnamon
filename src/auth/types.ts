export type CinnamonSession = {
  isAuthenticated: boolean;
  roles: string[];

  // Opcional: útil pra Navbar/telemetria sem acoplar com OIDC
  user?: {
    id?: string;
    email?: string;
    name?: string;
    username?: string;
  };

  // Opcional: dados brutos pra debug/auditoria (não use no servidor se não precisar)
  raw?: unknown;
};
