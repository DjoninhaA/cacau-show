import { CRITERIOS } from "../config/criterios";
import { FAIXAS } from "../config/faixas";
import type { StatusHealth } from "../types/revendedor";

const IDS_VALIDOS = new Set(CRITERIOS.map((c) => c.id));

// Ignora ids de critérios que não existem mais na configuração.
export function criteriosValidos(marcados: string[]): string[] {
  return marcados.filter((id) => IDS_VALIDOS.has(id));
}

export function calcularHealthScore(marcados: string[], total = CRITERIOS.length) {
  const pontos = criteriosValidos(marcados).length;
  const nota = total === 0 ? 0 : Math.round((pontos / total) * 10);
  const faixa = FAIXAS.find((f) => nota >= f.min && nota <= f.max) ?? FAIXAS[0];
  return { nota, status: faixa.status as StatusHealth, pontos, total };
}
