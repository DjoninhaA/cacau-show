import type { DadosRevendedor, Revendedor } from "../types/revendedor";
import { calcularHealthScore } from "../utils/healthScore";

// Acesso a dados isolado aqui: para trocar o localStorage por uma API,
// basta reimplementar estas funções mantendo as mesmas assinaturas.

const CHAVE = "revendedores";

function ler(): Revendedor[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// randomUUID só existe em contexto seguro (https/localhost); fallback para acesso via IP na rede.
function novoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function gravar(lista: Revendedor[]) {
  localStorage.setItem(CHAVE, JSON.stringify(lista));
}

// Nota e status sempre derivados dos critérios, para refletir mudanças na configuração.
function comNota<T extends Pick<Revendedor, "criteriosMarcados">>(r: T) {
  const { nota, status } = calcularHealthScore(r.criteriosMarcados);
  return { ...r, nota, status };
}

export async function listar(): Promise<Revendedor[]> {
  return ler().map(comNota);
}

export async function criar(dados: DadosRevendedor): Promise<Revendedor> {
  const agora = new Date().toISOString();
  const novo: Revendedor = comNota({
    ...dados,
    id: novoId(),
    criadoEm: agora,
    atualizadoEm: agora,
  });
  gravar([...ler(), novo]);
  return novo;
}

export async function atualizar(id: string, dados: DadosRevendedor): Promise<Revendedor> {
  const lista = ler();
  const atual = lista.find((r) => r.id === id);
  if (!atual) throw new Error("Revendedor não encontrado");
  const atualizado = comNota({ ...atual, ...dados, atualizadoEm: new Date().toISOString() });
  gravar(lista.map((r) => (r.id === id ? atualizado : r)));
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  gravar(ler().filter((r) => r.id !== id));
}

// Usado pelo "Desfazer" após uma exclusão.
export async function restaurar(revendedor: Revendedor): Promise<void> {
  gravar([...ler().filter((r) => r.id !== revendedor.id), revendedor]);
}
