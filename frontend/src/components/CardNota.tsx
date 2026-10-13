import { faixaDoStatus } from "../config/faixas";
import { calcularHealthScore } from "../utils/healthScore";
import { BadgeStatus } from "./BadgeStatus";

interface Props {
  marcados: string[];
}

export function CardNota({ marcados }: Props) {
  const { nota, status, pontos, total } = calcularHealthScore(marcados);
  const faixa = faixaDoStatus(status);

  return (
    <div
      className="rounded-2xl border p-4 transition-colors duration-300"
      style={{ backgroundColor: faixa.corFundo, borderColor: `${faixa.cor}55` }}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-600">Health Score</p>
          <p className="text-3xl font-bold text-stone-900">
            {nota}
            <span className="text-base font-medium text-stone-500"> /10</span>
          </p>
        </div>
        <BadgeStatus status={status} tamanho="md" />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80" aria-hidden>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${nota * 10}%`, backgroundColor: faixa.cor }}
        />
      </div>
      <p className="mt-2 text-xs text-stone-500">
        {pontos} de {total} {total === 1 ? "critério marcado" : "critérios marcados"}
      </p>
    </div>
  );
}
