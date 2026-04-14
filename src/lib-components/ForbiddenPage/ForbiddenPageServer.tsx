import forbidden403 from "@/assets/icons/forbidden_403.svg";

export function ForbiddenPageServer() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 py-10 text-center">
      <img
        src={forbidden403}
        alt="Imagem indicando erro 403 - acesso negado"
        className="h-auto w-full max-w-[450px] min-w-[260px]"
      />

      <p className="mt-4 text-[clamp(1.2rem,1.5vw,1.6rem)] font-bold text-slate-900">
        Access denied
      </p>

      <p className="mt-3 text-[clamp(1rem,1.3vw,1.15rem)] text-slate-600">
        You do not have permission to access this content.
      </p>
    </div>
  );
}
