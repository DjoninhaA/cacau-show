import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { DadosRevendedor, Revendedor } from "../types/revendedor";
import { knownCriteria } from "../../shared/healthScore";
import { isValidCnpj, onlyDigits } from "../../shared/validation";
import { formatarCnpj, formatarTelefone } from "../utils/formatar";
import { CardNota } from "./CardNota";
import { ChecklistCriterios } from "./ChecklistCriterios";
import { DialogoConfirmacao } from "./DialogoConfirmacao";

const esquema = z.object({
  nomeEmpresa: z.string().trim().min(2, "Informe o nome da empresa (pelo menos 2 letras)"),
  cnpj: z
    .string()
    .refine((v) => onlyDigits(v).length > 0, "Informe o CNPJ")
    .refine((v) => onlyDigits(v).length === 0 || isValidCnpj(v), "Confira o CNPJ, ele parece incorreto"),
  responsavel: z.string().trim().min(2, "Informe o nome do responsável (pelo menos 2 letras)"),
  contato: z.string().refine((v) => {
    const n = onlyDigits(v).length;
    return n === 10 || n === 11;
  }, "Informe o telefone com DDD, ex.: (11) 98765-4321"),
  email: z.string().trim().min(1, "Informe o e-mail").pipe(z.email("Informe um e-mail válido")),
  criteriosMarcados: z.array(z.string()),
});

type Valores = z.infer<typeof esquema>;

interface Props {
  revendedor: Revendedor | null;
  onSalvar: (dados: DadosRevendedor) => Promise<void>;
  onExcluir: (revendedor: Revendedor) => void;
  onFechar: () => void;
}

