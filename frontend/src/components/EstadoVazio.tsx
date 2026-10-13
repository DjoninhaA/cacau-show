interface Props {
  titulo: string;
  descricao?: string;
  acao: { label: string; onClick: () => void };
}

export function EstadoVazio({ titulo, descricao, acao }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-14 text-center shadow-sm">
      <svg aria-hidden viewBox="0 0 120 90" className="mb-5 w-32">
        <rect x="18" y="14" width="84" height="62" rx="10" fill="#6B3E26" />
        <g fill="#8A5537">
          <rect x="26" y="22" width="20" height="14" rx="3" />
          <rect x="50" y="22" width="20" height="14" rx="3" />
          <rect x="74" y="22" width="20" height="14" rx="3" />
          <rect x="26" y="40" width="20" height="14" rx="3" />
          <rect x="50" y="40" width="20" height="14" rx="3" />
          <rect x="74" y="40" width="20" height="14" rx="3" />
        </g>
        <path d="M18 60h84v6a10 10 0 0 1-10 10H28a10 10 0 0 1-10-10z" fill="#E9D8CC" />
      </svg>
      <p className="text-lg font-semibold text-stone-900">{titulo}</p>
      {descricao && <p className="mt-1 text-stone-500">{descricao}</p>}
      <button
        type="button"
        onClick={acao.onClick}
        className="mt-6 rounded-xl bg-cacau px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-cacau-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cacau"
      >
        {acao.label}
      </button>
    </div>
  );
}
