import { bandForStatus } from "../../shared/bands";
import type { StatusHealth } from "../types/revendedor";

interface Props {
  status: StatusHealth;
  tamanho?: "sm" | "md";
}

export function BadgeStatus({ status, tamanho = "sm" }: Props) {
  const faixa = bandForStatus(status);
  const classes = tamanho === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-300 ${classes}`}
      style={{ backgroundColor: faixa.backgroundColor, color: faixa.textColor }}
    >
      <span
        aria-hidden
        className="size-2 rounded-full transition-colors duration-300"
        style={{ backgroundColor: faixa.color }}
      />
      {faixa.label}
    </span>
  );
}
