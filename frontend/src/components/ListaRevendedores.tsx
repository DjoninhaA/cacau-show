import type { Revendedor } from "../types/revendedor";
import { formatarTelefone } from "../utils/formatar";
import { BadgeStatus } from "./BadgeStatus";

interface Props {
  revendedores: Revendedor[];
  onAbrir: (revendedor: Revendedor) => void;
}

export function ListaRevendedores({ revendedores, onAbrir }: Props) {
  return (
    <ul className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-stone-100 sm:overflow-hidden sm:rounded-2xl sm:bg-white sm:shadow-sm">
      {revendedores.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onAbrir(r)}
            className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cacau sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] sm:rounded-none sm:px-6 sm:shadow-none"
          >
            <span className="min-w-0">
              <span className="block truncate font-semibold text-stone-900">{r.nomeEmpresa}</span>
              <span className="block truncate text-sm text-stone-500 sm:hidden">{r.responsavel}</span>
              <span className="block truncate text-sm text-stone-500">
                {formatarTelefone(r.contato)} · {r.email}
              </span>
            </span>
            <span className="hidden truncate text-stone-700 sm:block">{r.responsavel}</span>
            <span className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-stone-900">
                {r.nota}
                <span className="text-sm font-medium text-stone-400"> /10</span>
              </span>
              <BadgeStatus status={r.status} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
