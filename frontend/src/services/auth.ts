import { api, falhar, requisitar } from "./api";

export interface Usuario {
  name: string;
  email: string;
}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  const resposta = await requisitar(() => api.auth.login.$post({ json: { email, password: senha } }));
  if (!resposta.ok) return falhar(resposta);
  return resposta.json();
}

export async function sair(): Promise<void> {
  await requisitar(() => api.auth.logout.$post());
}

// null quando não há sessão válida.
export async function eu(): Promise<Usuario | null> {
  const resposta = await requisitar(() => api.auth.me.$get());
  // O 401 vem do middleware requireAuth, que não aparece no tipo da rota.
  if ((resposta.status as number) === 401) return null;
  if (!resposta.ok) return falhar(resposta);
  return resposta.json();
}
