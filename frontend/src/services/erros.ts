const MENSAGENS: Record<string, string> = {
  INVALID_CREDENTIALS: "E-mail ou senha incorretos",
  UNAUTHORIZED: "Sua sessão expirou. Entre novamente.",
  NOT_FOUND: "Este revendedor não existe mais.",
  VALIDATION_ERROR: "Confira os dados e tente de novo.",
};

const PADRAO = "Não foi possível concluir. Tente de novo.";

export class ErroApi extends Error {
  readonly codigo: string;

  constructor(codigo: string) {
    super(MENSAGENS[codigo] ?? PADRAO);
    this.codigo = codigo;
  }
}

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof ErroApi ? erro.message : PADRAO;
}

export function sessaoExpirada(erro: unknown): boolean {
  return erro instanceof ErroApi && erro.codigo === "UNAUTHORIZED";
}
