import type { StatusHealth } from "../types/revendedor";

export interface Faixa {
  status: StatusHealth;
  label: string;
  min: number;
  max: number;
  cor: string;
  corTexto: string;
  corFundo: string;
}

// Faixas de classificação da nota (0–10), da pior para a melhor.
export const FAIXAS: Faixa[] = [
  { status: "vermelho", label: "Atenção", min: 0, max: 4, cor: "#DC2626", corTexto: "#B91C1C", corFundo: "#FEF2F2" },
  { status: "amarelo", label: "Observar", min: 5, max: 7, cor: "#F59E0B", corTexto: "#B45309", corFundo: "#FFFBEB" },
  { status: "verde", label: "Saudável", min: 8, max: 10, cor: "#16A34A", corTexto: "#15803D", corFundo: "#F0FDF4" },
];

export function faixaDoStatus(status: StatusHealth): Faixa {
  return FAIXAS.find((f) => f.status === status) ?? FAIXAS[0];
}
