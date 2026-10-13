import { FAIXAS } from "../config/faixas";
import type { Revendedor, StatusHealth } from "../types/revendedor";

interface Props {
  revendedores: Revendedor[];
  filtro: StatusHealth | null;
  onFiltrar: (status: StatusHealth | null) => void;
}

export function ResumoStatus({ revendedores, filtro, onFiltrar }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3" role="group" aria-label="Filtrar por status">
      {FAIXAS.map((faixa) => {
        const quantidade = revendedores.filter((r) => r.status === faixa.status).length;
        const ativo = filtro === faixa.status;
        return (
          <button
            key={faixa.status}
            type="button"
            aria-pressed={ativo}
            onClick={() => onFiltrar(ativo ? null : faixa.status)}
            className="flex flex-col items-start gap-1 rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cacau sm:p-5"
            style={{
              borderColor: ativo ? faixa.cor : "transparent",
              backgroundColor: ativo ? faixa.corFundo : undefined,
            }}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="size-3 rounded-full" style={{ backgroundColor: faixa.cor }} />
              <span className="text-2xl font-bold text-stone-900 sm:text-3xl">{quantidade}</span>
            </span>
            <span className="text-sm font-medium" style={{ color: faixa.corTexto }}>
              {faixa.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
