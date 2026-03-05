// src/lib-components/Navbar/Navbar.tsx
"use client";

import * as React from "react";
import type { JSXElementConstructor } from "react";
import systemsMenuIcon from "@/assets/icons/menu_black.svg";

import type { User, SideMenuLink, System } from "@/interfaces";
import { SideMenu } from "@/components/SideMenu/SideMenu";
import { HamburgerButton } from "@/components/HamburgerButton/HamburgerButton";
import { UserPopup } from "@/components/UserPopup/UserPopup";
import { SystemsPopup } from "@/components/SystemsPopup/SystemsPopup";
import { IconRenderer } from "@/lib-components/IconRender";

import { cn } from "@/lib/utils";
import { useNavbarContext } from "@/lib-components/Page/useNavbar";

export interface NavbarProps {
  auth?: any;
  logoRedirectUrl?: string;
  logoSrc?: string;
  haveSearchBar?: boolean;
  hiddenUser?: boolean;
  title?: string;
  h1?: boolean;
  searchFunction?: (searchString: string) => void;
  searchDropdownLabelsList?: string[]; // (vamos usar depois se quiser)
  logoutFunction?: () => void;
  user?: User;
  sideMenuLinks?: SideMenuLink[];
  isLandingPage?: boolean;
  systemsList?: System[];
  currentSystemIconUrl?: string;
  IconComponent?: React.ComponentType<any>; // ou React.ElementType, mas aí teria que ser <IconComponent /> no JSX
  children?: React.ReactNode;
  accountManagementUrl?: string;
}

export function Navbar(props: NavbarProps) {
  const ctx = useNavbarContext();
  const merged = { ...props, ...(ctx?.navbarProps ?? {}) };

  const {
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
    IconComponent,
    accountManagementUrl,
  } = merged;

  const [profile, setProfile] = React.useState<User>(user);

  React.useEffect(() => {
    // mantém compat com auth, mas sem depender
    if (merged.auth?.user?.profile) {
      const p = merged.auth.user.profile;
      setProfile({
        name: p.given_name ?? "",
        email: p.email ?? "",
        username: p.preferred_username ?? "",
      });
    } else {
      setProfile(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged.auth, user?.name, user?.email]);

  const [sideMenuOpen, setSideMenuOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");

  const [userOpen, setUserOpen] = React.useState(false);
  const [systemsOpen, setSystemsOpen] = React.useState(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    searchFunction(e.target.value);
  }

  return (
    <div className="w-full">
      {/* Header sticky */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="flex h-16 items-center justify-between px-3">
          {/* Left */}
          <div className="ml-3 flex items-center gap-2">
            {!isLandingPage && sideMenuLinks.length !== 0 && (
              <HamburgerButton
                isOpen={sideMenuOpen}
                onClick={() => setSideMenuOpen((v) => !v)}
              />
            )}
            {!isLandingPage && (
              <IconRenderer
                iconUrl={currentSystemIconUrl}
                IconComponent={IconComponent}
              />
            )}
          </div>

          {/* Title */}
          <div className="mx-8 text-[#2c2c2c] min-w-0">
            {h1 ? (
              <span className="text-2xl font-semibold">{title}</span>
            ) : (
              <span className="text-xl">{title}</span>
            )}
          </div>

          {/* Search */}
          <div className="mx-8 flex justify-center">
            {haveSearchBar && (
              <input
                className="h-[2.7rem] w-[25vw] max-w-[30rem] rounded-[10px] bg-[#f2f2f2] pl-8 pr-8 outline-none"
                placeholder="Buscar…"
                value={searchString}
                onChange={handleSearch}
              />
            )}
          </div>

          {/* Right */}
          <div className="mr-3 flex items-center gap-2">
            {!isLandingPage && systemsList.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  className="h-10 w-10"
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
                  <div className="absolute right-0 top-12 z-50">
                    <SystemsPopup systemsList={systemsList} />
                  </div>
                )}
              </div>
            )}

            {logoSrc && (
              <a href={logoRedirectUrl}>
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="mx-3 w-full min-w-[60px] max-w-[120px]"
                />
              </a>
            )}

            {!hiddenUser && (
              <div className="relative">
                <button
                  type="button"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white",
                    "bg-[#db1e2f]",
                  )}
                  onClick={() => setUserOpen((v) => !v)}
                >
                  {(
                    profile.name?.charAt(0) ??
                    profile.username?.charAt(0) ??
                    ""
                  ).toUpperCase()}
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-12 z-50">
                    <UserPopup
                      user={profile}
                      auth={merged.auth}
                      accountManagementUrl={accountManagementUrl}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SideMenu default igual legado */}
      {!isLandingPage &&
        (children ? (
          children
        ) : (
          <SideMenu
            visibility={sideMenuOpen}
            top="64px"
            setVisibility={setSideMenuOpen}
            links={sideMenuLinks}
          />
        ))}
    </div>
  );
}
