"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DefaultAnchor } from "@/lib/DefaultAnchor";
import type { NotificationItem, LinkComponent } from "@/interfaces";

export interface NotificationsPopupProps {
  notifications?: NotificationItem[];
  loading?: boolean;
  viewAllUrl?: string;
  linkComponent?: LinkComponent;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function NotificationsPopup(props: NotificationsPopupProps) {
  const {
    notifications = [],
    loading = false,
    viewAllUrl,
    linkComponent,
    onMarkAsRead,
    onDismiss,
  } = props;

  const LinkImpl: LinkComponent = linkComponent ?? DefaultAnchor;

  return (
    <div className="flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Avisos</h2>
        {viewAllUrl && (
          <LinkImpl href={viewAllUrl} className="text-xs text-cinnamon-primary no-underline hover:underline">
            Ver todos
          </LinkImpl>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Carregando…
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum aviso por aqui.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  "group relative px-4 py-3",
                  !notification.read && "bg-cinnamon-primary/5",
                )}
              >
                <LinkImpl
                  href={notification.href ?? "#"}
                  className="block no-underline"
                  onClick={() => onMarkAsRead?.(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cinnamon-primary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm text-foreground",
                          !notification.read && "font-semibold",
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.summary && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {notification.summary}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </LinkImpl>

                {onDismiss && (
                  <Button
                    type="button"
                    variant="outline"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full p-0 text-xs opacity-0 group-hover:opacity-100"
                    aria-label="Excluir aviso"
                    onClick={() => onDismiss(notification.id)}
                  >
                    ×
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
