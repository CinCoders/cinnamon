import "@cincoders/cinnamon/cinnamon.css";
import "./demo.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "../components/AuthProvider";
import { ServerSessionBridge } from "../components/ServerSessionBridge";

export const metadata: Metadata = {
  title: "Cinnamon v2 — Demo Next 15 App Router",
  description: "Verificação de Server/Client Components e autenticação Keycloak real com a biblioteca Cinnamon v2",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ServerSessionBridge />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
