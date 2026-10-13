import { faixaDoStatus } from "../config/faixas";
import type { StatusHealth } from "../types/revendedor";

interface Props {
  status: StatusHealth;
  tamanho?: "sm" | "md";
}

export function BadgeStatus({ status, tamanho = "sm" }: Props) {
  const faixa = faixaDoStatus(status);
  const classes = tamanho === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-300 ${classes}`}
      style={{ backgroundColor: faixa.corFundo, color: faixa.corTexto }}
    >
      <span
        aria-hidden
        className="size-2 rounded-full transition-colors duration-300"
        style={{ backgroundColor: faixa.cor }}
      />
      {faixa.label}
    </span>
  );
}
