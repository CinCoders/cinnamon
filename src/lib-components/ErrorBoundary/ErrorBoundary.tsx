"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorScreen, httpErrors } from "../ErrorScreen/ErrorScreen";

export interface ErrorBoundaryProps {
  children: ReactNode;

  /** Support inbox for the "Contact support" button. Omit to hide the button. */
  supportEmail?: string;

  /** Consumer app name, included in the support e-mail subject/body. */
  appName?: string;

  /** Consumer app version, included in the support e-mail body. */
  appVersion?: string;

  /** Called with the caught error, e.g. to report it to a logging service. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export const buildSupportMailto = (
  error: Error,
  supportEmail: string,
  appName?: string,
  appVersion?: string,
): string => {
  const subject = appName ? `Erro em ${appName}` : "Erro na aplicação";
  const body = [
    "Olá, encontrei um erro ao usar a aplicação. Detalhes técnicos abaixo:",
    "",
    `Mensagem: ${error.message}`,
    appName ? `Aplicação: ${appName}` : null,
    appVersion ? `Versão da aplicação: ${appVersion}` : null,
    `URL: ${window.location.href}`,
    `Data/hora: ${new Date().toISOString()}`,
    `Navegador: ${navigator.userAgent}`,
    `Idioma: ${navigator.language}`,
    `Resolução de tela: ${window.screen.width}x${window.screen.height}`,
    "",
    error.stack ?? "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Safety net against uncaught render errors (e.g. a synchronous throw
 * anywhere in the tree). Without it, React unmounts the whole application
 * and the user is left looking at a blank page — this renders the
 * standard `ErrorScreen` instead, with a reload button and an optional
 * "contact support" mailto link pre-filled with debugging details.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { supportEmail, appName, appVersion } = this.props;

    if (error) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <ErrorScreen errorType={httpErrors.INACTIVE_503} />
          <p className="text-sm text-slate-500">
            Ocorreu um erro inesperado e a aplicação não pôde continuar.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-cinnamon-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Recarregar página
            </button>
            {supportEmail ? (
              <a
                href={buildSupportMailto(error, supportEmail, appName, appVersion)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Contatar suporte
              </a>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
