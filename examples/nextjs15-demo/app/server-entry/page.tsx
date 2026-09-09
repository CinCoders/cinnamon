// Server Component using the @cincoders/cinnamon/server entry.
// Validates PageWithAuthServer against a REAL server-validated Keycloak session
// (getServerSession → JWKS verify): grant, redirect, and ForbiddenPage paths.

import { redirect } from "next/navigation";
import { PageWithAuthServer } from "@cincoders/cinnamon/server";
import { getServerSession } from "../../lib/auth-server";
import { RenderProbe } from "../../components/RenderProbe";

export const dynamic = "force-dynamic";

export default async function ServerEntryPage() {
  const session = await getServerSession();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>
        Server Entry (<code>@cincoders/cinnamon/server</code>)
        <RenderProbe label="esta página" />
      </h1>

      <section style={{ background: "#f0fdf4", border: "1px solid #16a34a", borderRadius: 8, padding: "1rem", marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 0.5rem" }}>Sessão real do Keycloak</h2>
        <p style={{ margin: 0 }}>
          Abaixo, dados extraídos do <code>access_token</code> após verificação de assinatura/emissor
          contra o JWKS do realm. Faça login em <code>/login</code> como <code>admin</code> ou{" "}
          <code>user</code> para ver a matriz mudar.
        </p>
      </section>

      <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: 4, overflow: "auto" }}>
        {JSON.stringify(session, null, 2)}
      </pre>

      <h2>PageWithAuthServer — exige role &quot;user&quot;</h2>
      <div style={{ border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", marginBottom: "1rem" }}>
        <PageWithAuthServer
          authProps={{
            session,
            permittedRoles: ["user"],
            onUnauthenticated: () => redirect("/login"),
          }}
          navbar={{ title: "Área autenticada (server)", hiddenUser: true }}
          footer={{}}
        >
          <p style={{ padding: "1rem" }}>
            Conteúdo renderizado no servidor para usuário autenticado. <RenderProbe label="conteúdo" />
          </p>
        </PageWithAuthServer>
      </div>

      <h2>PageWithAuthServer — exige role &quot;admin&quot; → ForbiddenPage se logar como user</h2>
      <div style={{ border: "1px solid #fca5a5", borderRadius: 8, overflow: "hidden" }}>
        <PageWithAuthServer
          authProps={{
            session,
            permittedRoles: ["admin"],
            onUnauthenticated: () => redirect("/login"),
          }}
          navbar={{ title: "Área admin (server)", hiddenUser: true }}
          footer={{}}
        >
          <p style={{ padding: "1rem" }}>Visível apenas para admin.</p>
        </PageWithAuthServer>
      </div>
    </div>
  );
}
