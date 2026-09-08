"use client";

import * as React from "react";
import systemsMenuIcon from "@/assets/icons/menu_black.svg";

import type { User, SideMenuLink, System, LinkComponent } from "@/interfaces";
import { SideMenu } from "@/components/SideMenu/SideMenu";
import { HamburgerButton } from "@/components/HamburgerButton/HamburgerButton";
import { UserPopup } from "@/components/UserPopup/UserPopup";
import { SystemsPopup } from "@/components/SystemsPopup/SystemsPopup";
import { IconRenderer } from "@/lib-components/IconRender";
import {
  hasAccess,
  sessionFromOidcAuth,
  type CinnamonSession,
  type OidcAuthLike,
} from "@/auth";

import { cn } from "@/lib/utils";
import { DefaultAnchor } from "@/lib/DefaultAnchor";
import { useNavbarContext } from "@/lib-components/Page/useNavbar";

export interface NavbarProps {
  auth?: OidcAuthLike;
  logoRedirectUrl?: string;
  logoSrc?: string;
  haveSearchBar?: boolean;
  hiddenUser?: boolean;
  title?: string;
  h1?: boolean;
  searchFunction?: (searchString: string) => void;
  user?: User;
  sideMenuLinks?: SideMenuLink[];
  isLandingPage?: boolean;
  systemsList?: System[];
  currentSystemIconUrl?: string;
  children?: React.ReactNode;
  accountManagementUrl?: string;
  /** Injeta um componente de link (ex: `next/link`) para navegação interna sem full reload. */
  linkComponent?: LinkComponent;
}

export function Navbar(props: NavbarProps) {
  const ctx = useNavbarContext();
  const merged = { ...props, ...(ctx?.navbarProps ?? {}) };

  const {
    auth,
    logoRedirectUrl = "/",
    logoSrc,
    haveSearchBar = false,
    searchFunction = () => {},
    hiddenUser = false,
    user = { name: "-", email: "-" },
    title = "",
    h1 = false,
    sideMenuLinks = [],
    isLandingPage = false,
    systemsList = [],
    currentSystemIconUrl,
    children,
    accountManagementUrl,
    linkComponent,
  } = merged;

  const sessionFromUser = React.useMemo<CinnamonSession | null>(() => {
    const roleNames =
      user?.positions
        ?.flatMap(
          (position) =>
            position.roles?.map((role) => role.name).filter(Boolean) ?? [],
        )
        .filter((role): role is string => !!role) ?? [];

    if (!roleNames.length) return null;
    return {
      isAuthenticated: true,
      roles: Array.from(new Set(roleNames)),
      user,
    };
  }, [user]);

  const session = React.useMemo<CinnamonSession | null>(() => {
    if (auth) return sessionFromOidcAuth(auth);
    return sessionFromUser;
  }, [auth, sessionFromUser]);

  const filteredSystemsList = React.useMemo(() => {
    if (!systemsList.length) return [];
    if (!session) return systemsList;

    return systemsList.filter((system) => {
      if (!system.visibleRole) return true;
      return hasAccess(session, [system.visibleRole]);
    });
  }, [session, systemsList]);

  const profile = React.useMemo<User>(() => {
    if (auth?.user?.profile) {
      const p = auth.user.profile;
      return {
        name: p.given_name ?? p.name ?? "",
        email: p.email ?? "",
        username: p.preferred_username ?? "",
      };
    }

    return user;
  }, [auth, user]);

  const [sideMenuOpen, setSideMenuOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");

  const [userOpen, setUserOpen] = React.useState(false);
  const [systemsOpen, setSystemsOpen] = React.useState(false);
  const userPopupRef = React.useRef<HTMLDivElement>(null);
  const systemsPopupRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      if (
        userOpen &&
        userPopupRef.current &&
        !userPopupRef.current.contains(target)
      ) {
        setUserOpen(false);
      }

      if (
        systemsOpen &&
        systemsPopupRef.current &&
        !systemsPopupRef.current.contains(target)
      ) {
        setSystemsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (userOpen) setUserOpen(false);
      if (systemsOpen) setSystemsOpen(false);
    }

    if (!userOpen && !systemsOpen) return;

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [systemsOpen, userOpen]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    searchFunction(e.target.value);
  }

  const Link: LinkComponent = linkComponent ?? DefaultAnchor;

  return (
    <div className="w-full">
      <header className="cinnamon-navbar-inner relative sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="flex h-16 items-center px-4">
          <div className="ml-5 flex items-center gap-2">
            {!isLandingPage && sideMenuLinks.length !== 0 && (
              <HamburgerButton
                isOpen={sideMenuOpen}
                onClick={() => setSideMenuOpen((v) => !v)}
              />
            )}

            {!isLandingPage && currentSystemIconUrl && (
              <IconRenderer iconUrl={currentSystemIconUrl} />
            )}

            <div className="ml-2 text-cinnamon-dark whitespace-nowrap">
              {h1 ? (
                <span className="text-2xl font-semibold">{title}</span>
              ) : (
                <span className="text-xl">{title}</span>
              )}
            </div>
          </div>

          <div className="flex flex-1 justify-end pr-8">
            {haveSearchBar && (
              <input
                className="h-[2.7rem] w-[25vw] max-w-[30rem] rounded-[10px] bg-[#f2f2f2] pl-8 pr-8 outline-none"
                placeholder="Buscar…"
                value={searchString}
                onChange={handleSearch}
              />
            )}
          </div>

          <div
            className={cn(
              "mr-5 flex items-center gap-3",
              haveSearchBar ? "ml-4" : "ml-auto",
            )}
          >
            {!isLandingPage && filteredSystemsList.length > 0 && (
              <div className="relative" ref={systemsPopupRef}>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-shadow duration-150 hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)] focus-visible:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={systemsOpen}
                  aria-label="Abrir lista de sistemas"
                  onClick={() => setSystemsOpen((v) => !v)}
                >
                  <img
                    src={systemsMenuIcon}
                    alt="Systems Menu"
                    className="h-full w-full"
                    style={{
                      filter:
                        "invert(18%) sepia(64%) saturate(3884%) hue-rotate(342deg) brightness(101%) contrast(98%)",
                    }}
                  />
                </button>

                {systemsOpen && (
                  <div className="absolute right-0 top-12 z-[9999]">
                    <SystemsPopup
                      systemsList={filteredSystemsList}
                      linkComponent={linkComponent}
                    />
                  </div>
                )}
              </div>
            )}

            {logoSrc && (
              <Link href={logoRedirectUrl} className="cursor-pointer">
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="mx-3 w-full min-w-[60px] max-w-[120px]"
                />
              </Link>
            )}

            {!hiddenUser && (
              <div className="relative" ref={userPopupRef}>
                <button
                  type="button"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white cursor-pointer transition-shadow duration-150 hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)] focus-visible:outline-none",
                    "bg-cinnamon-primary",
                  )}
                  aria-label="Abrir menu do usuário"
                  onClick={() => setUserOpen((v) => !v)}
                >
                  {(
                    profile.name?.charAt(0) ??
                    profile.username?.charAt(0) ??
                    ""
                  ).toUpperCase()}
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-12 z-[9999]">
                    <UserPopup
                      user={profile}
                      auth={auth}
                      accountManagementUrl={accountManagementUrl}
                      linkComponent={linkComponent}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {!isLandingPage &&
        (children ? (
          children
        ) : (
          <SideMenu
            visibility={sideMenuOpen}
            top="64px"
            setVisibility={setSideMenuOpen}
            links={sideMenuLinks}
            linkComponent={linkComponent}
          />
        ))}
    </div>
  );
}
