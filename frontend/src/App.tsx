import { useCallback, useEffect, useMemo, useState } from "react";
import { BuscaRevendedor } from "./components/BuscaRevendedor";
import { EstadoVazio } from "./components/EstadoVazio";
import { ListaRevendedores } from "./components/ListaRevendedores";
import { PainelRevendedor } from "./components/PainelRevendedor";
import { ResumoStatus } from "./components/ResumoStatus";
import { Toast, type ToastDados } from "./components/Toast";
import * as servico from "./services/revendedores";
import type { DadosRevendedor, Revendedor, StatusHealth } from "./types/revendedor";
import { normalizar } from "./utils/formatar";

type Painel = { revendedor: Revendedor | null } | null;

export default function App() {
  const [revendedores, setRevendedores] = useState<Revendedor[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [filtro, setFiltro] = useState<StatusHealth | null>(null);
  const [busca, setBusca] = useState("");
  const [painel, setPainel] = useState<Painel>(null);
  const [toast, setToast] = useState<ToastDados | null>(null);

  const recarregar = useCallback(async () => {
    setRevendedores(await servico.listar());
    setCarregado(true);
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const mostrarToast = useCallback((mensagem: string, acao?: ToastDados["acao"]) => {
    setToast({ id: Date.now(), mensagem, acao });
  }, []);
  const fecharToast = useCallback(() => setToast(null), []);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca);
    return revendedores
      .filter((r) => !filtro || r.status === filtro)
      .filter(
        (r) => !termo || normalizar(r.nomeEmpresa).includes(termo) || normalizar(r.responsavel).includes(termo),
      )
      .sort((a, b) => a.nota - b.nota || a.nomeEmpresa.localeCompare(b.nomeEmpresa, "pt-BR"));
  }, [revendedores, filtro, busca]);

  const abrirNovo = () => setPainel({ revendedor: null });

  async function salvar(dados: DadosRevendedor) {
    if (painel?.revendedor) await servico.atualizar(painel.revendedor.id, dados);
    else await servico.criar(dados);
    await recarregar();
    setPainel(null);
    mostrarToast("Revendedor salvo");
  }

  async function excluir(revendedor: Revendedor) {
    await servico.excluir(revendedor.id);
    await recarregar();
    setPainel(null);
    mostrarToast("Revendedor excluído", {
      label: "Desfazer",
      onClick: async () => {
        await servico.restaurar(revendedor);
        await recarregar();
        mostrarToast("Revendedor restaurado");
      },
    });
  }

  function limparFiltros() {
    setFiltro(null);
    setBusca("");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-cacau sm:text-3xl">
          <span aria-hidden>🍫 </span>Revendedores
        </h1>
        <button
          type="button"
          onClick={abrirNovo}
          className="rounded-xl bg-cacau px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-cacau-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cacau"
        >
          + Novo revendedor
        </button>
      </header>

      {carregado && revendedores.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum revendedor cadastrado ainda"
          descricao="Cadastre um revendedor para acompanhar como está o relacionamento."
          acao={{ label: "Cadastrar o primeiro", onClick: abrirNovo }}
        />
      ) : (
        <div className="space-y-6">
          <ResumoStatus revendedores={revendedores} filtro={filtro} onFiltrar={setFiltro} />
          <BuscaRevendedor valor={busca} onChange={setBusca} />
          {visiveis.length > 0 ? (
            <ListaRevendedores revendedores={visiveis} onAbrir={(r) => setPainel({ revendedor: r })} />
          ) : (
            carregado && (
              <EstadoVazio
                titulo="Nenhum revendedor encontrado"
                descricao="Tente outra busca ou remova o filtro de status."
                acao={{ label: "Limpar filtros", onClick: limparFiltros }}
              />
            )
          )}
        </div>
      )}

      {painel && (
        <PainelRevendedor
          key={painel.revendedor?.id ?? "novo"}
          revendedor={painel.revendedor}
          onSalvar={salvar}
          onExcluir={excluir}
          onFechar={() => setPainel(null)}
        />
      )}

      <Toast toast={toast} onFechar={fecharToast} />
    </div>
  );
}
