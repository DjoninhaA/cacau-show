import { CRITERIOS, type Criterio } from "../config/criterios";
import { FAIXAS } from "../config/faixas";
import type { StatusHealth } from "../types/revendedor";

const IDS_VALIDOS = new Set(CRITERIOS.map((c) => c.id));

// Ignora ids de critérios que não existem mais na configuração.
export function criteriosValidos(marcados: string[]): string[] {
  return marcados.filter((id) => IDS_VALIDOS.has(id));
}

// nota = (positivos marcados − negativos marcados) ÷ total de positivos × 10, entre 0 e 10.
export function calcularHealthScore(marcados: string[], criterios: Criterio[] = CRITERIOS) {
  const selecionados = new Set(marcados);
  const contar = (tipo: Criterio["tipo"], soMarcados: boolean) =>
    criterios.filter((c) => c.tipo === tipo && (!soMarcados || selecionados.has(c.id))).length;

  const positivos = contar("positivo", true);
  const negativos = contar("negativo", true);
  const totalPositivos = contar("positivo", false);

  const pontos = Math.max(0, positivos - negativos);
  const nota = totalPositivos === 0 ? 0 : Math.min(10, Math.round((pontos / totalPositivos) * 10));
  const faixa = FAIXAS.find((f) => nota >= f.min && nota <= f.max) ?? FAIXAS[0];
  return { nota, status: faixa.status as StatusHealth, positivos, negativos, totalPositivos };
}
