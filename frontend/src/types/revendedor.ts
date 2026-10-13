export type StatusHealth = "vermelho" | "amarelo" | "verde";

export interface Revendedor {
  id: string;
  nomeEmpresa: string;
  cnpj: string; // apenas dígitos
  responsavel: string;
  contato: string; // apenas dígitos
  email: string;
  criteriosMarcados: string[]; // ids dos critérios marcados
  nota: number; // 0–10, calculada
  status: StatusHealth; // calculado
  criadoEm: string;
  atualizadoEm: string;
}

export type DadosRevendedor = Pick<
  Revendedor,
  "nomeEmpresa" | "cnpj" | "responsavel" | "contato" | "email" | "criteriosMarcados"
>;
