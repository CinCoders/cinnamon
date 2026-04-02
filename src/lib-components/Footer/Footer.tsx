"use client";

import * as React from "react";
import cnmHeartIcon from "@/assets/icons/cnmheart.svg";

export interface FooterProps {
  title?: string;
  telephone?: string;
  telephoneComplement?: string;
  email?: string;
  link?: string;
  textLink?: string;
  description?: string;
  copyrightText?: string;
  signatureText?: string;
  signatureLink?: string;
  largeFooter?: boolean;
  appVersion?: string;
}

function phoneToTel(phone?: string) {
  if (!phone) return "";
  return phone.replace(/\(|\)|\s|-+/g, "");
}

export function Footer({
  title,
  telephone,
  telephoneComplement,
  email,
  link,
  textLink,
  description,
  copyrightText,
  signatureText,
  signatureLink,
  largeFooter = true,
  appVersion,
}: FooterProps) {
  return (
    <footer className="sticky bottom-0 w-full">
      {largeFooter && (
        <div className="w-full bg-[#424242] text-white">
          <div className="cinnamon-footer-shell w-full px-6">
            <div
              className="cinnamon-footer-top flex h-[110px] items-center justify-around
                            max-[801px]:h-[15vh] max-[501px]:h-[30vh]
                            max-[801px]:flex-wrap max-[501px]:flex-col"
            >
              <div className="w-[35.5%] max-[801px]:w-full">
                <div
                  className="flex justify-end whitespace-pre-line text-base font-bold
                                max-[1001px]:justify-center max-[801px]:justify-center"
                >
                  {title ?? ""}
                </div>
              </div>

              <div
                className="w-[29%] text-center text-sm whitespace-pre-line
                            max-[801px]:w-full max-[801px]:pl-[10%] max-[801px]:basis-1/2 max-[801px]:flex-[0_0_50%]
                            max-[501px]:pl-0"
              >
                {telephone && (
                  <a className="text-white" href={`tel:${phoneToTel(telephone)}`}>
                    {telephone}{" "}
                  </a>
                )}
                {telephoneComplement ?? ""}
                <br />
                {email && (
                  <a className="text-white" href={`mailto:${email}`}>
                    {email}
                  </a>
                )}
                <br />
                {link && (
                  <a className="text-white" href={link}>
                    {textLink ?? link}
                  </a>
                )}
              </div>

              {description && (
                <div className="w-[35.5%] whitespace-pre-line max-[801px]:w-full max-[801px]:pr-[10%] max-[801px]:basis-1/2 max-[801px]:flex-[0_0_50%] max-[501px]:pr-0">
                  <div
                    className="flex justify-start text-center text-sm
                                max-[1001px]:justify-center max-[801px]:justify-center"
                  >
                    {description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-[#616161] text-white">
        <div className="cinnamon-footer-shell flex h-10 w-full items-center justify-between px-8 text-[11px] leading-10">
          <div className="text-left">
            {copyrightText ? (
              <>
                ©{new Date().getFullYear()} {copyrightText}
              </>
            ) : null}
          </div>

          <div className="text-right max-[601px]:hidden">
            {signatureText !== undefined ? (
              signatureLink ? (
                <a className="text-white" href={signatureLink}>
                  {signatureText}
                </a>
              ) : (
                <span>{signatureText}</span>
              )
            ) : (
              <span className="inline-flex items-center gap-1">
                {appVersion ? (
                  <span className="mr-[100px]">version: {appVersion}</span>
                ) : null}
                <a
                  href="https://www.npmjs.com/package/@cincoders/cinnamon"
                  className="inline-flex items-center gap-1 text-white no-underline"
                >
                  Made with
                  <img
                    src={cnmHeartIcon}
                    alt="cnm"
                    className="h-[15px] w-[15px]"
                  />
                </a>
                <span>by</span>
                <a
                  href="https://cincoders.cin.ufpe.br/"
                  className="text-white no-underline"
                >
                  CInCoders
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
