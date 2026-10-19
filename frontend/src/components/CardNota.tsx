import { bandForStatus } from "../../shared/bands";
import { calculateHealthScore } from "../../shared/healthScore";
import { BadgeStatus } from "./BadgeStatus";

interface Props {
  marcados: string[];
}

export function CardNota({ marcados }: Props) {
  const { score, status, positives, negatives, totalPositives } = calculateHealthScore(marcados);
  const faixa = bandForStatus(status);

  return (
    <div
      className="rounded-2xl border p-4 transition-colors duration-300"
      style={{ backgroundColor: faixa.backgroundColor, borderColor: `${faixa.color}55` }}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-600">Health Score</p>
          <p className="text-3xl font-bold text-stone-900">
            {score}
            <span className="text-base font-medium text-stone-500"> /10</span>
          </p>
        </div>
        <BadgeStatus status={status} tamanho="md" />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80" aria-hidden>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${score * 10}%`, backgroundColor: faixa.color }}
        />
      </div>
      <p className="mt-2 text-xs text-stone-500">
        {positives} de {totalPositives} {totalPositives === 1 ? "positivo" : "positivos"} ·{" "}
        {negatives} {negatives === 1 ? "ponto de atenção" : "pontos de atenção"}
      </p>
    </div>
  );
}
