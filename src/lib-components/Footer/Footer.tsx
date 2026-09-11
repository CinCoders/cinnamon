"use client";

import type { ComponentType } from "react";
import { tv } from "tailwind-variants";

import cnmHeartIcon from "@/assets/icons/cnmheart.svg";
import instagramIconRaw from "@/assets/footer/instagram.svg?raw";
import linkedinIconRaw from "@/assets/footer/linkedin.svg?raw";
import xIconRaw from "@/assets/footer/x.svg?raw";
import cinLogoRaw from "@/assets/logos/logo-cin-horizontal.svg?raw";
import cincodersLogoRaw from "@/assets/logos/logo-cincoders.svg?raw";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  GitlabIcon,
  GlobalIcon,
  Mail01Icon,
  Location01Icon,
  TelephoneIcon,
} from "@hugeicons/core-free-icons";
import { phoneToTel, svgDataUri } from "@/lib/utils";

type IconProps = { className?: string; "aria-hidden"?: boolean };
const Github = (p: IconProps) => <HugeiconsIcon icon={GithubIcon} strokeWidth={2} {...p} />;
const Gitlab = (p: IconProps) => <HugeiconsIcon icon={GitlabIcon} strokeWidth={2} {...p} />;
const Globe = (p: IconProps) => <HugeiconsIcon icon={GlobalIcon} strokeWidth={2} {...p} />;
const Mail = (p: IconProps) => <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} {...p} />;
const MapPin = (p: IconProps) => <HugeiconsIcon icon={Location01Icon} strokeWidth={2} {...p} />;
const Phone = (p: IconProps) => <HugeiconsIcon icon={TelephoneIcon} strokeWidth={2} {...p} />;

const cinLogo = svgDataUri(cinLogoRaw);
const cincodersLogo = svgDataUri(cincodersLogoRaw);
const linkedinIcon = svgDataUri(linkedinIconRaw);
const instagramIcon = svgDataUri(instagramIconRaw);
const xIcon = svgDataUri(xIconRaw);

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  /** SVG/PNG URL for the icon. Rendered at 16×16. */
  iconUrl?: string;
  /** Icon component. Used when no `iconUrl` is given. */
  icon?: ComponentType<{ className?: string }>;
}

export interface FooterContact {
  email?: string;
  location?: string;
}

export interface FooterSupport {
  title?: string;
  telephone?: string;
  telephoneComplement?: string;
  email?: string;
  siteLabel?: string;
  siteHref?: string;
  description?: string;
  location?: string;
}

export type FooterVariant = "cincoders" | "cin";

export interface FooterProps {
  /** Preset content set. Explicit props below override the preset. */
  variant?: FooterVariant;
  /** Brand logo URL. Defaults to the CIn horizontal logo. */
  logoUrl?: string;
  logoAlt?: string;
  /** Tailwind classes for the logo `<img>`. Sets its size. Falls back to the variant preset. */
  logoClassName?: string;
  /** Short line under the logo. */
  description?: string;
  /** Address / email shown as discreet lines. Placement set by `contactPlacement`. */
  contact?: FooterContact | null;
  /**
   * Where the `contact` lines render:
   * - `"brand"`: under the social icons in the brand block.
   * - `"columns"`: below the link columns.
   *
   * Defaults per variant (`cincoders` → `"columns"`, `cin` → `"brand"`).
   */
  contactPlacement?: "brand" | "columns";
  /**
   * Technical-support block, rendered as a low-emphasis strip above the bottom
   * bar. Pass `null` to hide it; omit to fall back to the variant preset.
   */
  support?: FooterSupport | null;
  /** Navigation columns beside the brand block. */
  linkColumns?: FooterLinkColumn[];
  /** Social row under the brand block. */
  socialLinks?: FooterSocialLink[];
  /**
   * Line in the bottom bar, rendered after the copyright symbol and the
   * current year. Pass `null` to hide it; omit for the default.
   */
  copyrightText?: string | null;
  /** Consuming app version, shown next to the Cinnamon version. */
  appVersion?: string;
  /** Render the brand/support area. When false, only the bottom bar shows. */
  largeFooter?: boolean;
}

type FooterPreset = Pick<
  FooterProps,
  | "logoUrl"
  | "logoAlt"
  | "logoClassName"
  | "description"
  | "contact"
  | "contactPlacement"
  | "support"
  | "linkColumns"
  | "socialLinks"
>;

