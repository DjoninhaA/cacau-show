import { useState, type FormEvent } from "react";
import { entrar, type Usuario } from "../services/auth";
import { mensagemDeErro } from "../services/erros";

interface Props {
  aviso?: string;
  onEntrar: (usuario: Usuario) => void;
}

export function TelaLogin({ aviso, onEntrar }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      onEntrar(await entrar(email, senha));
    } catch (falha) {
      setErro(mensagemDeErro(falha));
      setEnviando(false);
    }
  }

  const mensagem = erro ?? aviso;
  const classeCampo =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-base focus:border-cacau focus:ring-2 focus:ring-cacau/20 focus:outline-none";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={enviar} className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-cacau">
          <span aria-hidden>🍫 </span>Revendedores
        </h1>
        {mensagem && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {mensagem}
          </p>
        )}
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-stone-700">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classeCampo}
          />
        </div>
        <div>
          <label htmlFor="login-senha" className="mb-1.5 block text-sm font-medium text-stone-700">
            Senha
          </label>
          <input
            id="login-senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={classeCampo}
          />
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-cacau px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-cacau-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cacau disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
