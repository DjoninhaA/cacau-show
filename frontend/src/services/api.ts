import { hc } from "hono/client";
import type { AppType } from "../../server/app";
import { ErroApi } from "./erros";

export const api = hc<AppType>("/").api;

// Lança ErroApi com o código devolvido pela API ({ "error": "CODE" }).
export async function falhar(resposta: Response): Promise<never> {
  const corpo = await resposta.json().catch(() => null);
  throw new ErroApi(typeof corpo?.error === "string" ? corpo.error : "INTERNAL_ERROR");
}

// Falha de rede (servidor fora do ar, sem internet) vira o mesmo tipo de erro.
export async function requisitar<T extends Response>(chamada: () => Promise<T>): Promise<T> {
  try {
    return await chamada();
  } catch {
    throw new ErroApi("NETWORK_ERROR");
  }
}
