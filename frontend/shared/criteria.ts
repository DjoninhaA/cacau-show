import type { Criterion } from "./types.js";

// Health Score criteria.
// A checked "positive" criterion adds 1 point; a checked "negative" one subtracts 1.
// To add, remove or rename a criterion, edit only this list.
// Labels are shown to users, so they stay in Portuguese.
export const CRITERIA: Criterion[] = [
  { id: "responds_same_day", label: "Cliente responde no mesmo dia", type: "positive" },
  { id: "attends_cycle_meetings", label: "Cliente participa das reuniões de ciclo", type: "positive" },
  { id: "active_last_cycle", label: "Cliente está ativo no último ciclo", type: "positive" },
  { id: "gives_qualitative_feedback", label: "Cliente dá feedback qualitativo", type: "positive" },
  { id: "contact_engaged", label: "Responsável da empresa está acessível e engajado", type: "positive" },

  { id: "replies_after_2_days", label: "Cliente demora mais de 2 dias para responder", type: "negative" },
  { id: "replies_after_3_days", label: "Cliente demora mais de 3 dias para responder", type: "negative" },
  { id: "vague_feedback", label: "Cliente dá feedbacks vagos (“não gostei”)", type: "negative" },
  { id: "changes_contact_without_notice", label: "Cliente muda o responsável sem aviso prévio", type: "negative" },
  { id: "rejects_orders_without_reason", label: "Cliente rejeita todos os pedidos sem justificativa", type: "negative" },
  { id: "inactive_over_1_cycle", label: "Cliente está inativo há mais de 1 ciclo", type: "negative" },
  { id: "skips_cycle_meetings", label: "Cliente não participa das reuniões de ciclo", type: "negative" },
];
