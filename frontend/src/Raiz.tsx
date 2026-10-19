import { useCallback, useEffect, useState } from "react";
import App from "./App";
import { TelaLogin } from "./components/TelaLogin";
import { eu, sair, type Usuario } from "./services/auth";
import { mensagemDeErro } from "./services/erros";

// Decide entre a tela de login e o app. undefined = ainda verificando a sessão.
export default function Raiz() {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  const [aviso, setAviso] = useState<string>();

  useEffect(() => {
    eu()
      .then(setUsuario)
      .catch((erro) => {
        setAviso(mensagemDeErro(erro));
        setUsuario(null);
      });
  }, []);

  const sessaoExpirada = useCallback(() => {
    setAviso("Sua sessão expirou. Entre novamente.");
    setUsuario(null);
  }, []);

  async function encerrar() {
    await sair().catch(() => {});
    setAviso(undefined);
    setUsuario(null);
  }

  if (usuario === undefined) return null;
  if (!usuario)
    return (
      <TelaLogin
        aviso={aviso}
        onEntrar={(u) => {
          setAviso(undefined);
          setUsuario(u);
        }}
      />
    );
  return <App usuario={usuario} onSair={encerrar} onSessaoExpirada={sessaoExpirada} />;
}
