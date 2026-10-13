// Critérios do Health Score.
// "positivo" marcado soma 1 ponto; "negativo" marcado subtrai 1 ponto.
// Para adicionar, remover ou renomear um critério, edite apenas esta lista.
export type TipoCriterio = "positivo" | "negativo";

export interface Criterio {
  id: string;
  label: string;
  tipo: TipoCriterio;
}

export const CRITERIOS: Criterio[] = [
  { id: "responde_mensagens", label: "Cliente responde no mesmo dia", tipo: "positivo" },
  { id: "participa_reunioes", label: "Cliente participa das reuniões de ciclo", tipo: "positivo" },
  { id: "ativo_na_base", label: "Cliente está ativo no último ciclo", tipo: "positivo" },
  { id: "feedback_qualitativo", label: "Cliente dá feedback qualitativo", tipo: "positivo" },
  { id: "responsavel_engajado", label: "Responsável da empresa está acessível e engajado", tipo: "positivo" },

  { id: "demora_2_dias", label: "Cliente demora mais de 2 dias para responder", tipo: "negativo" },
  { id: "demora_3_dias", label: "Cliente demora mais de 3 dias para responder", tipo: "negativo" },
  { id: "feedbacks_vagos", label: "Cliente dá feedbacks vagos (“não gostei”)", tipo: "negativo" },
  { id: "muda_responsavel", label: "Cliente muda o responsável sem aviso prévio", tipo: "negativo" },
  { id: "rejeita_pedidos", label: "Cliente rejeita todos os pedidos sem justificativa", tipo: "negativo" },
  { id: "inativo_mais_1_ciclo", label: "Cliente está inativo há mais de 1 ciclo", tipo: "negativo" },
  { id: "nao_participa_reunioes", label: "Cliente não participa das reuniões de ciclo", tipo: "negativo" },
];
