import type { Reseller } from "../../shared/types";
import type { DadosRevendedor, Revendedor } from "../types/revendedor";
import { api, falhar, requisitar } from "./api";

// A API fala inglês; aqui os campos são traduzidos para o modelo do front.

function deApi(r: Reseller): Revendedor {
  return {
    id: r.id,
    nomeEmpresa: r.companyName,
    responsavel: r.contactName,
    contato: r.phone,
    email: r.email,
    criteriosMarcados: r.checkedCriteria,
    nota: r.score,
    status: r.status,
    criadoEm: r.createdAt,
    atualizadoEm: r.updatedAt,
  };
}

function paraApi(d: DadosRevendedor) {
  return {
    companyName: d.nomeEmpresa,
    contactName: d.responsavel,
    phone: d.contato,
    email: d.email,
    checkedCriteria: d.criteriosMarcados,
  };
}

export async function listar(): Promise<Revendedor[]> {
  const resposta = await requisitar(() => api.resellers.$get());
  if (!resposta.ok) return falhar(resposta);
  return (await resposta.json()).map(deApi);
}

export async function criar(dados: DadosRevendedor): Promise<Revendedor> {
  const resposta = await requisitar(() => api.resellers.$post({ json: paraApi(dados) }));
  if (!resposta.ok) return falhar(resposta);
  return deApi(await resposta.json());
}

export async function atualizar(id: string, dados: DadosRevendedor): Promise<Revendedor> {
  const resposta = await requisitar(() => api.resellers[":id"].$put({ param: { id }, json: paraApi(dados) }));
  if (!resposta.ok) return falhar(resposta);
  return deApi(await resposta.json());
}

export async function excluir(id: string): Promise<void> {
  const resposta = await requisitar(() => api.resellers[":id"].$delete({ param: { id } }));
  if (!resposta.ok) return falhar(resposta);
}

// Usado pelo "Desfazer" após uma exclusão.
export async function restaurar(revendedor: Revendedor): Promise<void> {
  const resposta = await requisitar(() => api.resellers[":id"].restore.$post({ param: { id: revendedor.id } }));
  if (!resposta.ok) return falhar(resposta);
}
