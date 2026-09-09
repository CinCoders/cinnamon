// This is a Server Component (no "use client" directive).
// It imports components from the MAIN entry (@cincoders/cinnamon), NOT the /server entry.
//
// TEST FOR BLOCKER #1:
//   BEFORE fix: runtime error "You're importing a component that needs useState..."
//               because the main bundle has zero "use client" directives.
//   AFTER fix:  renders correctly — Next 15 finds "use client" in each module and
//               sends only the client boundary JS to the browser.

import { RenderProbe } from "../../components/RenderProbe";
import { Navbar, Footer } from "@cincoders/cinnamon";

export default function ServerImportClientPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <Navbar title="Demo — import client do server" />

      <main style={{ padding: "2rem" }}>
        <h1>
          Teste: Server Component importando do entry principal
          <RenderProbe label="esta página" />
        </h1>

        <section style={{ background: "#fef9c3", border: "1px solid #ca8a04", borderRadius: 8, padding: "1rem", marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.5rem" }}>⚠️ O que este teste verifica (Bloqueador #1)</h2>
          <p style={{ margin: 0 }}>
            Esta página é um <strong>Server Component</strong> (sem <code>&quot;use client&quot;</code>).
            Ela importa <code>Navbar</code> e <code>Footer</code> do entry principal{" "}
            <code>@cincoders/cinnamon</code> — ambos são componentes client.
          </p>
          <p>
            <strong>Antes do fix:</strong> erro de runtime — o Vite library mode agrupa tudo num
            único arquivo e remove as diretivas, então o Next não sabe que são componentes client.
            <br />
            <strong>Depois do fix</strong> (<code>preserveModules: true</code> +{" "}
            <code>rollup-preserve-directives</code>): renderiza corretamente.
          </p>
        </section>

        <section>
          <h2>Componentes importados (verificação visual)</h2>
          <p>
            Se você vê esta página sem erro de runtime, o fix #1 funcionou.
          </p>
          <p>Conteúdo renderizado no servidor, componentes client carregados corretamente.</p>
        </section>
      </main>

      <Footer largeFooter={false} />
    </div>
  );
}
