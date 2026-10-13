interface Props {
  valor: string;
  onChange: (valor: string) => void;
}

export function BuscaRevendedor({ valor, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-stone-400"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por empresa ou responsável..."
        aria-label="Buscar por empresa ou responsável"
        className="w-full rounded-2xl border border-stone-200 bg-white py-3 pr-4 pl-12 text-base shadow-sm placeholder:text-stone-400 focus:border-cacau focus:ring-2 focus:ring-cacau/20 focus:outline-none"
      />
    </div>
  );
}