const SELETOR_FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function PainelRevendedor({ revendedor, onSalvar, onExcluir, onFechar }: Props) {
  const painelRef = useRef<HTMLDivElement>(null);
  const [confirmacao, setConfirmacao] = useState<"descartar" | "excluir" | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Valores>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nomeEmpresa: revendedor?.nomeEmpresa ?? "",
      cnpj: formatarCnpj(revendedor?.cnpj ?? ""),
      responsavel: revendedor?.responsavel ?? "",
      contato: formatarTelefone(revendedor?.contato ?? ""),
      email: revendedor?.email ?? "",
      criteriosMarcados: knownCriteria(revendedor?.criteriosMarcados ?? []),
    },
  });

  // Foco no primeiro campo ao abrir; ao fechar, devolve o foco a quem abriu.
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    setFocus("nomeEmpresa");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      anterior?.focus();
    };
  }, [setFocus]);

  function tentarFechar() {
    if (isDirty) setConfirmacao("descartar");
    else onFechar();
  }

  function aoPressionarTecla(e: KeyboardEvent<HTMLDivElement>) {
    if (confirmacao) return;
    if (e.key === "Escape") {
      e.stopPropagation();
      tentarFechar();
      return;
    }
    // Mantém o Tab circulando dentro do painel.
    if (e.key === "Tab" && painelRef.current) {
      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }
  }

  async function enviar(valores: Valores) {
    await onSalvar({
      nomeEmpresa: valores.nomeEmpresa,
      cnpj: onlyDigits(valores.cnpj),
      responsavel: valores.responsavel,
      contato: onlyDigits(valores.contato),
      email: valores.email.toLowerCase(),
      criteriosMarcados: valores.criteriosMarcados,
    });
  }

  const titulo = revendedor ? revendedor.nomeEmpresa : "Novo revendedor";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onKeyDown={aoPressionarTecla}>
      <div className="absolute inset-0 animate-aparecer bg-stone-900/30" onClick={tentarFechar} />

      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="painel-titulo"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg animate-subir flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-stone-100 px-6 py-4">
          <h2 id="painel-titulo" className="truncate text-xl font-semibold text-cacau">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={tentarFechar}
            aria-label="Fechar"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-cacau"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(enviar)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            <section className="space-y-4">
              <h3 className="text-base font-semibold text-stone-900">Dados da empresa</h3>
              <Campo id="nomeEmpresa" label="Nome da empresa" erro={errors.nomeEmpresa?.message}>
                <input
                  id="nomeEmpresa"
                  autoComplete="organization"
                  placeholder="Ex.: Doce Sabor Ltda"
                  {...register("nomeEmpresa")}
                  {...atributosCampo("nomeEmpresa", errors.nomeEmpresa?.message)}
                />
              </Campo>
              <Campo id="cnpj" label="CNPJ" erro={errors.cnpj?.message}>
                <Controller
                  control={control}
                  name="cnpj"
                  render={({ field }) => (
                    <input
                      id="cnpj"
                      inputMode="numeric"
                      placeholder="00.000.000/0000-00"
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(formatarCnpj(e.target.value))}
                      {...atributosCampo("cnpj", errors.cnpj?.message)}
                    />
                  )}
                />
              </Campo>
              <Campo id="responsavel" label="Responsável" erro={errors.responsavel?.message}>
                <input
                  id="responsavel"
                  autoComplete="name"
                  placeholder="Ex.: Maria Souza"
                  {...register("responsavel")}
                  {...atributosCampo("responsavel", errors.responsavel?.message)}
                />
              </Campo>
              <Campo id="contato" label="Contato (telefone ou WhatsApp)" erro={errors.contato?.message}>
                <Controller
                  control={control}
                  name="contato"
                  render={({ field }) => (
                    <input
                      id="contato"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="(00) 00000-0000"
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(formatarTelefone(e.target.value))}
                      {...atributosCampo("contato", errors.contato?.message)}
                    />
                  )}
                />
              </Campo>
              <Campo id="email" label="E-mail" erro={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@empresa.com"
                  {...register("email")}
                  {...atributosCampo("email", errors.email?.message)}
                />
              </Campo>
            </section>

            <Controller
              control={control}
              name="criteriosMarcados"
              render={({ field }) => <ChecklistCriterios marcados={field.value} onChange={field.onChange} />}
            />
          </div>

          <footer className="space-y-4 border-t border-stone-100 bg-white px-6 py-4">
            <Controller
              control={control}
              name="criteriosMarcados"
              render={({ field }) => <CardNota marcados={field.value} />}
            />
            <div className="flex items-center justify-between gap-4">
              {revendedor ? (
                <button
                  type="button"
                  onClick={() => setConfirmacao("excluir")}
                  className="rounded-lg px-2 py-1 text-sm font-medium text-stone-500 underline-offset-4 hover:text-red-600 hover:underline focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  Excluir
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-cacau px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-cacau-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cacau disabled:opacity-60"
              >
                Salvar
              </button>
            </div>
          </footer>
        </form>
      </div>

      {confirmacao === "descartar" && (
        <DialogoConfirmacao
          titulo="Descartar alterações?"
          descricao="As informações que você preencheu não serão salvas."
          confirmar="Descartar"
          perigo
          onConfirmar={onFechar}
          onCancelar={() => setConfirmacao(null)}
        />
      )}
      {confirmacao === "excluir" && revendedor && (
        <DialogoConfirmacao
          titulo={`Excluir ${revendedor.nomeEmpresa}?`}
          confirmar="Excluir"
          perigo
          onConfirmar={() => onExcluir(revendedor)}
          onCancelar={() => setConfirmacao(null)}
        />
      )}
    </div>
  );
}

function atributosCampo(id: string, erro?: string) {
  return {
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": erro ? `${id}-erro` : undefined,
    className: `w-full rounded-xl border bg-white px-3.5 py-2.5 text-base placeholder:text-stone-400 focus:ring-2 focus:outline-none ${
      erro
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-stone-200 focus:border-cacau focus:ring-cacau/20"
    }`,
  };
}

function Campo({ id, label, erro, children }: { id: string; label: string; erro?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