const footer = tv({
  slots: {
    root: "w-full border-t border-border bg-background text-foreground",
    strip: "border-t border-border",
    bar: "mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground md:flex-row md:px-8",
    grid: "mx-auto w-full max-w-5xl px-6 py-10 md:px-8",
    gridRow: "flex flex-col gap-8 md:flex-row md:justify-between",
    brand: "flex max-w-sm flex-col gap-4",
    description: "text-pretty text-sm text-muted-foreground",
    socialRow: "flex items-center gap-3",
    socialLink:
      "inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    aside: "flex flex-col gap-6",
    columns: "flex flex-wrap gap-8",
    columnTitle:
      "text-xs font-medium uppercase tracking-wide text-muted-foreground",
    columnLinks: "mt-2 flex flex-col gap-2",
    columnLink: "w-max text-sm hover:underline",
    contact: "flex flex-col gap-2 text-sm text-muted-foreground",
    contactLine: "flex items-center gap-2",
  },
});

const CINCODERS_PRESET: FooterPreset = {
  logoUrl: cincodersLogo,
  logoAlt: "CInCoders — Centro de Informática — UFPE",
  logoClassName: "h-8 w-auto self-start",
  description: "Divisão de Desenvolvimento de Software do CIn - UFPE.",
  contact: {
    location: "Sala E126 — CInCoders",
    email: "cincoders@cin.ufpe.br",
  },
  contactPlacement: "columns",
  support: null,
  socialLinks: [
    {
      label: "Instagram",
      href: "https://instagram.com/cincoders",
      iconUrl: instagramIcon,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/cincoders",
      iconUrl: linkedinIcon,
    },
    { label: "GitHub", href: "https://github.com/CinCoders", icon: Github },
    { label: "GitLab", href: "https://gitlab.com/cincoders", icon: Gitlab },
    { label: "Site", href: "https://cincoders.cin.ufpe.br", icon: Globe },
  ],
  linkColumns: [
    {
      title: "CInCoders",
      links: [
        { label: "Site", href: "https://cincoders.cin.ufpe.br" },
        { label: "GitHub", href: "https://github.com/CinCoders" },
        { label: "GitLab", href: "https://gitlab.com/cincoders" },
      ],
    },
    {
      title: "CIn UFPE",
      links: [
        { label: "Portal CIn", href: "https://portal.cin.ufpe.br" },
        { label: "Intranet", href: "https://intranet.cin.ufpe.br" },
        { label: "Informações públicas", href: "https://info.cin.ufpe.br" },
      ],
    },
  ],
};

const CIN_PRESET: FooterPreset = {
  logoUrl: cinLogo,
  logoAlt: "Centro de Informática — UFPE",
  logoClassName: "h-24 w-auto self-start",
  description: "Centro de Informática — UFPE",
  contact: null,
  contactPlacement: "brand",
  support: {
    title: "Suporte Técnico",
    telephone: "(81) 2126-8430",
    telephoneComplement: "Ramal: 4017 / 4748",
    email: "helpdesk@cin.ufpe.br",
    siteLabel: "Site",
    siteHref: "https://helpdesk.cin.ufpe.br/",
    description: "Helpdesk - Gerência de Sistemas",
    location: "Sala B011",
  },
  socialLinks: [
    {
      label: "Instagram",
      href: "https://instagram.com/cinufpe",
      iconUrl: instagramIcon,
    },
    { label: "X", href: "https://x.com/cinufpe", iconUrl: xIcon },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/school/cinufpe",
      iconUrl: linkedinIcon,
    },
  ],
  linkColumns: [
    {
      title: "Recursos",
      links: [
        { label: "Materiais", href: "https://ascom.cin.ufpe.br/materiais" },
        { label: "Portal CIn", href: "https://portal.cin.ufpe.br" },
        { label: "Intranet", href: "https://intranet.cin.ufpe.br" },
        { label: "Informações públicas", href: "https://info.cin.ufpe.br" },
      ],
    },
  ],
};

const PRESETS: Record<FooterVariant, FooterPreset> = {
  cincoders: CINCODERS_PRESET,
  cin: CIN_PRESET,
};

