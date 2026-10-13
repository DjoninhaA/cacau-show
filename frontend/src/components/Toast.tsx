import { useEffect } from "react";

export interface ToastDados {
  id: number;
  mensagem: string;
  acao?: { label: string; onClick: () => void };
}

interface Props {
  toast: ToastDados | null;
  onFechar: () => void;
}

export function Toast({ toast, onFechar }: Props) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onFechar, toast.acao ? 6000 : 3000);
    return () => clearTimeout(timer);
  }, [toast, onFechar]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex animate-subir items-center gap-4 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          <span>{toast.mensagem}</span>
          {toast.acao && (
            <button
              type="button"
              onClick={() => {
                toast.acao?.onClick();
              }}
              className="rounded-md px-2 py-1 font-semibold text-amber-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-300"
            >
              {toast.acao.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
