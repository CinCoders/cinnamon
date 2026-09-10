"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DefaultAnchor } from "@/lib/DefaultAnchor";
import type { User, LinkComponent } from "@/interfaces";

export type AuthLike = {
  signoutRedirect?: () => void;
};

export type UserLike = Partial<User>;

export interface UserPopupProps {
  user?: UserLike;
  logoutMethod?(): void;
  auth?: AuthLike;
  accountManagementUrl?: string;
  linkComponent?: LinkComponent;
}

export function UserPopup(props: UserPopupProps) {
  const {
    user = { name: "User Display Name", email: "user@example.com" },
    logoutMethod,
    auth,
    accountManagementUrl,
    linkComponent,
  } = props;

  const LinkImpl: LinkComponent = linkComponent ?? DefaultAnchor;

  function logoutFunction() {
    if (logoutMethod) return logoutMethod();
    return auth?.signoutRedirect?.();
  }

  const initial =
    (user?.name?.[0] ?? user?.username?.charAt(0) ?? "").toUpperCase();

  return (
    <div className="w-72 max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="my-4 grid h-28 w-28 place-items-center rounded-full bg-cinnamon-primary text-white text-[50px]">
          {initial}
        </div>

        {/* Nome */}
        <h2 className="mx-2 mb-1 text-center text-base font-semibold break-words text-foreground">
          {user?.name ?? user?.username ?? "User Display Name"}
        </h2>

        {/* Email + status */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Gerenciar conta */}
        {accountManagementUrl ? (
          <Button asChild variant="outline" className="mb-4 h-8 w-40 rounded-full">
            <LinkImpl href={accountManagementUrl}>Gerenciar sua conta</LinkImpl>
          </Button>
        ) : (
          <Button variant="outline" className="mb-4 h-8 w-40 rounded-full" disabled>
            Gerenciar sua conta
          </Button>
        )}

        {/* Positions */}
        {user?.positions?.length ? (
          <div className="w-full pb-2">
            <Accordion.Root className="w-full">
              {user.positions.map((position) => {
                const hasRoles = !!position.roles?.length;

                return (
                  <div key={`position_${position.id}`} className="border-t border-border">
                    <Accordion.Item value={`pos-${position.id}`} disabled={!hasRoles}>
                      <Accordion.Header>
                        <Accordion.Trigger
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                            "text-foreground",
                            "[&[data-panel-open]>span:last-child]:rotate-180",
                            hasRoles ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className="font-medium">{position.name}</span>
                          <span className="transition-transform">
                            ▼
                          </span>
                        </Accordion.Trigger>
                      </Accordion.Header>

                      {hasRoles && (
                        <Accordion.Panel className="overflow-hidden px-0 pb-2">
                          <div className="px-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div className="font-semibold text-foreground">Função</div>
                              <div className="font-semibold text-foreground">Descrição</div>

                              {position.roles!.map((role) => (
                                <React.Fragment key={role.id}>
                                  <div className="text-foreground">{role.name}</div>
                                  <div className="text-muted-foreground">{role.description}</div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </Accordion.Panel>
                      )}
                    </Accordion.Item>
                  </div>
                );
              })}
            </Accordion.Root>
          </div>
        ) : null}

        {/* Logout */}
        <Button
          variant="outline"
          className="mb-4 h-8 w-40 rounded-full"
          onClick={logoutFunction}
          type="button"
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
