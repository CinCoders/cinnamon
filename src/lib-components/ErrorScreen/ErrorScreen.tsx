import notFound404 from "@/assets/icons/notFound_404.svg";
import comingSoon501 from "@/assets/icons/comingSoon_501.svg";
import inactive503 from "@/assets/icons/inactive_503.svg";
import maintenance503 from "@/assets/icons/maintenance_503.svg";

export enum httpErrors {
  NOTFOUND_404,
  COMINGSOON_501,
  INACTIVE_503,
  MAINTENANCE_503,
}

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
    alt: "Imagem indicando erro 404 - pagina nao encontrada",
  },
  [httpErrors.COMINGSOON_501]: {
    image: comingSoon501,
    alt: "Imagem indicando erro 501 - pagina em construcao",
    message: "Voce tentou acessar uma pagina ainda em construcao.",
  },
  [httpErrors.INACTIVE_503]: {
    image: inactive503,
    alt: "Imagem indicando erro 503 - pagina inativa",
    message: "A pagina que voce tentou acessar esta temporariamente inacessivel.",
  },
  [httpErrors.MAINTENANCE_503]: {
    image: maintenance503,
    alt: "Imagem indicando erro 503 - manutencao",
    message: "A pagina que voce tentou acessar esta em manutencao.",
  },
};

export function ErrorScreen({ errorType }: ErrorScreenProps) {
  const content = errorMap[errorType];

  if (!content) return null;

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
