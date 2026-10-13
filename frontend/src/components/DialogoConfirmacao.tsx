import { useEffect, useRef } from "react";

interface Props {
  titulo: string;
  descricao?: string;
  confirmar: string;
  perigo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function DialogoConfirmacao({ titulo, descricao, confirmar, perigo, onConfirmar, onCancelar }: Props) {
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelarRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onCancelar();
        }
      }}
    >
      <div className="absolute inset-0 animate-aparecer bg-stone-900/40" onClick={onCancelar} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        className="relative w-full max-w-sm animate-subir rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 id="dialogo-titulo" className="text-lg font-semibold text-stone-900">
          {titulo}
        </h3>
        {descricao && <p className="mt-2 text-stone-600">{descricao}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelarRef}
            type="button"
            onClick={onCancelar}
            className="rounded-xl px-4 py-2 font-medium text-stone-700 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-cacau"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className={`rounded-xl px-4 py-2 font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${
              perigo
                ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
                : "bg-cacau hover:bg-cacau-escuro focus-visible:outline-cacau"
            }`}
          >
            {confirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