export function Footer({
  variant = "cincoders",
  logoUrl,
  logoAlt,
  logoClassName,
  description,
  contact,
  contactPlacement,
  support,
  linkColumns,
  socialLinks,
  copyrightText = "CIn UFPE | Todos os direitos reservados",
  appVersion,
  largeFooter = true,
}: FooterProps) {
  const preset = PRESETS[variant];
  const styles = footer();

  const resolvedLogoUrl = logoUrl ?? preset.logoUrl;
  const resolvedLogoAlt = logoAlt ?? preset.logoAlt;
  const resolvedLogoClassName =
    logoClassName ?? preset.logoClassName ?? "h-24 w-auto self-start";
  const resolvedDescription = description ?? preset.description;
  const resolvedContact = contact === undefined ? preset.contact : contact;
  const resolvedPlacement =
    contactPlacement ?? preset.contactPlacement ?? "brand";
  const resolvedSupport = support === undefined ? preset.support : support;
  const resolvedColumns = linkColumns ?? preset.linkColumns;
  const socials = socialLinks ?? preset.socialLinks ?? [];

  const contactBlock =
    resolvedContact && (resolvedContact.location || resolvedContact.email) ? (
      <div className={styles.contact()}>
        {resolvedContact.location && (
          <span className={styles.contactLine()}>
            <MapPin aria-hidden className="size-4 shrink-0" />
            {resolvedContact.location}
          </span>
        )}
        {resolvedContact.email && (
          <a
            className={styles.contactLine({ class: "hover:underline" })}
            href={`mailto:${resolvedContact.email}`}
          >
            <Mail aria-hidden className="size-4 shrink-0" />
            {resolvedContact.email}
          </a>
        )}
      </div>
    ) : null;

  return (
    <footer aria-label="Site footer" className={styles.root()}>
      {largeFooter && (
        <div className={styles.grid()}>
          <div className={styles.gridRow()}>
            <div className={styles.brand()}>
              <img
                src={resolvedLogoUrl}
                alt={resolvedLogoAlt}
                className={resolvedLogoClassName}
              />
              {resolvedDescription && (
                <p className={styles.description()}>{resolvedDescription}</p>
              )}
              {socials.length > 0 && (
                <ul className={styles.socialRow()} aria-label="Social links">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={styles.socialLink()}
                      >
                        {social.iconUrl ? (
                          <img
                            src={social.iconUrl}
                            alt=""
                            aria-hidden
                            className="size-4"
                          />
                        ) : social.icon ? (
                          <social.icon className="size-4" />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {resolvedPlacement === "brand" && contactBlock}
            </div>

            {resolvedColumns && resolvedColumns.length > 0 && (
              <div className={styles.aside()}>
                <div className={styles.columns()}>
                  {resolvedColumns.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                      <span className={styles.columnTitle()}>
                        {column.title}
                      </span>
                      <div className={styles.columnLinks()}>
                        {column.links.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.columnLink()}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </nav>
                  ))}
                </div>
              </div>
            )}
          </div>

          {resolvedPlacement === "columns" && contactBlock && (
            <div className="mt-2 [&>div]:flex-row [&>div]:flex-wrap [&>div]:gap-x-6">
              {contactBlock}
            </div>
          )}
        </div>
      )}

      {largeFooter && resolvedSupport && (
        <div className={styles.strip()}>
          <nav
            aria-label={resolvedSupport.title ?? "Suporte Técnico"}
            className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3 text-xs text-muted-foreground md:px-8"
          >
            <span className="font-medium uppercase tracking-wide">
              {resolvedSupport.title ?? "Suporte Técnico"}
            </span>
            {resolvedSupport.telephone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone aria-hidden className="size-3.5 shrink-0" />
                <a
                  className="hover:underline"
                  href={`tel:${phoneToTel(resolvedSupport.telephone)}`}
                >
                  {resolvedSupport.telephone}
                </a>
                {resolvedSupport.telephoneComplement
                  ? ` ${resolvedSupport.telephoneComplement}`
                  : ""}
              </span>
            )}
            {resolvedSupport.email && (
              <a
                className="inline-flex items-center gap-1.5 hover:underline"
                href={`mailto:${resolvedSupport.email}`}
              >
                <Mail aria-hidden className="size-3.5 shrink-0" />
                {resolvedSupport.email}
              </a>
            )}
            {resolvedSupport.siteHref && (
              <a
                className="inline-flex items-center gap-1.5 hover:underline"
                href={resolvedSupport.siteHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe aria-hidden className="size-3.5 shrink-0" />
                {resolvedSupport.siteLabel ?? resolvedSupport.siteHref}
              </a>
            )}
            {(resolvedSupport.description || resolvedSupport.location) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-3.5 shrink-0" />
                {[resolvedSupport.description, resolvedSupport.location]
                  .filter(Boolean)
                  .join(" — ")}
              </span>
            )}
          </nav>
        </div>
      )}

      <div className={styles.strip()}>
        <div className={styles.bar()}>
          {copyrightText !== null && (
            <span>
              © {new Date().getFullYear()} {copyrightText}
            </span>
          )}

          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="text-cinnamon-primary">
              CInnamon v{__CINNAMON_VERSION__}
            </span>
            {appVersion && (
              <span className="text-foreground">v{appVersion}</span>
            )}
          </span>

          <span className="inline-flex items-center gap-1">
            <a
              href="https://www.npmjs.com/package/@cincoders/cinnamon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              Made with
              <img src={cnmHeartIcon} alt="" aria-hidden className="size-4" />
            </a>
            by
            <a
              href="https://cincoders.cin.ufpe.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              CInCoders
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
