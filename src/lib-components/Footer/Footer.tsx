"use client";

import cnmHeartIcon from "@/assets/icons/cnmheart.svg";
import instagramIconRaw from "@/assets/footer/instagram.svg?raw";
import linkedinIconRaw from "@/assets/footer/linkedin.svg?raw";
import xIconRaw from "@/assets/footer/x.svg?raw";
import cinLogoRaw from "@/assets/logos/logo-cin-horizontal.svg?raw";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { phoneToTel, svgDataUri } from "@/lib/utils";

const cinLogo = svgDataUri(cinLogoRaw);
const linkedinIcon = svgDataUri(linkedinIconRaw);
const instagramIcon = svgDataUri(instagramIconRaw);
const xIcon = svgDataUri(xIconRaw);

const DEFAULT_SOCIALS: FooterSocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cincoders/", iconUrl: linkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/cincoders/", iconUrl: instagramIcon },
  { label: "X", href: "https://x.com/cincoders", iconUrl: xIcon },
];

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

export interface FooterProps {
  /** Brand logo URL. Defaults to the CIn horizontal logo. */
  logoUrl?: string;
  logoAlt?: string;
  /** Short line under the logo. */
  description?: string;
  /** Technical-support block. Pass `null` to hide it; omit for the CIn defaults. */
  support?: FooterSupport | null;
  /** Navigation columns beside the brand block. */
  linkColumns?: FooterLinkColumn[];
  /** Social row under the brand block. */
  socialLinks?: FooterSocialLink[];
  copyrightText?: string;
  /** Consuming app version, shown next to the Cinnamon version. */
  appVersion?: string;
  /** Render the brand/support area. When false, only the bottom bar shows. */
  largeFooter?: boolean;
}

const CIN_SUPPORT: FooterSupport = {
  title: "Suporte Técnico",
  telephone: "(81) 2126-8430",
  telephoneComplement: "Ramal: 4017 / 4748",
  email: "helpdesk@cin.ufpe.br",
  siteLabel: "Site",
  siteHref: "https://helpdesk.cin.ufpe.br/",
  description: "Helpdesk - Gerência de Sistemas",
  location: "Sala B011",
};

export function Footer({
  logoUrl = cinLogo,
  logoAlt = "Centro de Informática — UFPE",
  description = "Centro de Informática — UFPE",
  support,
  linkColumns,
  socialLinks,
  copyrightText = "CInCoders",
  appVersion,
  largeFooter = true,
}: FooterProps) {
  const resolvedSupport =
    support === null ? null : { ...CIN_SUPPORT, ...support };
  const socials = socialLinks ?? DEFAULT_SOCIALS;

  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-border bg-background text-foreground"
    >
      {largeFooter && (
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-10 md:grid-cols-12 md:px-8">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
            <img src={logoUrl} alt={logoAlt} className="h-24 w-auto self-start" />
            {description && (
              <p className="max-w-sm text-balance text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {socials.length > 0 && (
              <ul className="flex items-center gap-3" aria-label="Social links">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {social.iconUrl && (
                        <img
                          src={social.iconUrl}
                          alt=""
                          aria-hidden
                          className="size-4"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {resolvedSupport && (
            <nav
              aria-label={resolvedSupport.title ?? "Suporte Técnico"}
              className="col-span-12 sm:col-span-6 md:col-span-4"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {resolvedSupport.title ?? "Suporte Técnico"}
              </span>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                {resolvedSupport.telephone && (
                  <span className="flex items-center gap-2">
                    <Phone aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    <span>
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
                  </span>
                )}
                {resolvedSupport.email && (
                  <a
                    className="flex items-center gap-2 hover:underline"
                    href={`mailto:${resolvedSupport.email}`}
                  >
                    <Mail aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    {resolvedSupport.email}
                  </a>
                )}
                {resolvedSupport.siteHref && (
                  <a
                    className="flex items-center gap-2 hover:underline"
                    href={resolvedSupport.siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    {resolvedSupport.siteLabel ?? resolvedSupport.siteHref}
                  </a>
                )}
                {(resolvedSupport.description || resolvedSupport.location) && (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin aria-hidden className="size-4 shrink-0" />
                    <span>
                      {[resolvedSupport.description, resolvedSupport.location]
                        .filter(Boolean)
                        .join(" — ")}
                    </span>
                  </span>
                )}
              </div>
            </nav>
          )}

          {linkColumns?.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="col-span-6 sm:col-span-3 md:col-span-2"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {column.title}
              </span>
              <div className="mt-2 flex flex-col gap-2">
                {column.links.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="w-max text-sm hover:underline"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}
        </div>
      )}

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground md:flex-row md:px-8">
          <span className="inline-flex items-center gap-1">
            <a
              href="https://www.npmjs.com/package/@cincoders/cinnamon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              Made with
              <img
                src={cnmHeartIcon}
                alt=""
                aria-hidden
                className="size-4"
              />
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

          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Cinnamon v{__CINNAMON_VERSION__}</span>
            {appVersion && <span>App v{appVersion}</span>}
            {copyrightText && (
              <span>
                © {new Date().getFullYear()} {copyrightText}
              </span>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
