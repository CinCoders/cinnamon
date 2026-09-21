import notFound404Raw from "@/assets/icons/notFound_404.svg?raw";
import comingSoon501Raw from "@/assets/icons/comingSoon_501.svg?raw";
import inactive503Raw from "@/assets/icons/inactive_503.svg?raw";
import maintenance503Raw from "@/assets/icons/maintenance_503.svg?raw";

const svgDataUri = (raw: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}`;

const notFound404 = svgDataUri(notFound404Raw);
const comingSoon501 = svgDataUri(comingSoon501Raw);
const inactive503 = svgDataUri(inactive503Raw);
const maintenance503 = svgDataUri(maintenance503Raw);

export const httpErrors = {
  NOTFOUND_404: "NOTFOUND_404",
  COMINGSOON_501: "COMINGSOON_501",
  INACTIVE_503: "INACTIVE_503",
  MAINTENANCE_503: "MAINTENANCE_503",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type httpErrors = (typeof httpErrors)[keyof typeof httpErrors];

export interface ErrorScreenProps {
  errorType: httpErrors;
}

type ErrorScreenContent = {
  image: string;
  alt: string;
  message?: string;
};

const errorMap: Record<httpErrors, ErrorScreenContent> = {
  [httpErrors.NOTFOUND_404]: {
    image: notFound404,
    alt: "Imagem indicando erro 404 - conteúdo não encontrado",
    message: "Não foi possível encontrar o que você procurava.",
  },
  [httpErrors.COMINGSOON_501]: {
    image: comingSoon501,
    alt: "Imagem indicando erro 501 - funcionalidade em construção",
    message: "Você tentou acessar uma funcionalidade que ainda está em construção.",
  },
  [httpErrors.INACTIVE_503]: {
    image: inactive503,
    alt: "Imagem indicando erro 503 - serviço temporariamente indisponível",
    message: "Este serviço está temporariamente indisponível.",
  },
  [httpErrors.MAINTENANCE_503]: {
    image: maintenance503,
    alt: "Imagem indicando erro 503 - em manutenção",
    message: "Este serviço está em manutenção no momento.",
  },
  [httpErrors.SERVER_ERROR]: {
    image: inactive503,
    alt: "Imagem indicando erro de comunicação com o servidor",
    message: "Ocorreu um erro de comunicação com o servidor.",
  },
};

export function ErrorScreen({ errorType }: ErrorScreenProps) {
  const content = errorMap[errorType];

  if (!content) {
    return (
      <div className="flex w-full justify-center px-6 py-8">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <p className="text-[clamp(1.5rem,2vw,2rem)] font-bold text-slate-900">
            Erro desconhecido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-6 py-8">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center text-center">
        {content.message ? (
          <p className="mb-4 text-[clamp(1.5rem,2vw,2rem)] font-bold text-slate-900">
            {content.message}
          </p>
        ) : null}

        <img
          src={content.image}
          alt={content.alt}
          className="h-auto w-[75%] max-w-[450px] min-w-[260px]"
        />
      </div>
    </div>
  );
}
