"use client";

import forbidden403Raw from "@/assets/icons/forbidden_403.svg?raw";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type LegacyForbiddenAuth = {
  user?: {
    profile?: {
      email?: string;
    };
  } | null;
  signoutRedirect?: (options?: {
    post_logout_redirect_uri?: string;
  }) => Promise<unknown> | unknown;
};

export interface ForbiddenPageProps {
  auth?: LegacyForbiddenAuth;
  publicURL?: string;
}

const forbidden403 = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(forbidden403Raw)}`;

export function ForbiddenPage({ auth, publicURL }: ForbiddenPageProps) {
  const email = auth?.user?.profile?.email ?? "";
  const baseURL = publicURL ?? "/";

  async function handleLogout() {
    if (!auth?.signoutRedirect) return;

    await auth.signoutRedirect({
      post_logout_redirect_uri: `${window.location.origin}${baseURL}`,
    });
  }

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 py-10 text-center">
      <img
        src={forbidden403}
        alt="Imagem indicando erro 403 - acesso negado"
        className="h-auto w-40 sm:w-100 md:w-120 lg:w-140 xl:w-160"
      />

      <p className="mt-4 text-[clamp(1.2rem,1.5vw,1.6rem)] font-bold text-slate-900">
        You are logged in as:
      </p>

      <div className="mt-3 flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB1E2F] text-sm font-semibold text-white">
          {(email.charAt(0) || "?").toUpperCase()}
        </div>
        <p className="text-[clamp(1rem,1.3vw,1.15rem)] text-[#DB1E2F]">
          {email || "unknown user"}
        </p>
      </div>

      {auth?.signoutRedirect ? (
        <Button
          variant="outline"
          className="mt-6 rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
          onClick={() => void handleLogout()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      ) : null}
    </div>
  );
}
